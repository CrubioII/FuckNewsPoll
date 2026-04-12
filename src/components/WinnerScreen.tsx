import { useMemo } from 'react'
import ProgressBar from './ProgressBar'

interface WinnerScreenProps {
  winner: 'mago' | 'camilo'
  magoCount: number
  camiloCount: number
  total: number
}

interface EmojiParticle {
  id: number
  left: number
  delay: number
  duration: number
  size: number
}

function EmojiRain({ emoji }: { emoji: string }) {
  const particles = useMemo<EmojiParticle[]>(() => (
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 2 + Math.random() * 3,
      size: 1.4 + Math.random() * 2,
    }))
  ), [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <span
          key={p.id}
          style={{
            position: 'fixed',
            left: `${p.left}%`,
            top: '-5%',
            fontSize: `${p.size}em`,
            lineHeight: 1,
            animationName: 'emoji-fall',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
            animationFillMode: 'both',
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  )
}

export default function WinnerScreen({ winner, magoCount, camiloCount, total }: WinnerScreenProps) {
  const isMago = winner === 'mago'
  const winnerName = isMago ? 'Camilo Pardo' : 'Camilo Sánchez'
  const winnerLabel = isMago ? 'MAGO' : 'CAMILO'
  const emoji = isMago ? '🍆' : '🍆'
  const glowColor = isMago ? 'rgba(255,0,0,0.6)' : 'rgba(0,71,171,0.6)'
  const textGlow = isMago ? '#FF3030' : '#2060FF'
  const accentColor = isMago ? '#FF2020' : '#0057D4'

  return (
    <>
      <EmojiRain emoji={emoji} />

      <div
        className="flex-1 flex flex-col items-center justify-center px-4 py-6 relative z-10"
        style={{ animation: 'slide-up 0.5s ease-out' }}
      >
        <div className="w-full max-w-md flex flex-col items-center gap-6">

          {/* GANADOR label */}
          <div
            className="text-[11px] tracking-[0.7em] uppercase font-bold text-white/40"
            style={{
              fontFamily: 'var(--font-heading)',
              animation: 'winner-reveal 0.7s ease-out 0.2s both',
            }}
          >
            — ganador —
          </div>

          {/* Winner name — text-shadow glow, no box */}
          <div
            className="flex flex-col items-center gap-2"
            style={{ animation: 'winner-reveal 0.8s ease-out 0.45s both' }}
          >
            <div
              className="text-7xl sm:text-8xl md:text-9xl font-bold leading-none text-center"
              style={{
                fontFamily: 'var(--font-display)',
                color: '#ffffff',
                letterSpacing: '0.05em',
                animation: 'text-glow-pulse 2s ease-in-out infinite',
                '--text-glow': textGlow,
              } as React.CSSProperties}
            >
              {winnerLabel}
            </div>
            <div
              className="text-sm tracking-[0.35em] uppercase font-semibold"
              style={{
                fontFamily: 'var(--font-heading)',
                color: accentColor,
                textShadow: `0 0 12px ${textGlow}`,
              }}
            >
              {winnerName}
            </div>
          </div>

          {/* Results bar */}
          <div
            className="w-full rounded-2xl overflow-hidden p-5"
            style={{
              background: 'linear-gradient(180deg, #0F0F1A 0%, #0A0A14 100%)',
              border: '1px solid rgba(255,255,255,0.06)',
              boxShadow: `0 0 40px rgba(0,0,0,0.6), 0 0 25px ${glowColor}`,
              animation: 'winner-reveal 0.7s ease-out 0.85s both',
            }}
          >
            <div
              className="text-center text-[10px] tracking-[0.5em] text-white/30 uppercase mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              resultado final
            </div>
            <ProgressBar
              magoCount={magoCount}
              camiloCount={camiloCount}
              total={total}
              showExactCounts
              winner={winner}
            />
          </div>

        </div>
      </div>
    </>
  )
}
