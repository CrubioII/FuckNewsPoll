import { Router } from 'express'
import { getDb } from '../db'

const router = Router()

router.get('/', async (_, res) => {
  try {
    const result = await getDb().request().query(`
      SELECT is_active_round, winner FROM app_state WHERE id = 1
    `)
    const row = result.recordset[0]
    if (!row) {
      res.status(404).json({ error: 'State not found' })
      return
    }
    res.json({
      isActiveRound: row.is_active_round === true || row.is_active_round === 1,
      winner: row.winner ?? null,
    })
  } catch (err) {
    console.error('GET /state error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
