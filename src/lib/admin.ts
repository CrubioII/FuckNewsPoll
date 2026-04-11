import { supabase } from './supabase'

type AdminAction = 'start' | 'stop' | 'reset'

export async function adminAction(action: AdminAction, token: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke('admin-action', {
    body: { action, token },
  })

  if (error) {
    throw new Error(error.message || 'Admin action failed')
  }

  if (data?.error) {
    throw new Error(data.error)
  }
}
