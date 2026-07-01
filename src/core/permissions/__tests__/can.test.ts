import { afterEach, describe, expect, it } from 'vitest'

import { authStore } from '@/core/auth/auth-store'
import { can, canAll, canAny } from '@/core/permissions/can'

describe('permissions can helpers', () => {
  afterEach(() => {
    authStore.setState({ permissions: [] })
  })

  it('can() checks exact permission', () => {
    authStore.setState({ permissions: ['a.b'] })
    expect(can('a.b')).toBe(true)
    expect(can('x.y')).toBe(false)
  })

  it('canAny() checks any of permissions', () => {
    authStore.setState({ permissions: ['a', 'c'] })
    expect(canAny('b', 'c')).toBe(true)
    expect(canAny('x', 'y')).toBe(false)
  })

  it('canAll() checks all of permissions', () => {
    authStore.setState({ permissions: ['a', 'b'] })
    expect(canAll('a', 'b')).toBe(true)
    expect(canAll('a', 'c')).toBe(false)
  })
})
