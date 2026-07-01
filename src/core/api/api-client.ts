import { env } from '@/app/config/env'
import { fetcher } from '@/core/utils/fetcher'

function apiUrl(path: string): string {
  if (!path.startsWith('/')) return `${env.apiBaseUrl}/api/v1/${path}`
  return `${env.apiBaseUrl}/api/v1${path}`
}

export const apiClient = {
  get<T>(path: string) {
    return fetcher.get<T>(apiUrl(path))
  },
  post<T>(path: string, body?: unknown) {
    return fetcher.post<T>(apiUrl(path), body)
  },
  put<T>(path: string, body?: unknown) {
    return fetcher.put<T>(apiUrl(path), body)
  },
  patch<T>(path: string, body?: unknown) {
    return fetcher.patch<T>(apiUrl(path), body)
  },
  delete<T>(path: string) {
    return fetcher.delete<T>(apiUrl(path))
  },
  postForm<T>(path: string, body: FormData) {
    return fetcher.postForm<T>(apiUrl(path), body)
  },
  patchForm<T>(path: string, body: FormData) {
    return fetcher.patchForm<T>(apiUrl(path), body)
  },
  putForm<T>(path: string, body: FormData) {
    return fetcher.putForm<T>(apiUrl(path), body)
  },
} as const
