interface AdminControlsProps {
  isActiveRound: boolean
  onStart: () => void
  onStop: () => void
  onReset: () => void
  loading: boolean
}

export default function AdminControls({ isActiveRound, onStart, onStop, onReset, loading }: AdminControlsProps) {
  function handleReset() {
    if (window.confirm('¿Resetear todos los votos? Esta acción no se puede deshacer.')) {
      onReset()
    }
  }

  return (
    <div
      className="w-full max-w-md rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0F0F1A 0%, #0A0A14 100%)',
        boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)',
        border: '1px solid rgba(204, 32, 32, 0.15)',
      }}
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-4">
        <h3
          className="text-2xl text-white tracking-wider text-center"
          style={{
            fontFamily: 'var(--font-display)',
          }}
        >
          CONTROL PANEL
        </h3>
      </div>

      {/* Round status */}
      <div className="px-6 pb-4">
        <div
          className="flex items-center justify-center gap-3 py-3 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div
            className={`w-3 h-3 rounded-full ${isActiveRound ? 'bg-green-500' : 'bg-red-500'}`}
            style={{
              boxShadow: isActiveRound
                ? '0 0 8px rgba(34, 197, 94, 0.6)'
                : '0 0 8px rgba(239, 68, 68, 0.6)',
              animation: isActiveRound ? 'breathe 2s ease-in-out infinite' : 'none',
            }}
          />
          <span
            className="text-sm tracking-widest uppercase text-white/70"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {isActiveRound ? 'Ronda activa' : 'Ronda inactiva'}
          </span>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-6 pb-6 space-y-3">
        {/* Start / Stop toggle */}
        {!isActiveRound ? (
          <button
            onClick={onStart}
            disabled={loading}
            className="w-full py-4 rounded-xl text-white font-bold tracking-wider uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              background: 'linear-gradient(180deg, #22C55E 0%, #16A34A 100%)',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.3), 0 4px 15px rgba(0,0,0,0.4)',
            }}
          >
            Iniciar Batalla
          </button>
        ) : (
          <button
            onClick={onStop}
            disabled={loading}
            className="w-full py-4 rounded-xl text-white font-bold tracking-wider uppercase transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              background: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.3), 0 4px 15px rgba(0,0,0,0.4)',
            }}
          >
            Cerrar Batalla
          </button>
        )}

        {/* Reset */}
        <button
          onClick={handleReset}
          disabled={loading}
          className="w-full py-3 rounded-xl text-white/80 font-semibold tracking-wider uppercase transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.875rem',
            background: 'linear-gradient(180deg, #D97706 0%, #B45309 100%)',
            boxShadow: '0 0 15px rgba(217, 119, 6, 0.2), 0 4px 10px rgba(0,0,0,0.3)',
          }}
        >
          Resetear Votos
        </button>
      </div>
    </div>
  )
}
