import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import path from 'path'
import { initDb } from './db'
import stateRouter from './routes/state'
import countsRouter from './routes/counts'
import voteRouter from './routes/vote'
import adminRouter from './routes/admin'

const app = express()
const PORT = Number(process.env.PORT) || 3001

app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
app.use(express.json())

const distPath = path.join(__dirname, '..', '..', 'dist')
app.use(express.static(distPath))

app.get('/health', (_, res) => res.json({ ok: true }))
app.use('/api/state', stateRouter)
app.use('/api/counts', countsRouter)
app.use('/api/vote', voteRouter)
app.use('/api/admin', adminRouter)

app.get('*', (_, res) => res.sendFile(path.join(distPath, 'index.html')))

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
