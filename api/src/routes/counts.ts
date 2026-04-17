import { Router } from 'express'
import { getDb } from '../db'

const router = Router()

router.get('/', async (_, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
  try {
    const result = await getDb().request().query(`
      SELECT mago_count, camilo_count, total FROM resultados_votos WHERE id = 1
    `)
    const row = result.recordset[0]
    if (!row) {
      res.status(404).json({ error: 'Counts not found' })
      return
    }
    res.json({
      magoCount: row.mago_count,
      camiloCount: row.camilo_count,
      total: row.total,
    })
  } catch (err) {
    console.error('GET /counts error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
