import { env } from '@/app/config/env'
import { authStore } from '@/core/auth/auth-store'
import { tokenStorage } from '@/core/auth/token'

type RefreshResponse = { readonly access_token?: string }

type RefreshQueueItem = {
  readonly resolve: (token: string) => void
  readonly reject: (error: unknown) => void
}

let isRefreshing = false
let failedQueue: RefreshQueueItem[] = []

function processQueue(error: unknown, token: string | null = null) {
  for (const p of failedQueue) {
    if (error) p.reject(error)
    else p.resolve(token as string)
  }
  failedQueue = []
}

async function refreshSessionToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken()
  if (!refreshToken) return null

  const res = await fetch(`${env.apiBaseUrl}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
    credentials: 'include',
  })
  if (!res.ok) return null

  const data = (await res.json()) as RefreshResponse
  const token = data.access_token
  if (token && typeof token === 'string') {
    tokenStorage.setAccessToken(token)
    return token
  }
  return null
}

async function refreshWithQueue(): Promise<string | null> {
  if (isRefreshing) {
    try {
      return await new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
    } catch {
      return null
    }
  }

  isRefreshing = true
  try {
    const token = await refreshSessionToken()
    if (token) {
      processQueue(null, token)
      return token
    }
    processQueue(new Error('Refresh failed'))
    return null
  } catch (e) {
    processQueue(e)
    return null
  } finally {
    isRefreshing = false
  }
}

const REFRESH_LOCK_NAME = 'bs:auth:refresh'
const LAST_REFRESH_KEY = 'bs:auth:refresh:last'
const DEBOUNCE_MS = 2000

type LastRefresh = { ts: number; ok: boolean }

function readLastRefresh(): LastRefresh | null {
  try {
    const raw = localStorage.getItem(LAST_REFRESH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as LastRefresh
    if (typeof parsed?.ts !== 'number' || typeof parsed?.ok !== 'boolean')
      return null
    return parsed
  } catch {
    return null
  }
}

function writeLastRefresh(ok: boolean): void {
  try {
    localStorage.setItem(
      LAST_REFRESH_KEY,
      JSON.stringify({ ts: Date.now(), ok })
    )
  } catch {
    // storage disabled or quota exceeded — debounce just won't apply
  }
}

function tryReuseRecent(): { use: boolean; token: string | null } {
  const recent = readLastRefresh()
  if (!recent) return { use: false, token: null }
  if (Date.now() - recent.ts >= DEBOUNCE_MS) return { use: false, token: null }
  if (!recent.ok) return { use: true, token: null }
  return { use: true, token: tokenStorage.getAccessToken() }
}

async function refreshWithCoordination(): Promise<string | null> {
  const early = tryReuseRecent()
  if (early.use) return early.token

  if (
    typeof navigator !== 'undefined' &&
    'locks' in navigator &&
    navigator.locks
  ) {
    try {
      return await navigator.locks.request(REFRESH_LOCK_NAME, async () => {
        const inside = tryReuseRecent()
        if (inside.use) return inside.token

        try {
          const token = await refreshSessionToken()
          writeLastRefresh(!!token)
          return token
        } catch {
          writeLastRefresh(false)
          return null
        }
      })
    } catch {
      return refreshWithQueue()
    }
  }

  return refreshWithQueue()
}

export const sessionManager = {
  async refreshAccessToken(): Promise<string | null> {
    const token = await refreshWithCoordination()
    if (token) return token

    tokenStorage.clear()
    authStore.getState().logout()
    return null
  },
} as const
