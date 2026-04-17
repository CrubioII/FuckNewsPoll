import { useState } from 'react'
import { submitVote } from '../lib/api'
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

    try {
      const { alreadyVoted } = await submitVote(comediante, deviceId)
      if (alreadyVoted) {
        setHasVoted(true)
        setHasVotedState(true)
      } else {
        setHasVoted(true)
        setHasVotedState(true)
      }
    } catch {
      setError('Error al votar. Intenta de nuevo.')
    } finally {
      setVoting(false)
    }
  }

  function resetVoteState() {
    setHasVotedState(getHasVoted())
    setError(null)
  }

  return { hasVoted, voting, error, vote, resetVoteState }
}
