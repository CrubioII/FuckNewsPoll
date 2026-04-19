/**
 * Load test: simulates N users hitting /api/state, /api/counts, then POST /api/vote
 * Usage: node loadtest/run.mjs --url http://localhost:3001 --users 2000 --concurrency 100
 */

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.slice(2).split('='); return [k, v] })
)

const BASE_URL    = args.url         || 'http://localhost:3001'
const TOTAL_USERS = parseInt(args.users       || '2000')
const CONCURRENCY = parseInt(args.concurrency || '100')
const COMEDIAN    = args.comedian    || 'mago'   // 'mago' | 'camilo'
const TIMEOUT_MS  = parseInt(args.timeout      || '15000')

// ── helpers ──────────────────────────────────────────────────────────────────

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function percentile(sorted, p) {
  const idx = Math.ceil((p / 100) * sorted.length) - 1
  return sorted[Math.max(0, idx)]
}

function stats(arr) {
  if (!arr.length) return { min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0 }
  const sorted = [...arr].sort((a, b) => a - b)
  const avg = arr.reduce((s, v) => s + v, 0) / arr.length
  return {
    min:  sorted[0],
    max:  sorted[sorted.length - 1],
    avg:  Math.round(avg),
    p50:  percentile(sorted, 50),
    p95:  percentile(sorted, 95),
    p99:  percentile(sorted, 99),
  }
}

async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController()
  const tid = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { ...opts, signal: ctrl.signal })
    return res
  } finally {
    clearTimeout(tid)
  }
}

// ── single-user simulation ────────────────────────────────────────────────────

async function simulateUser(userId) {
  const deviceId = `loadtest-${uuid()}`
  const result = {
    userId,
    pageLoadMs: null,   // state + counts fetched in parallel (simulates React mount)
    voteMs:     null,
    errors:     [],
  }

  // Phase 1 — page load (state + counts in parallel, same as app does)
  const t0 = Date.now()
  try {
    await Promise.all([
      fetchWithTimeout(`${BASE_URL}/api/state`),
      fetchWithTimeout(`${BASE_URL}/api/counts`),
    ])
    result.pageLoadMs = Date.now() - t0
  } catch (err) {
    result.errors.push(`pageLoad: ${err.message}`)
  }

  // Phase 2 — vote
  const t1 = Date.now()
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/api/vote`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ comediante: COMEDIAN, device_id: deviceId }),
    })
    result.voteMs = Date.now() - t1
    if (res.status === 409) result.voteStatus = 'duplicate'
    else if (!res.ok)       result.errors.push(`vote: HTTP ${res.status}`)
    else                    result.voteStatus = 'ok'
  } catch (err) {
    result.errors.push(`vote: ${err.message}`)
  }

  return result
}

// ── runner: process users in batches of CONCURRENCY ──────────────────────────

async function run() {
  console.log(`\n FuckNewsPoll Load Test`)
  console.log(`   Target  : ${BASE_URL}`)
  console.log(`   Users   : ${TOTAL_USERS}`)
  console.log(`   Concur  : ${CONCURRENCY}`)
  console.log(`   Comedian: ${COMEDIAN}`)
  console.log(`   Timeout : ${TIMEOUT_MS}ms\n`)

  // quick health check
  try {
    const h = await fetchWithTimeout(`${BASE_URL}/health`)
    if (!h.ok) throw new Error(`status ${h.status}`)
    console.log(' Server healthy — starting test...\n')
  } catch (e) {
    console.error(` Health check failed: ${e.message}`)
    console.error('   Is the API running? ')
    process.exit(1)
  }

  const results      = []
  const totalStart   = Date.now()
  let   completed    = 0
  let   errorCount   = 0

  for (let batch = 0; batch < TOTAL_USERS; batch += CONCURRENCY) {
    const size  = Math.min(CONCURRENCY, TOTAL_USERS - batch)
    const users = Array.from({ length: size }, (_, i) => simulateUser(batch + i + 1))
    const batch_results = await Promise.allSettled(users)

    for (const r of batch_results) {
      if (r.status === 'fulfilled') {
        results.push(r.value)
        if (r.value.errors.length) errorCount++
      } else {
        errorCount++
      }
      completed++
    }

    const pct = Math.round((completed / TOTAL_USERS) * 100)
    process.stdout.write(`\r   Progress: ${completed}/${TOTAL_USERS} (${pct}%)   `)
  }

  const totalMs = Date.now() - totalStart
  console.log('\n')

  // ── results ─────────────────────────────────────────────────────────────────

  const pageLoadTimes = results.map(r => r.pageLoadMs).filter(Boolean)
  const voteTimes     = results.map(r => r.voteMs).filter(Boolean)
  const voteOk        = results.filter(r => r.voteStatus === 'ok').length
  const voteDup       = results.filter(r => r.voteStatus === 'duplicate').length

  const plStats = stats(pageLoadTimes)
  const vtStats = stats(voteTimes)

  console.log('═══════════════════════════════════════════════')
  console.log('  RESULTS')
  console.log('═══════════════════════════════════════════════')
  console.log(`  Total users    : ${TOTAL_USERS}`)
  console.log(`  Wall time      : ${(totalMs / 1000).toFixed(2)}s`)
  console.log(`  Throughput     : ${Math.round(TOTAL_USERS / (totalMs / 1000))} users/s`)
  console.log(`  Errors         : ${errorCount}`)
  console.log(`  Votes accepted : ${voteOk}`)
  console.log(`  Votes duplicate: ${voteDup}`)
  console.log('')
  console.log('  PAGE LOAD (state + counts parallel)  [ms]')
  console.log(`    min  : ${plStats.min}`)
  console.log(`    avg  : ${plStats.avg}`)
  console.log(`    p50  : ${plStats.p50}`)
  console.log(`    p95  : ${plStats.p95}`)
  console.log(`    p99  : ${plStats.p99}`)
  console.log(`    max  : ${plStats.max}`)
  console.log('')
  console.log('  VOTE SUBMIT (POST /api/vote)          [ms]')
  console.log(`    min  : ${vtStats.min}`)
  console.log(`    avg  : ${vtStats.avg}`)
  console.log(`    p50  : ${vtStats.p50}`)
  console.log(`    p95  : ${vtStats.p95}`)
  console.log(`    p99  : ${vtStats.p99}`)
  console.log(`    max  : ${vtStats.max}`)
  console.log('═══════════════════════════════════════════════')

  // show first 5 errors if any
  const errSamples = results.flatMap(r => r.errors).slice(0, 5)
  if (errSamples.length) {
    console.log('\n  Sample errors:')
    errSamples.forEach(e => console.log(`    - ${e}`))
  }

  console.log('')
}

run().catch(err => { console.error(err); process.exit(1) })
