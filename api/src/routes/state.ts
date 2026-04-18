import { Router } from 'express'
import { getDb } from '../db'

const router = Router()

const TTL_MS = 300
let cache: { data: object; expiresAt: number } | null = null
let inflight: Promise<object> | null = null

export function invalidateStateCache() { cache = null }

async function fetchFromDb(): Promise<object> {
  const result = await getDb().request().query(`
    SELECT is_active_round, winner FROM app_state WHERE id = 1
  `)
  const row = result.recordset[0]
  if (!row) throw Object.assign(new Error('State not found'), { status: 404 })
  return {
    isActiveRound: row.is_active_round === true || row.is_active_round === 1,
    winner: row.winner ?? null,
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
    console.error('GET /state error:', err)
    if (err.status === 404) res.status(404).json({ error: 'State not found' })
    else res.status(500).json({ error: 'Server error' })
  }
})

export default router
