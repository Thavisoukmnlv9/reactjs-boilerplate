import SecureLS from 'secure-ls'

type StorageKey = string

function canUseBrowserStorage(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined'
}

let _ls: SecureLS | null = null

function getSecureLs(): SecureLS | null {
  if (!canUseBrowserStorage()) return null
  if (_ls) return _ls
  try {
    _ls = new SecureLS({
      encodingType: 'aes',
      isCompression: false,
    })
    return _ls
  } catch {
    _ls = null
    return null
  }
}

export const secureStorage = {
  getString(key: StorageKey): string | null {
    if (!canUseBrowserStorage()) return null
    try {
      const ls = getSecureLs()
      if (!ls) throw new Error('secure-ls unavailable')
      const value = ls.get(key) as unknown
      return typeof value === 'string' ? value : null
    } catch {
      try {
        const raw = localStorage.getItem(key)
        return typeof raw === 'string' ? raw : null
      } catch {
        return null
      }
    }
  },

  setString(key: StorageKey, value: string): void {
    if (!canUseBrowserStorage()) return
    try {
      const ls = getSecureLs()
      if (!ls) throw new Error('secure-ls unavailable')
      ls.set(key, value)
    } catch {
      try {
        localStorage.setItem(key, value)
      } catch {
        // ignore
      }
    }
  },

  remove(key: StorageKey): void {
    if (!canUseBrowserStorage()) return
    try {
      const ls = getSecureLs()
      if (!ls) throw new Error('secure-ls unavailable')
      ls.remove(key)
    } catch {
      try {
        localStorage.removeItem(key)
      } catch {
        // ignore
      }
    }
  },
} as const
