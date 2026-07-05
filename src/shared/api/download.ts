import { env } from '@/app/config/env'
import { tokenStorage } from '@/core/auth/token'

/**
 * Fetch a file from the API (with the bearer token) and trigger a browser
 * download. Used by the tables' Export menu — a plain `<a href>` can't carry the
 * Authorization header, so we fetch the blob and save it client-side.
 */
export async function downloadFile(path: string, filename: string): Promise<void> {
  const url = path.startsWith('/') ? `${env.apiBaseUrl}/api/v1${path}` : `${env.apiBaseUrl}/api/v1/${path}`
  const token = tokenStorage.getAccessToken()
  const res = await fetch(url, {
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok) throw new Error(`Export failed (${res.status})`)
  const blob = await res.blob()
  const objectUrl = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(objectUrl)
}
