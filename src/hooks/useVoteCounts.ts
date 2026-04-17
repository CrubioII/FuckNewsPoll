import { useEffect, useState } from 'react'
import { fetchCounts } from '../lib/api'

interface VoteCounts {
  magoCount: number
  camiloCount: number
  total: number
}

export function useVoteCounts() {
  const [counts, setCounts] = useState<VoteCounts>({
    magoCount: 0,
    camiloCount: 0,
    total: 0,
  })

  useEffect(() => {
    async function loadCounts() {
      try {
        const data = await fetchCounts()
        setCounts(data)
      } catch {
        // fail silently on poll error
      }
    }

    loadCounts()
    const interval = setInterval(loadCounts, 2000)
    return () => clearInterval(interval)
  }, [])

  return counts
}
