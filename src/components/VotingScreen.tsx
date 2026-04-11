import VoteButton from './VoteButton'
import ProgressBar from './ProgressBar'

interface VotingScreenProps {
  hasVoted: boolean
  voting: boolean
  error: string | null
  onVote: (comediante: 'mago' | 'camilo') => void
  magoCount: number
  camiloCount: number
  total: number
}

export default function VotingScreen({
  hasVoted,
  voting,
  error,
  onVote,
  magoCount,
  camiloCount,
  total,
}: VotingScreenProps) {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative z-10"
      style={{ animation: 'slide-up 0.6s ease-out' }}
    >
      {/* Main panel */}
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #0F0F1A 0%, #0A0A14 100%)',
          boxShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 1px rgba(204, 32, 32, 0.3), inset 0 1px 0 rgba(255,255,255,0.03)',
          border: '1px solid rgba(204, 32, 32, 0.15)',
        }}
      >
        {/* Header */}
        <div className="text-center pt-5 pb-3 px-6">
          {/* Decorative top line */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-10 bg-gradient-to-r from-transparent to-gold/40" />
            <div
              className="text-[10px] tracking-[0.5em] text-gold/60 uppercase"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              en vivo
            </div>
            <div className="h-px w-10 bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          <h2
            className="text-5xl sm:text-6xl text-white tracking-wider"
            style={{
              fontFamily: 'var(--font-display)',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            BATALLA
          </h2>

          <div className="flex items-center justify-center gap-3 mt-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/20" />
            <div className="w-1 h-1 rotate-45 bg-gold/50" />
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/20" />
          </div>
        </div>

        {/* Vote buttons */}
        <div className="px-5 pb-4 space-y-3">
          <VoteButton
            comediante="mago"
            label="MAGO"
            subtitle="Camilo Pardo"
            onClick={() => onVote('mago')}
            disabled={hasVoted || voting}
          />
          <div
            className="text-center text-white/30 text-xs tracking-[0.4em] uppercase py-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            vs
          </div>
          <VoteButton
            comediante="camilo"
            label="CAMILO"
            subtitle="Camilo Sánchez"
            onClick={() => onVote('camilo')}
            disabled={hasVoted || voting}
          />
        </div>

        {/* Confirmation / Error */}
        {hasVoted && (
          <div
            className="text-center pb-2"
            style={{ animation: 'confirmed-pop 0.5s ease-out' }}
          >
            <span
              className="text-white text-sm tracking-widest uppercase"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              ¡Voto registrado!
            </span>
          </div>
        )}
        {error && (
          <div className="text-center pb-2">
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="px-5 pb-6 pt-2">
          <ProgressBar
            magoCount={magoCount}
            camiloCount={camiloCount}
            total={total}
          />
        </div>
      </div>
    </div>
  )
}
