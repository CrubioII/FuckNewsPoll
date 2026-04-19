import { Router } from 'express'
import { getDb } from '../db'

const router = Router()

let cache: { value: object; expiresAt: number } | null = null
const TTL_MS = 500

router.get('/', async (_, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

  if (cache && Date.now() < cache.expiresAt) {
    res.json(cache.value)
    return
  }

  try {
    const result = await getDb().request().query(`
      SELECT is_active_round, winner FROM app_state WHERE id = 1
    `)
    const row = result.recordset[0]
    if (!row) {
      res.status(404).json({ error: 'State not found' })
      return
    }
    const value = {
      isActiveRound: row.is_active_round === true || row.is_active_round === 1,
      winner: row.winner ?? null,
    }
    cache = { value, expiresAt: Date.now() + TTL_MS }
    res.json(value)
  } catch (err) {
    console.error('GET /state error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
