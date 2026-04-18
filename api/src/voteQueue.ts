import sql from 'mssql'
import { getDb } from './db'
import { invalidateCountsCache } from './routes/counts'

interface Vote {
  comediante: string
  device_id: string
}

const queue: Vote[] = []
const seenDevices = new Set<string>()
let flushTimer: ReturnType<typeof setTimeout> | null = null

const FLUSH_INTERVAL_MS = 100

export function enqueueVote(comediante: string, device_id: string): 'ok' | 'duplicate' {
  if (seenDevices.has(device_id)) return 'duplicate'
  seenDevices.add(device_id)
  queue.push({ comediante, device_id })
  if (!flushTimer) flushTimer = setTimeout(flush, FLUSH_INTERVAL_MS)
  return 'ok'
}

export function resetQueue(): void {
  queue.length = 0
  seenDevices.clear()
  if (flushTimer) { clearTimeout(flushTimer); flushTimer = null }
}

async function flush(): Promise<void> {
  flushTimer = null
  if (!queue.length) return

  const batch = queue.splice(0, queue.length)

  try {
    const req = getDb().request()
    const valueClauses = batch.map((v, i) => {
      req.input(`c${i}`, sql.VarChar(10), v.comediante)
      req.input(`d${i}`, sql.VarChar(64), v.device_id)
      return `(@c${i}, @d${i})`
    })

    await req.query(`
      MERGE votos AS target
      USING (VALUES ${valueClauses.join(', ')}) AS source(comediante, device_id)
        ON target.device_id = source.device_id
      WHEN NOT MATCHED THEN
        INSERT (comediante, device_id) VALUES (source.comediante, source.device_id);
    `)

    invalidateCountsCache()
  } catch (err) {
    console.error('Vote batch flush error:', err)
  }

  if (queue.length) flushTimer = setTimeout(flush, FLUSH_INTERVAL_MS)
}
