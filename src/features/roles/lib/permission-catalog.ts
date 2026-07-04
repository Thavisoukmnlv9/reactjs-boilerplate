import type { PermissionView } from '@/features/roles/api/types'

/** Owner-only codes — locked in the matrix; the server also rejects them (422). */
export const DANGER_ZONE_CODES = ['platform.organization.delete', 'platform.members.transfer_ownership']

export type ActionTone = 'neutral' | 'info' | 'warn' | 'danger'

export function moduleOf(code: string): string {
  return code.split('.')[0] ?? 'platform'
}

export function moduleLabel(module: string): string {
  return module.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

/** `platform.roles.manage` → "roles manage". */
export function labelForCode(code: string): string {
  return code.split('.').slice(1).join(' ').replace(/_/g, ' ')
}

export function actionTone(code: string): ActionTone {
  const last = code.split('.').pop() ?? ''
  if (['delete', 'remove', 'forfeit', 'revoke_others'].includes(last)) return 'danger'
  if (['manage', 'approve', 'adjust', 'reset', 'enforce'].includes(last)) return 'warn'
  if (['read', 'view'].includes(last)) return 'neutral'
  return 'info'
}

export interface ModuleGroup {
  module: string
  perms: PermissionView[]
}

export function groupByModule(perms: PermissionView[]): ModuleGroup[] {
  const map = new Map<string, PermissionView[]>()
  for (const p of perms) {
    const m = p.module || moduleOf(p.code)
    const list = map.get(m) ?? []
    list.push(p)
    map.set(m, list)
  }
  // Platform first, then alphabetical.
  return [...map.entries()]
    .map(([module, list]) => ({ module, perms: list.sort((a, b) => a.code.localeCompare(b.code)) }))
    .sort((a, b) => (a.module === 'platform' ? -1 : b.module === 'platform' ? 1 : a.module.localeCompare(b.module)))
}
