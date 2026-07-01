import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios'

import { appConfig } from '@/config/app-config'
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@/lib/auth/token-storage'

import { normalizeError } from './api-error'

export const apiClient = axios.create({
  baseURL: appConfig.api.baseUrl,
  timeout: appConfig.api.timeout,
  headers: { 'Content-Type': 'application/json' },
})

// --- Request: attach the bearer token ---------------------------------------
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- Response: refresh once on 401, then retry ------------------------------
let refreshPromise: Promise<string | null> | null = null

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null
  try {
    const { data } = await axios.post<{ accessToken: string; refreshToken: string }>(
      `${appConfig.api.baseUrl}/auth/refresh`,
      { refreshToken },
    )
    setTokens(data)
    return data.accessToken
  } catch {
    clearTokens()
    return null
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true
      refreshPromise ??= refreshAccessToken()
      const newToken = await refreshPromise
      refreshPromise = null

      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`
        return apiClient(original)
      }

      clearTokens()
      // Hard redirect keeps this module decoupled from the router.
      if (typeof window !== 'undefined' && window.location.pathname !== appConfig.auth.loginPath) {
        const returnTo = encodeURIComponent(window.location.pathname + window.location.search)
        window.location.assign(`${appConfig.auth.loginPath}?returnTo=${returnTo}`)
      }
    }

    return Promise.reject(normalizeError(error))
  },
)

/** Typed, unwrapped helpers over the axios instance (returns response body). */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((r) => r.data),
  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, body, config).then((r) => r.data),
  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, body, config).then((r) => r.data),
  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    apiClient.patch<T>(url, body, config).then((r) => r.data),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((r) => r.data),
}
