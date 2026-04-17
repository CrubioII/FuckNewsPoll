const API_URL = (import.meta.env.VITE_API_URL as string) || ''

export async function fetchState(): Promise<{
  isActiveRound: boolean
  winner: 'mago' | 'camilo' | null
}> {
  const res = await fetch(`${API_URL}/api/state`)
  if (!res.ok) throw new Error('Failed to fetch state')
  return res.json()
}

export async function fetchCounts(): Promise<{
  magoCount: number
  camiloCount: number
  total: number
}> {
  const res = await fetch(`${API_URL}/api/counts`)
  if (!res.ok) throw new Error('Failed to fetch counts')
  return res.json()
}

export async function submitVote(
  comediante: 'mago' | 'camilo',
  deviceId: string
): Promise<{ alreadyVoted: boolean }> {
  const res = await fetch(`${API_URL}/api/vote`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comediante, device_id: deviceId }),
  })
  if (res.status === 409) return { alreadyVoted: true }
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Vote failed')
  }
  return { alreadyVoted: false }
}

export async function callAdminAction(
  action: 'start' | 'stop' | 'reset',
  token: string
): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/${action}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Admin action failed')
  }
}
