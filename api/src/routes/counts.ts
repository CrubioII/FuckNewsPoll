import { Router } from 'express'
import { getDb } from '../db'

const router = Router()

const TTL_MS = 300
let cache: { data: object; expiresAt: number } | null = null
let inflight: Promise<object> | null = null

export function invalidateCountsCache() { cache = null }

async function fetchFromDb(): Promise<object> {
  const result = await getDb().request().query(`
    SELECT mago_count, camilo_count, total FROM resultados_votos WHERE id = 1
  `)
  const row = result.recordset[0]
  if (!row) throw Object.assign(new Error('Counts not found'), { status: 404 })
  return {
    magoCount: row.mago_count,
    camiloCount: row.camilo_count,
    total: row.total,
  }
}

router.get('/', async (_, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')

  if (cache && Date.now() < cache.expiresAt) {
    res.json(cache.data)
    return
  }

  try {
    if (!inflight) {
      inflight = fetchFromDb().then(data => {
        cache = { data, expiresAt: Date.now() + TTL_MS }
        inflight = null
        return data
      }).catch(err => {
        inflight = null
        throw err
      })
    }
    const data = await inflight
    res.json(data)
  } catch (err: any) {
    console.error('GET /counts error:', err)
    if (err.status === 404) res.status(404).json({ error: 'Counts not found' })
    else res.status(500).json({ error: 'Server error' })
  }
})

export default router
