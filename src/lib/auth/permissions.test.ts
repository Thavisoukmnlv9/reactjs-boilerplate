import { describe, expect, it } from 'vitest'

import { canAll, canAny, hasRole } from './permissions'

describe('permissions', () => {
  const perms = ['users:read', 'users:write']

  it('canAny returns true when at least one permission matches', () => {
    expect(canAny(['users:read'], perms)).toBe(true)
    expect(canAny(['billing:read'], perms)).toBe(false)
  })

  it('canAll requires every permission', () => {
    expect(canAll(['users:read', 'users:write'], perms)).toBe(true)
    expect(canAll(['users:read', 'users:delete'], perms)).toBe(false)
  })

  it('hasRole checks role membership', () => {
    expect(hasRole('admin', ['admin', 'member'])).toBe(true)
    expect(hasRole('admin', ['member'])).toBe(false)
  })
})
