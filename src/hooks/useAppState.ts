import { useEffect, useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { setHasVoted } from '../lib/device'

export function useAppState() {
  const [isActiveRound, setIsActiveRound] = useState(false)
  const [loading, setLoading] = useState(true)
  const prevActiveRef = useRef(false)

  useEffect(() => {
    // Fetch initial state
    supabase
      .from('app_state')
      .select('is_active_round')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) {
          setIsActiveRound(data.is_active_round)
          prevActiveRef.current = data.is_active_round
        }
        setLoading(false)
      })

    // Subscribe to realtime updates
    const channel = supabase
      .channel('app-state')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'app_state',
          filter: 'id=eq.1',
        },
        (payload) => {
          const newActive = payload.new.is_active_round as boolean
          // If a new round starts, clear the has-voted flag
          if (newActive && !prevActiveRef.current) {
            setHasVoted(false)
          }
          prevActiveRef.current = newActive
          setIsActiveRound(newActive)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return { isActiveRound, loading }
}
