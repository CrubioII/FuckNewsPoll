import { useRef, useEffect, useState } from 'react'

export default function Logo({ size = 'large', animated = true }: { size?: 'large' | 'small', animated?: boolean }) {
  const isLarge = size === 'large'
  const boxRef = useRef<HTMLDivElement>(null)
  const beamRef = useRef<SVGPathElement>(null)
  const glowRef = useRef<SVGPathElement>(null)
  const [dims, setDims] = useState({ w: 0, h: 0 })
  const tailSize = isLarge ? 32 : 16

  useEffect(() => {
    const el = boxRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setDims({ w: el.offsetWidth, h: el.offsetHeight })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { w, h } = dims
  const pathD = w > 0 && h > 0
    ? `M 0,0 L ${w},0 L ${w},${h} L ${tailSize},${h} L 0,${h + tailSize} Z`
    : ''

  const perimeter = w > 0
    ? w + h + (w - tailSize) + tailSize * Math.SQRT2 + (h + tailSize)
    : 0

  // rAF-based animation — avoids the CSS custom-property-as-length bug
  useEffect(() => {
    const path = beamRef.current
    if (!animated || !path || perimeter <= 0) return

    const beamLen = perimeter * 0.18
    path.style.strokeDasharray = `${beamLen} ${perimeter - beamLen}`

    const DURATION = 2800
    let startTime: number | null = null
    let rafId: number

    const glow = glowRef.current
    if (glow) glow.style.strokeDasharray = `${beamLen} ${perimeter - beamLen}`

    const tick = (ts: number) => {
      if (startTime === null) startTime = ts
      const progress = ((ts - startTime) % DURATION) / DURATION
      const offset = String(-perimeter * progress)
      path.style.strokeDashoffset = offset
      if (glow) glow.style.strokeDashoffset = offset
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [animated, perimeter])

  return (
    <div className="flex flex-col items-center select-none">
      {/* Decorative line above */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold" />
        <div
          className="text-[10px] tracking-[0.4em] text-gold-light uppercase font-bold"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          En vivo
        </div>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold" />
      </div>

      {/* Main logo with characteristic box */}
      <div className="relative" style={{ marginBottom: `${tailSize + 8}px` }}>
        <div ref={boxRef} className="border border-white/[0.06] px-8 py-4 relative z-10">
          <h1
            className={`
              ${isLarge ? 'text-7xl sm:text-8xl md:text-9xl' : 'text-4xl sm:text-5xl'}
              font-bold leading-none tracking-tight text-white text-center
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
        </div>

        {pathD && (
          <svg
            className="absolute top-0 left-0 pointer-events-none z-20"
            width={w}
            height={h + tailSize}
            style={{ overflow: 'visible' }}
          >
            <defs>
              <filter id="beamGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="beamGlowSoft" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" />
              </filter>
            </defs>

            {/* Faint ghost outline of full bubble */}
            <path
              d={pathD}
              fill="none"
              stroke="rgba(59,130,246,0.08)"
              strokeWidth={isLarge ? 1.5 : 1}
            />

            {/* Soft outer glow layer */}
            <path
              ref={glowRef}
              d={pathD}
              fill="none"
              stroke="#60A5FA"
              strokeWidth={isLarge ? 8 : 5}
              strokeLinecap="round"
              filter="url(#beamGlowSoft)"
              style={{ opacity: 0.35 }}
            />

            {/* Core beam — bright thin line */}
            <path
              ref={beamRef}
              d={pathD}
              fill="none"
              stroke="#BFDBFE"
              strokeWidth={isLarge ? 2 : 1.5}
              strokeLinecap="round"
              filter="url(#beamGlow)"
            />
          </svg>
        )}
      </div>

      {/* POLL tagline */}
      <div
        className={`
          ${isLarge ? 'text-lg sm:text-xl mt-4' : 'text-sm mt-2'}
          tracking-[0.5em] text-white/70 uppercase font-medium
        `}
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        poll
      </div>

      {/* Decorative line below */}
      <div className={`${isLarge ? 'mt-6' : 'mt-4'} flex items-center gap-2`}>
        <div className="h-px w-8 bg-gradient-to-r from-transparent to-gold" />
        <div className="w-1.5 h-1.5 rotate-45 bg-gold-light" />
        <div className="h-px w-16 bg-gold" />
        <div className="w-1.5 h-1.5 rotate-45 bg-gold-light" />
        <div className="h-px w-8 bg-gradient-to-l from-transparent to-gold" />
      </div>
    </div>
  )
}
