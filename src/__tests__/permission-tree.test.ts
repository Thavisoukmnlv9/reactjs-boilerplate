import { describe, expect, it } from 'vitest'

import type { PermissionView } from '@/features/roles/api/types'
import {
  applyModule,
  computeModuleStats,
  filterGroupsByQuery,
  isDangerCode,
  toggleCode,
} from '@/features/roles/components/permission-tree'
import type { ModuleGroup } from '@/features/roles/lib/permission-catalog'

/**
 * Characterization tests for the pure permission-tree math extracted from
 * `PermissionMatrix`. These pin the exact set/tri-state/filter behavior the
 * component relied on inline.
 */

const DANGER = [
  'platform.organization.delete',
  'platform.members.transfer_ownership',
]

function perm(code: string, module = code.split('.')[0]): PermissionView {
  return { id: code, code, module, description: null }
}

function group(module: string, codes: string[]): ModuleGroup {
  return { module, perms: codes.map((c) => perm(c, module)) }
}

describe('isDangerCode', () => {
  it('true for a listed danger code', () => {
    expect(isDangerCode('platform.organization.delete', DANGER)).toBe(true)
  })
  it('false for a normal code', () => {
    expect(isDangerCode('platform.roles.read', DANGER)).toBe(false)
  })
  it('false against an empty danger list', () => {
    expect(isDangerCode('platform.organization.delete', [])).toBe(false)
  })
})

describe('filterGroupsByQuery', () => {
  const groups = [
    group('platform', ['platform.roles.read', 'platform.roles.manage']),
    group('inventory', ['inventory.items.read']),
  ]

  it('empty query returns groups unchanged (same reference)', () => {
    expect(filterGroupsByQuery(groups, '')).toBe(groups)
  })

  it('matches against the raw code (lowercased)', () => {
    const out = filterGroupsByQuery(groups, 'roles')
    expect(out).toHaveLength(1)
    expect(out[0].module).toBe('platform')
    expect(out[0].perms.map((p) => p.code)).toEqual([
      'platform.roles.read',
      'platform.roles.manage',
    ])
  })

  it('matches against labelForCode output (e.g. "items")', () => {
    const out = filterGroupsByQuery(groups, 'items')
    expect(out).toHaveLength(1)
    expect(out[0].module).toBe('inventory')
  })

  it('drops groups with no matching perms', () => {
    const out = filterGroupsByQuery(groups, 'zzz-none')
    expect(out).toEqual([])
  })

  it('does not mutate the input groups', () => {
    const snapshot = JSON.stringify(groups)
    filterGroupsByQuery(groups, 'roles')
    expect(JSON.stringify(groups)).toBe(snapshot)
  })
})

describe('toggleCode', () => {
  it('adds a missing code', () => {
    expect(toggleCode(['a'], 'b', DANGER)).toEqual(['a', 'b'])
  })
  it('removes a present code', () => {
    expect(toggleCode(['a', 'b'], 'b', DANGER)).toEqual(['a'])
  })
  it('leaves a danger code untouched (no add)', () => {
    expect(toggleCode(['a'], 'platform.organization.delete', DANGER)).toEqual([
      'a',
    ])
  })
  it('does not mutate the input array', () => {
    const input = ['a']
    const out = toggleCode(input, 'b', DANGER)
    expect(input).toEqual(['a'])
    expect(out).not.toBe(input)
  })
  it('de-duplicates (Set semantics) when code already present twice', () => {
    // Input already unique in practice, but confirm Set-based output shape.
    expect(toggleCode(['a', 'b'], 'c', DANGER)).toEqual(['a', 'b', 'c'])
  })
})

describe('applyModule', () => {
  it('grants all non-danger codes (on = true)', () => {
    const out = applyModule(
      ['x'],
      ['a', 'b', 'platform.organization.delete'],
      true,
      DANGER
    )
    expect(out).toEqual(['x', 'a', 'b'])
  })
  it('revokes non-danger codes (on = false)', () => {
    const out = applyModule(['a', 'b', 'x'], ['a', 'b'], false, DANGER)
    expect(out).toEqual(['x'])
  })
  it('never revokes a danger code even if requested', () => {
    const out = applyModule(
      ['platform.organization.delete', 'a'],
      ['platform.organization.delete', 'a'],
      false,
      DANGER
    )
    expect(out).toEqual(['platform.organization.delete'])
  })
  it('adding already-present codes is idempotent', () => {
    expect(applyModule(['a', 'b'], ['a', 'b'], true, DANGER)).toEqual([
      'a',
      'b',
    ])
  })
  it('does not mutate the input array', () => {
    const input = ['a']
    applyModule(input, ['b'], true, DANGER)
    expect(input).toEqual(['a'])
  })
})

describe('computeModuleStats', () => {
  it('none granted → false, 0%, all=false', () => {
    const perms = [perm('m.a'), perm('m.b')]
    const stats = computeModuleStats(perms, new Set(), DANGER)
    expect(stats.grantable).toEqual(['m.a', 'm.b'])
    expect(stats.granted).toBe(0)
    expect(stats.pct).toBe(0)
    expect(stats.all).toBe(false)
    expect(stats.checkedState).toBe(false)
  })

  it('some granted → indeterminate, rounded pct', () => {
    const perms = [perm('m.a'), perm('m.b'), perm('m.c')]
    const stats = computeModuleStats(perms, new Set(['m.a']), DANGER)
    expect(stats.granted).toBe(1)
    expect(stats.pct).toBe(33) // round(1/3 * 100)
    expect(stats.all).toBe(false)
    expect(stats.checkedState).toBe('indeterminate')
  })

  it('all granted → true, 100%, all=true', () => {
    const perms = [perm('m.a'), perm('m.b')]
    const stats = computeModuleStats(perms, new Set(['m.a', 'm.b']), DANGER)
    expect(stats.granted).toBe(2)
    expect(stats.pct).toBe(100)
    expect(stats.all).toBe(true)
    expect(stats.checkedState).toBe(true)
  })

  it('danger codes are excluded from grantable and totals', () => {
    const perms = [
      perm('m.a'),
      perm('platform.organization.delete', 'platform'),
    ]
    // Selecting m.a (the only grantable) → all grantable selected.
    const stats = computeModuleStats(perms, new Set(['m.a']), DANGER)
    expect(stats.grantable).toEqual(['m.a'])
    expect(stats.granted).toBe(1)
    expect(stats.all).toBe(true)
    expect(stats.checkedState).toBe(true)
  })

  it('a group with only danger codes → 0% and all=false', () => {
    const perms = [perm('platform.organization.delete', 'platform')]
    const stats = computeModuleStats(
      perms,
      new Set(['platform.organization.delete']),
      DANGER
    )
    expect(stats.grantable).toEqual([])
    expect(stats.granted).toBe(0)
    expect(stats.pct).toBe(0)
    expect(stats.all).toBe(false)
    expect(stats.checkedState).toBe(false)
  })
})
