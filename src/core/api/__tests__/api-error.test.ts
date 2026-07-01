import { describe, expect, it } from 'vitest'

import { ApiError, parseApiError } from '@/core/api/api-error'

describe('ApiError', () => {
  it('exposes status helpers', () => {
    const err = new ApiError('nope', 401)
    expect(err.isUnauthorized).toBe(true)
    expect(err.isForbidden).toBe(false)
  })
})

describe('parseApiError', () => {
  it('returns ApiError as-is', () => {
    const original = new ApiError('x', 400, 'detail')
    expect(parseApiError(original)).toBe(original)
  })

  it('wraps an Error', () => {
    const e = new Error('boom')
    const parsed = parseApiError(e)
    expect(parsed).toBeInstanceOf(ApiError)
    expect(parsed.message).toBe('boom')
  })

  it('handles axios-like errors with response.status and response.data.detail', () => {
    const parsed = parseApiError({
      response: { status: 422, data: { detail: 'Invalid' } },
    })
    expect(parsed).toBeInstanceOf(ApiError)
    expect(parsed.status).toBe(422)
    expect(parsed.message).toBe('Invalid')
    expect(parsed.detail).toBe('Invalid')
  })
})
