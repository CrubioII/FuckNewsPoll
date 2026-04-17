import { useEffect, useState, useRef } from 'react'
import { fetchState } from '../lib/api'
import { setHasVoted } from '../lib/device'

export function useAppState() {
  const [isActiveRound, setIsActiveRound] = useState(false)
  const [winner, setWinner] = useState<'mago' | 'camilo' | null>(null)
  const [loading, setLoading] = useState(true)
  const prevActiveRef = useRef(false)

  useEffect(() => {
    async function loadState() {
      try {
        const data = await fetchState()
        const newActive = data.isActiveRound
        if (newActive && !prevActiveRef.current) {
          setHasVoted(false)
        }
        prevActiveRef.current = newActive
        setIsActiveRound(newActive)
        setWinner(data.winner)
      } catch {
        // fail silently on poll error
      } finally {
        setLoading(false)
      }
    }

    loadState()
    const interval = setInterval(loadState, 3000)
    return () => clearInterval(interval)
  }, [])

  return { isActiveRound, winner, loading }
}
