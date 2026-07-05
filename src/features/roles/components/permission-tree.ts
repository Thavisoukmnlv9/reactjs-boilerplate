import type { CheckedState } from '@radix-ui/react-checkbox'

import type { PermissionView } from '@/features/roles/api/types'
import type { ModuleGroup } from '@/features/roles/lib/permission-catalog'
import { labelForCode } from '@/features/roles/lib/permission-catalog'

/**
 * Pure tree/set math for the permission matrix.
 *
 * These helpers own the algorithmic parts of `PermissionMatrix` — search
 * filtering, danger-zone gating, single/bulk toggle set operations, and the
 * per-module tri-state computation — with zero React or UI concerns so they
 * can be unit-tested in isolation. Behavior mirrors the original inline
 * component logic exactly.
 */

/** Whether a permission code is owner-only (locked in the matrix). */
export function isDangerCode(
  code: string,
  dangerCodes: readonly string[]
): boolean {
  return dangerCodes.includes(code)
}

/**
 * Restrict the permission catalog to codes the current user may actually grant.
 *
 * The server rejects any code the granting user does not itself hold with a 422
 * (a privilege-escalation guard: you cannot hand out access you lack). Offering
 * un-held codes in the matrix therefore only leads to a failed save, so we drop
 * them up front. Already-selected codes are always kept, so editing a role
 * never hides one of its existing grants.
 *
 * `canGrant` is the current user's permission predicate — see `useCanCheck`.
 */
export function filterGrantablePerms(
  perms: PermissionView[],
  canGrant: (code: string) => boolean,
  selected: ReadonlySet<string>
): PermissionView[] {
  return perms.filter((p) => canGrant(p.code) || selected.has(p.code))
}

/**
 * Filter module groups by a search query, dropping any group left empty.
 * The query is matched case-insensitively against the raw code and, as in the
 * original, against `labelForCode(code)` without lowercasing it.
 *
 * `query` is expected already trimmed + lowercased (as the component does);
 * an empty query returns every group unchanged.
 */
export function filterGroupsByQuery(
  groups: ModuleGroup[],
  query: string
): ModuleGroup[] {
  if (!query) return groups
  return groups
    .map((g) => ({
      ...g,
      perms: g.perms.filter(
        (p) =>
          p.code.toLowerCase().includes(query) ||
          labelForCode(p.code).includes(query)
      ),
    }))
    .filter((g) => g.perms.length > 0)
}

/**
 * Toggle a single code within the current selection.
 * Danger-zone codes are never changed. Returns the next code array.
 */
export function toggleCode(
  codes: string[],
  code: string,
  dangerCodes: readonly string[]
): string[] {
  if (isDangerCode(code, dangerCodes)) return [...codes]
  const next = new Set(codes)
  if (next.has(code)) next.delete(code)
  else next.add(code)
  return [...next]
}

/**
 * Grant (`on = true`) or revoke (`on = false`) a set of codes at once.
 * Danger-zone codes are skipped. Returns the next code array.
 */
export function applyModule(
  codes: string[],
  moduleCodes: string[],
  on: boolean,
  dangerCodes: readonly string[]
): string[] {
  const next = new Set(codes)
  for (const c of moduleCodes) {
    if (isDangerCode(c, dangerCodes)) continue
    if (on) next.add(c)
    else next.delete(c)
  }
  return [...next]
}

export interface ModuleStats {
  /** Grantable (non-danger) codes in the group. */
  grantable: string[]
  /** How many grantable codes are currently selected. */
  granted: number
  /** Percentage granted, rounded (0 when nothing is grantable). */
  pct: number
  /** True when every grantable code is selected. */
  all: boolean
  /** Tri-state for the group's header checkbox. */
  checkedState: CheckedState
}

/**
 * Compute the grant progress + header tri-state for one module group.
 * `selected` is the set of currently-selected codes.
 */
export function computeModuleStats(
  perms: ModuleGroup['perms'],
  selected: ReadonlySet<string>,
  dangerCodes: readonly string[]
): ModuleStats {
  const grantable = perms
    .map((p) => p.code)
    .filter((c) => !isDangerCode(c, dangerCodes))
  const granted = grantable.filter((c) => selected.has(c)).length
  const pct = grantable.length
    ? Math.round((granted / grantable.length) * 100)
    : 0
  const all = grantable.length > 0 && granted === grantable.length
  const checkedState: CheckedState = all
    ? true
    : granted > 0
      ? 'indeterminate'
      : false
  return { grantable, granted, pct, all, checkedState }
}
