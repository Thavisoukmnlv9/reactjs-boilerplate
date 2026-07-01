import { authStore } from '@/core/auth/auth-store'

export function useCan(permission: string | undefined): boolean {
  const permissions = authStore((s) => s.permissions)
  if (permission == null) return true
  return permissions.includes(permission)
}

export function useCanAny(...perms: string[]): boolean {
  const permissions = authStore((s) => s.permissions)
  return perms.some((p) => permissions.includes(p))
}

/**
 * Predicate over the current user's permission set. `undefined` always passes
 * (un-gated). Use when filtering a list where calling `useCan` per item would
 * violate the rules of hooks.
 */
export function useCanCheck(): (permission: string | undefined) => boolean {
  const permissions = authStore((s) => s.permissions)
  return (permission) => permission == null || permissions.includes(permission)
}
