import { ApiError } from '@/core/api/api-error'
import { sessionManager } from '@/core/auth/session-manager'
import { tokenStorage } from '@/core/auth/token'

type ApiErrorObject = {
  code?: string
  message?: string
  status_code?: number
}

type ApiErrorShape = {
  message?: string
  /** FastAPI HTTPException default body */
  detail?: string | string[] | Array<{ msg?: string }>
  error?: string | ApiErrorObject
} | null

async function parseJsonSafe(res: Response): Promise<ApiErrorShape> {
  try {
    return await res.clone().json()
  } catch {
    return null
  }
}

type ApiErrorBody = NonNullable<ApiErrorShape>

/** True when `error` is the structured `{ code, message }` object form. */
function isErrorObject(error: ApiErrorBody['error']): error is ApiErrorObject {
  return typeof error === 'object' && error !== null
}

/**
 * Pull a human message out of a FastAPI `detail` field.
 * Handles a plain string, an array of strings, or an array of validation
 * issues (`{ msg }`). Returns undefined when nothing usable is present.
 */
function messageFromDetail(detail: ApiErrorBody['detail']): string | undefined {
  if (typeof detail === 'string') {
    return detail.trim() ? detail : undefined
  }
  if (Array.isArray(detail) && detail.length > 0) {
    const first = detail[0]
    if (typeof first === 'string') return first
    if (first && typeof first === 'object' && 'msg' in first && first.msg) {
      return String(first.msg)
    }
  }
  return undefined
}

/**
 * Extract an error `code` from the body. Mirrors the original coupling:
 * an object `error` contributes its `code` only when it also carries a
 * `message`; a string `error` is itself the code.
 */
function extractCode(data: ApiErrorBody): string | undefined {
  const { error } = data
  if (isErrorObject(error) && error.message) return error.code
  if (typeof error === 'string') return error
  return undefined
}

/**
 * Extract a human message from the body, in priority order:
 * structured `error.message` → FastAPI `detail` → top-level `message`.
 * Returns undefined when none apply (caller then decides on a fallback).
 */
function extractMessage(data: ApiErrorBody): string | undefined {
  const { error } = data
  if (isErrorObject(error) && error.message) return error.message

  const fromDetail = messageFromDetail(data.detail)
  if (fromDetail) return fromDetail

  if (data.message) return String(data.message)
  return undefined
}

async function getErrorMessageAndCode(
  res: Response
): Promise<{ message: string; code: string | undefined }> {
  const contentType = res.headers.get('content-type')
  if (contentType?.includes('application/json')) {
    const data = await parseJsonSafe(res)
    if (data) {
      const code = extractCode(data)
      const message = extractMessage(data)
      if (message || code) {
        return { message: message ?? getDefaultErrorMessage(res.status), code }
      }
    }
  }

  return { message: await getErrorMessageFallback(res), code: undefined }
}

async function getErrorMessageFallback(res: Response): Promise<string> {
  try {
    const text = await res.clone().text()

    if (text.trim().startsWith('<') || text.includes('<!DOCTYPE')) {
      return getDefaultErrorMessage(res.status)
    }

    if (text.length < 200 && !text.includes('<')) {
      return text
    }
  } catch {
    // If we can't read the response, fall back to default
  }

  return getDefaultErrorMessage(res.status)
}

function getDefaultErrorMessage(status: number): string {
  switch (status) {
    case 401:
      return 'Unauthorized'
    case 403:
      return 'Forbidden'
    case 404:
      return 'Not Found'
    case 422:
      return 'Invalid Data'
    case 429:
      return 'Too Many Requests'
    case 500:
      return 'Server Error'
    case 502:
      return 'Bad Gateway'
    case 503:
      return 'Service Unavailable'
    case 504:
      return 'Gateway Timeout'
    default:
      if (status >= 500) {
        return 'Server Error'
      }
      if (status >= 400) {
        return 'Bad Request'
      }
      return 'An Error Occurred'
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = tokenStorage.getAccessToken()
  if (token) {
    return { Authorization: `Bearer ${token}` }
  }
  return {}
}

/** 204/205 and empty bodies are valid (e.g. DELETE); ``res.json()`` would throw. */
async function parseOkResponseBody<T>(res: Response): Promise<T> {
  if (res.status === 204 || res.status === 205) {
    return undefined as unknown as T
  }
  const raw = await res.text()
  const trimmed = raw.trim()
  if (!trimmed) {
    return undefined as unknown as T
  }
  return JSON.parse(trimmed) as T
}

async function requestJson<TResponse>(
  url: string,
  init: RequestInit
): Promise<TResponse> {
  const authHeaders = getAuthHeaders()
  const headers = {
    ...authHeaders,
    ...(init.headers as Record<string, string> | undefined),
  }

  const res = await fetch(url, { ...init, headers, credentials: 'include' })
  if (!res.ok) {
    if (res.status === 401) {
      const refreshed = await sessionManager.refreshAccessToken()
      if (refreshed) {
        const retryHeaders = {
          ...(init.headers as Record<string, string> | undefined),
          Authorization: `Bearer ${refreshed}`,
        }
        const retryRes = await fetch(url, {
          ...init,
          headers: retryHeaders,
          credentials: 'include',
        })
        if (retryRes.ok) {
          return parseOkResponseBody<TResponse>(retryRes)
        }
      }

      // Refresh failed (token revoked or expired). Surface a toast so the
      // user knows what happened, and bounce to /login while preserving
      // the return path so they can resume the page they were on.
      try {
        const { toast } = await import('sonner')
        toast.error('Your session expired — please sign in again')
      } catch {
        // sonner unavailable in some test envs — fall through
      }
      const here =
        window.location.pathname + window.location.search + window.location.hash
      const safeReturn =
        here.startsWith('/') && !here.startsWith('//') ? here : '/dashboard'
      window.location.assign(
        `/login?returnTo=${encodeURIComponent(safeReturn)}`
      )
      return undefined as unknown as TResponse
    }

    const { message: errorMessage, code: errorCode } =
      await getErrorMessageAndCode(res)
    throw new ApiError(
      errorMessage || `HTTP ${res.status}: ${res.statusText}`,
      res.status,
      errorMessage,
      errorCode
    )
  }

  return parseOkResponseBody<TResponse>(res)
}

export const fetcher = {
  get: async <TResponse>(url: string, _?: Record<string, unknown>) => {
    return requestJson<TResponse>(url, { credentials: 'include' })
  },
  postForm: async <TResponse>(url: string, body: FormData) => {
    return requestJson<TResponse>(url, {
      method: 'POST',
      body,
      credentials: 'include',
    })
  },
  post: async <TResponse>(url: string, body?: unknown) => {
    return requestJson<TResponse>(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
      credentials: 'include',
    })
  },
  put: async <TResponse>(url: string, body?: unknown) => {
    return requestJson<TResponse>(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
      credentials: 'include',
    })
  },
  putForm: async <TResponse>(url: string, body: FormData) => {
    return requestJson<TResponse>(url, {
      method: 'PUT',
      body,
      credentials: 'include',
    })
  },
  patch: async <TResponse>(url: string, body?: unknown) => {
    return requestJson<TResponse>(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {}),
      credentials: 'include',
    })
  },
  patchForm: async <TResponse>(url: string, body: FormData) => {
    return requestJson<TResponse>(url, {
      method: 'PATCH',
      body,
      credentials: 'include',
    })
  },
  delete: async <TResponse>(
    url: string,
    options?: { headers?: Record<string, string> }
  ) => {
    return requestJson<TResponse>(url, {
      method: 'DELETE',
      credentials: 'include',
      headers: options?.headers,
    })
  },
}
