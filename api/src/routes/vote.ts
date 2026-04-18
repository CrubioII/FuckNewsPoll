import { Router } from 'express'
import { enqueueVote } from '../voteQueue'

const router = Router()

router.post('/', (req, res) => {
  const { comediante, device_id } = req.body

  if (!comediante || !['mago', 'camilo'].includes(comediante)) {
    res.status(400).json({ error: 'Invalid comediante' })
    return
  }
  if (!device_id || typeof device_id !== 'string' || device_id.length > 64) {
    res.status(400).json({ error: 'Invalid device_id' })
    return
  }

  const result = enqueueVote(comediante, device_id)
  if (result === 'duplicate') {
    res.status(409).json({ error: 'already_voted' })
    return
  }
  res.status(201).json({ success: true })
})

export default router
