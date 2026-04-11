interface VoteButtonProps {
  comediante: 'mago' | 'camilo'
  onClick: () => void
  disabled: boolean
  label: string
  subtitle?: string
}

export default function VoteButton({ comediante, onClick, disabled, label, subtitle }: VoteButtonProps) {
  const isMago = comediante === 'mago'

  const baseColor = isMago ? '#FF0000' : '#0047AB'
  const darkColor = isMago ? '#990000' : '#002D6B'
  const glowColor = isMago ? 'rgba(255, 0, 0, 0.6)' : 'rgba(0, 71, 171, 0.6)'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative w-full min-h-[90px] rounded-xl overflow-hidden
        transition-all duration-200 ease-out
        ${disabled
          ? 'opacity-40 cursor-not-allowed scale-[0.98]'
          : 'cursor-pointer hover:scale-[1.02] active:scale-[0.97]'
        }
      `}
      style={{
        background: `linear-gradient(180deg, ${baseColor} 0%, ${darkColor} 100%)`,
        boxShadow: disabled
          ? 'none'
          : `0 0 20px ${glowColor}, 0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)`,
        ['--glow-color' as string]: baseColor,
        animation: disabled ? 'none' : 'pulse-glow 3s ease-in-out infinite',
        fontFamily: 'var(--font-display)',
      }}
    >
      {/* Metallic sheen overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.05) 100%)',
        }}
      />

      {/* Brushed metal texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 1px,
            rgba(255,255,255,0.5) 1px,
            rgba(255,255,255,0.5) 2px
          )`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center py-4 px-6">
        <span
          className="text-4xl sm:text-5xl tracking-wider text-white"
          style={{
            textShadow: '0 0 10px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {label}
        </span>
        {subtitle && (
          <span
            className="text-sm text-white/70 tracking-widest uppercase mt-1"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 400 }}
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* Bottom edge highlight */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${baseColor}, transparent)`,
          opacity: 0.6,
        }}
      />
    </button>
  )
}
