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
      SELECT mago_count, camilo_count, total FROM resultados_votos WHERE id = 1
    `)
    const row = result.recordset[0]
    if (!row) {
      res.status(404).json({ error: 'Counts not found' })
      return
    }
    const value = {
      magoCount: row.mago_count,
      camiloCount: row.camilo_count,
      total: row.total,
    }
    cache = { value, expiresAt: Date.now() + TTL_MS }
    res.json(value)
  } catch (err) {
    console.error('GET /counts error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
