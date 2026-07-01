import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebounce } from './use-debounce'

describe('useDebounce', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('delays updating the value until the timeout elapses', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 200), {
      initialProps: { value: 'a' },
    })
    expect(result.current).toBe('a')

    rerender({ value: 'b' })
    expect(result.current).toBe('a')

    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(result.current).toBe('b')
  })
})
