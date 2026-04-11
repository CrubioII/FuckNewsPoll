export default function Logo({ size = 'large', animated = true }: { size?: 'large' | 'small', animated?: boolean }) {
  const isLarge = size === 'large'

  return (
    <div className="flex flex-col items-center select-none">
      {/* Decorative line above */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold/60" />
        <div
          className="text-[10px] tracking-[0.4em] text-gold/60 uppercase"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          En vivo
        </div>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold/60" />
      </div>

      {/* Main logo */}
      <h1
        className={`
          ${isLarge ? 'text-7xl sm:text-8xl md:text-9xl' : 'text-4xl sm:text-5xl'}
          font-bold leading-none tracking-tight text-white
        `}
        style={{
          fontFamily: 'var(--font-display)',
          animation: animated ? 'neon-flicker 4s ease-in-out infinite' : 'none',
          letterSpacing: '0.05em',
        }}
      >
        F*CKS
        <br />
        NEWS
      </h1>

      {/* POLL tagline */}
      <div
        className={`
          ${isLarge ? 'text-lg sm:text-xl mt-3' : 'text-sm mt-1'}
          tracking-[0.5em] text-white/50 uppercase
        `}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        poll
      </div>

      {/* Decorative line below */}
      <div className={`${isLarge ? 'mt-4' : 'mt-2'} flex items-center gap-2`}>
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold/40" />
        <div className="w-1.5 h-1.5 rotate-45 bg-gold/60" />
        <div className="h-px w-16 bg-gold/40" />
        <div className="w-1.5 h-1.5 rotate-45 bg-gold/60" />
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold/40" />
      </div>
    </div>
  )
}
