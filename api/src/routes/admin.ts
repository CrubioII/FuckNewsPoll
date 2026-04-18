import { Router } from 'express'
import sql from 'mssql'
import { getDb } from '../db'
import { requireAdmin } from '../middleware/auth'
import { invalidateStateCache } from './state'
import { invalidateCountsCache } from './counts'
import { resetQueue } from '../voteQueue'

const router = Router()

router.post('/:action', requireAdmin, async (req, res) => {
  const { action } = req.params
  const db = getDb()

  try {
    switch (action) {
      case 'start': {
        await db.request().query(`
          UPDATE app_state
          SET is_active_round = 1, updated_at = SYSDATETIMEOFFSET()
          WHERE id = 1
        `)
        break
      }

      case 'stop': {
        const result = await db.request().query(`
          SELECT mago_count, camilo_count FROM resultados_votos WHERE id = 1
        `)
        const row = result.recordset[0]
        const winner = row && row.mago_count >= row.camilo_count ? 'mago' : 'camilo'

        await db.request()
          .input('winner', sql.VarChar(10), winner)
          .query(`
            UPDATE app_state
            SET is_active_round = 0, winner = @winner, updated_at = SYSDATETIMEOFFSET()
            WHERE id = 1
          `)
        break
      }

      case 'reset': {
        resetQueue()
        await db.request().query(`DELETE FROM votos`)
        await db.request().query(`
          UPDATE app_state
          SET is_active_round = 0, winner = NULL, updated_at = SYSDATETIMEOFFSET()
          WHERE id = 1
        `)
        break
      }

      default:
        res.status(400).json({ error: 'Invalid action' })
        return
    }

    invalidateStateCache()
    invalidateCountsCache()
    res.json({ success: true })
  } catch (err) {
    console.error(`POST /admin/${action} error:`, err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
