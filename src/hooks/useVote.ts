import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { getDeviceId, getHasVoted, setHasVoted } from '../lib/device'

type Comediante = 'mago' | 'camilo'

export function useVote() {
  const [hasVoted, setHasVotedState] = useState(getHasVoted())
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function vote(comediante: Comediante) {
    if (hasVoted || voting) return

    setVoting(true)
    setError(null)

    const deviceId = getDeviceId()

    const { error: insertError } = await supabase
      .from('votos')
      .insert({ comediante, device_id: deviceId })

    if (insertError) {
      // Unique constraint violation = already voted
      if (insertError.code === '23505') {
        setHasVoted(true)
        setHasVotedState(true)
      } else {
        setError('Error al votar. Intenta de nuevo.')
      }
    } else {
      setHasVoted(true)
      setHasVotedState(true)
    }

    setVoting(false)
  }

  // Allow resetting state when a new round starts
  function resetVoteState() {
    setHasVotedState(getHasVoted())
    setError(null)
  }

  return { hasVoted, voting, error, vote, resetVoteState }
}
