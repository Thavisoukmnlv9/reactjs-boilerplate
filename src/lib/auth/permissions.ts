import { useAuthStore } from './auth-store'

function currentPermissions(): string[] {
  return useAuthStore.getState().user?.permissions ?? []
}

function currentRoles(): string[] {
  return useAuthStore.getState().user?.roles ?? []
}

/** True if the given permission is held. Pass `perms` to check a known set. */
export function can(permission: string, perms: string[] = currentPermissions()): boolean {
  return perms.includes(permission)
}

export function canAny(required: string[], perms: string[] = currentPermissions()): boolean {
  return required.some((p) => perms.includes(p))
}

export function canAll(required: string[], perms: string[] = currentPermissions()): boolean {
  return required.every((p) => perms.includes(p))
}

export function hasRole(role: string, roles: string[] = currentRoles()): boolean {
  return roles.includes(role)
}
