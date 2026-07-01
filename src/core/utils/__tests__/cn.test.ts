import { describe, expect, it } from 'vitest'

import { cn } from '../cn'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', undefined, false && 'b', 'c')).toBe('a c')
  })

  it('dedupes tailwind-ish classes via tailwind-merge', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })
})
