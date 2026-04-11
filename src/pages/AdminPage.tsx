import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppState } from '../hooks/useAppState'
import { useVoteCounts } from '../hooks/useVoteCounts'
import { adminAction } from '../lib/admin'
import Logo from '../components/Logo'
import AdminControls from '../components/AdminControls'
import ProgressBar from '../components/ProgressBar'

export default function AdminPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { isActiveRound, loading: stateLoading } = useAppState()
  const { magoCount, camiloCount, total } = useVoteCounts()
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!token) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div
          className="text-center p-8 rounded-2xl"
          style={{
            background: 'rgba(10, 10, 26, 0.9)',
            border: '1px solid rgba(255, 0, 0, 0.3)',
          }}
        >
          <p
            className="text-red-400 text-xl tracking-wider uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Acceso denegado
          </p>
          <p className="text-white/40 text-sm mt-2">Token requerido</p>
        </div>
      </div>
    )
  }

  async function handleAction(action: 'start' | 'stop' | 'reset') {
    setActionLoading(true)
    setError(null)
    try {
      await adminAction(action, token!)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setActionLoading(false)
    }
  }

  if (stateLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    )
  }

  return (
    <div
      className="flex-1 flex flex-col items-center px-4 py-6 gap-6 relative z-10"
      style={{ animation: 'slide-up 0.6s ease-out' }}
    >
      <Logo size="small" />

      <AdminControls
        isActiveRound={isActiveRound}
        onStart={() => handleAction('start')}
        onStop={() => handleAction('stop')}
        onReset={() => handleAction('reset')}
        loading={actionLoading}
      />

      {/* Vote results panel */}
      <div
        className="w-full max-w-md rounded-2xl p-5"
        style={{
          background: 'linear-gradient(180deg, #0F0F1A 0%, #0A0A14 100%)',
          boxShadow: '0 0 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)',
          border: '1px solid rgba(204, 32, 32, 0.15)',
        }}
      >
        <h3
          className="text-xl text-white tracking-wider text-center mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          RESULTADOS
        </h3>

        <ProgressBar
          magoCount={magoCount}
          camiloCount={camiloCount}
          total={total}
          showExactCounts
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center bg-red-900/20 rounded-lg px-4 py-2">
          {error}
        </div>
      )}
    </div>
  )
}
