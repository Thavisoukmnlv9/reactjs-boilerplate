export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly detail?: string,
    public readonly code?: string,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static isApiError(value: unknown): value is ApiError {
    return value instanceof ApiError
  }

  get isUnauthorized(): boolean {
    return this.status === 401
  }

  get isForbidden(): boolean {
    return this.status === 403
  }

  get isNotFound(): boolean {
    return this.status === 404
  }

  get isValidationError(): boolean {
    return this.status === 422
  }

  get isConflict(): boolean {
    return this.status === 409
  }

  get errorDetail(): string {
    return this.detail?.trim() ? this.detail : this.message
  }
}

export function parseApiError(error: unknown): ApiError {
  if (ApiError.isApiError(error)) return error

  if (error && typeof error === 'object') {
    const maybe = error as { response?: { status?: unknown; data?: unknown } }
    const status =
      typeof maybe.response?.status === 'number' ? maybe.response.status : 0

    const data = maybe.response?.data
    const detail =
      data && typeof data === 'object' && 'detail' in data
        ? String((data as { detail?: unknown }).detail ?? '')
        : undefined

    if (status)
      return new ApiError(
        detail || 'Request failed',
        status,
        detail,
        undefined,
        error
      )
  }

  if (error instanceof Error)
    return new ApiError(error.message, 0, undefined, undefined, error)
  return new ApiError('Unknown error', 0, undefined, undefined, error)
}
