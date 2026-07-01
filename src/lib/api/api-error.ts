import { AxiosError } from 'axios'

export interface ApiErrorShape {
  message: string
  status: number
  code?: string
  details?: unknown
}

/** Normalized error every consumer can rely on, regardless of transport. */
export class ApiError extends Error implements ApiErrorShape {
  status: number
  code?: string
  details?: unknown

  constructor({ message, status, code, details }: ApiErrorShape) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

/** Collapse unknown thrown values (Axios, Error, anything) into an ApiError. */
export function normalizeError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (error instanceof AxiosError) {
    const status = error.response?.status ?? 0
    const data = error.response?.data as
      { message?: string; error?: string; detail?: string; code?: string } | undefined
    const message =
      data?.message ?? data?.error ?? data?.detail ?? error.message ?? 'Something went wrong'
    return new ApiError({ message, status, code: data?.code, details: data })
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message, status: 0 })
  }

  return new ApiError({ message: 'Unknown error', status: 0 })
}
