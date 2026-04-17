import { Router } from 'express'
import sql from 'mssql'
import { getDb } from '../db'

const router = Router()

router.post('/', async (req, res) => {
  const { comediante, device_id } = req.body

  if (!comediante || !['mago', 'camilo'].includes(comediante)) {
    res.status(400).json({ error: 'Invalid comediante' })
    return
  }
  if (!device_id || typeof device_id !== 'string' || device_id.length > 64) {
    res.status(400).json({ error: 'Invalid device_id' })
    return
  }

  try {
    await getDb().request()
      .input('comediante', sql.VarChar(10), comediante)
      .input('device_id', sql.VarChar(64), device_id)
      .query(`INSERT INTO votos (comediante, device_id) VALUES (@comediante, @device_id)`)

    res.status(201).json({ success: true })
  } catch (err: any) {
    // SQL Server unique constraint violation = error number 2627
    if (err.number === 2627) {
      res.status(409).json({ error: 'already_voted' })
      return
    }
    console.error('POST /vote error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
