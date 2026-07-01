import { describe, expect, it } from 'vitest'

import { initials } from './format'

describe('initials', () => {
  it('takes the first letters of up to two words', () => {
    expect(initials('Ada Lovelace')).toBe('AL')
    expect(initials('grace')).toBe('G')
    expect(initials('a b c')).toBe('AB')
  })
})
