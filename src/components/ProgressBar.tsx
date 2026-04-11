interface ProgressBarProps {
  magoCount: number
  camiloCount: number
  total: number
  showExactCounts?: boolean
}

export default function ProgressBar({ magoCount, camiloCount, total, showExactCounts = false }: ProgressBarProps) {
  const magoPercent = total > 0 ? (magoCount / total) * 100 : 50
  const camiloPercent = total > 0 ? (camiloCount / total) * 100 : 50

  return (
    <div className="w-full">
      {/* Labels above the bar */}
      <div className="flex justify-between mb-2 text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-heading)' }}>
        <span className="text-mago-red font-semibold">
          Mago
          {showExactCounts && <span className="text-white/50 ml-2 text-xs">({magoCount})</span>}
        </span>
        <span className="text-camilo-blue font-semibold">
          {showExactCounts && <span className="text-white/50 mr-2 text-xs">({camiloCount})</span>}
          Camilo
        </span>
      </div>

      {/* Bar container */}
      <div
        className="relative h-10 sm:h-12 rounded-lg overflow-hidden"
        style={{
          background: '#111',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* Mago side (left) */}
        <div
          className="absolute top-0 left-0 h-full flex items-center justify-center"
          style={{
            width: `${magoPercent}%`,
            background: 'linear-gradient(180deg, #FF2020 0%, #CC0000 50%, #990000 100%)',
            boxShadow: '0 0 15px rgba(255, 0, 0, 0.3)',
            transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Glossy sheen */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
            }}
          />
          <span
            className="relative z-10 text-white font-bold text-sm sm:text-base drop-shadow-lg"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
          >
            {total > 0 ? `${Math.round(magoPercent)}%` : '—'}
          </span>
        </div>

        {/* Camilo side (right) */}
        <div
          className="absolute top-0 right-0 h-full flex items-center justify-center"
          style={{
            width: `${camiloPercent}%`,
            background: 'linear-gradient(180deg, #0057D4 0%, #0047AB 50%, #003580 100%)',
            boxShadow: '0 0 15px rgba(0, 71, 171, 0.3)',
            transition: 'width 500ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
            }}
          />
          <span
            className="relative z-10 text-white font-bold text-sm sm:text-base drop-shadow-lg"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em' }}
          >
            {total > 0 ? `${Math.round(camiloPercent)}%` : '—'}
          </span>
        </div>

        {/* Center divider glow */}
        <div
          className="absolute top-0 h-full w-px z-20"
          style={{
            left: `${magoPercent}%`,
            background: 'rgba(255,255,255,0.8)',
            boxShadow: '0 0 8px rgba(255,255,255,0.5)',
            transition: 'left 500ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      {/* Total votes */}
      {showExactCounts && (
        <div
          className="text-center text-white/40 text-xs mt-2 tracking-widest uppercase"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {total} votos totales
        </div>
      )}
    </div>
  )
}
