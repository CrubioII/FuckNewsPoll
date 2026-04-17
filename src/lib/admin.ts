import { callAdminAction } from './api'

type AdminAction = 'start' | 'stop' | 'reset'

export async function adminAction(action: AdminAction, token: string): Promise<void> {
  return callAdminAction(action, token)
}
