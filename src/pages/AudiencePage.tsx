import { useEffect } from 'react'
import { useAppState } from '../hooks/useAppState'
import { useVoteCounts } from '../hooks/useVoteCounts'
import { useVote } from '../hooks/useVote'
import IdleScreen from '../components/IdleScreen'
import VotingScreen from '../components/VotingScreen'

export default function AudiencePage() {
  const { isActiveRound, loading } = useAppState()
  const { magoCount, camiloCount, total } = useVoteCounts()
  const { hasVoted, voting, error, vote, resetVoteState } = useVote()

  // Reset vote state when a new round starts
  useEffect(() => {
    if (isActiveRound) {
      resetVoteState()
    }
  }, [isActiveRound])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div
          className="w-6 h-6 rounded-full border-2 border-gold/30 border-t-gold animate-spin"
        />
      </div>
    )
  }

  if (!isActiveRound) {
    return <IdleScreen />
  }

  return (
    <VotingScreen
      hasVoted={hasVoted}
      voting={voting}
      error={error}
      onVote={vote}
      magoCount={magoCount}
      camiloCount={camiloCount}
      total={total}
    />
  )
}
