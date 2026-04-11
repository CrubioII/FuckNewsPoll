const DEVICE_ID_KEY = 'fnp_device_id'
const HAS_VOTED_KEY = 'fnp_has_voted'

export function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_ID_KEY, id)
  }
  return id
}

export function getHasVoted(): boolean {
  return localStorage.getItem(HAS_VOTED_KEY) === 'true'
}

export function setHasVoted(value: boolean): void {
  if (value) {
    localStorage.setItem(HAS_VOTED_KEY, 'true')
  } else {
    localStorage.removeItem(HAS_VOTED_KEY)
  }
}
