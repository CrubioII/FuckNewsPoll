import Logo from './Logo'

export default function IdleScreen() {
  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative z-10"
      style={{ animation: 'slide-up 0.8s ease-out' }}
    >
      <Logo size="large" />

      {/* Waiting message */}
      <div className="mt-12 flex flex-col items-center gap-4">
        <p
          className="text-white/70 text-lg sm:text-xl tracking-widest uppercase"
          style={{
            fontFamily: 'var(--font-heading)',
            animation: 'breathe 3s ease-in-out infinite',
          }}
        >
          Esperando noticia...
        </p>

        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-gold/60"
              style={{
                animation: 'breathe 2s ease-in-out infinite',
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(212, 175, 55, 0.06) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}
