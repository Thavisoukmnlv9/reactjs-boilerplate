import { authStore } from '@/core/auth/auth-store'

export function can(permission: string): boolean {
  return authStore.getState().permissions.includes(permission)
}

export function canAny(...permissions: string[]): boolean {
  const userPerms = authStore.getState().permissions
  return permissions.some((p) => userPerms.includes(p))
}

export function canAll(...permissions: string[]): boolean {
  const userPerms = authStore.getState().permissions
  return permissions.every((p) => userPerms.includes(p))
}
