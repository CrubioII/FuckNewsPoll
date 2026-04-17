import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { initDb } from './db'
import stateRouter from './routes/state'
import countsRouter from './routes/counts'
import voteRouter from './routes/vote'
import adminRouter from './routes/admin'

dotenv.config()

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : '*',
}))
app.use(express.json())

app.get('/health', (_, res) => res.json({ ok: true }))
app.use('/api/state', stateRouter)
app.use('/api/counts', countsRouter)
app.use('/api/vote', voteRouter)
app.use('/api/admin', adminRouter)

async function start() {
  try {
    await initDb()
    app.listen(PORT, () => console.log(`API running on :${PORT}`))
  } catch (err) {
    console.error('Failed to start:', err)
    process.exit(1)
  }
}

start()
