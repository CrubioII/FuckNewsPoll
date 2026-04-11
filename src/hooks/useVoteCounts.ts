import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

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

  const fetchCounts = useCallback(async () => {
    const { data } = await supabase
      .from('vote_counts')
      .select('mago_count, camilo_count, total')
      .single()

    if (data) {
      setCounts({
        magoCount: Number(data.mago_count),
        camiloCount: Number(data.camilo_count),
        total: Number(data.total),
      })
    }
  }, [])

  useEffect(() => {
    fetchCounts()

    const channel = supabase
      .channel('vote-counts')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votos',
        },
        () => {
          fetchCounts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchCounts])

  return counts
}
