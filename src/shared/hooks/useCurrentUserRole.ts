import { authStore } from '@/core/auth/auth-store'

/**
 * Role enum inferred from the permission set returned by `/me`, since
 * `OrganizationMember.role` is not surfaced directly on the User type.
 * Higher rank = more capability. OWNER is the highest.
 *
 *  OWNER   — has `platform.organizations.manage`
 *  ADMIN   — has `platform.users.manage` OR `platform.settings.manage`
 *  MANAGER — has any `*.manage` permission
 *  CASHIER — fallback when an authenticated user has none of the above
 */
export type AppRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'CASHIER'

const ROLE_RANK: Record<AppRole, number> = {
  OWNER: 4,
  ADMIN: 3,
  MANAGER: 2,
  CASHIER: 1,
}

function inferRole(permissions: string[]): AppRole | null {
  if (permissions.length === 0) return null
  if (permissions.includes('platform.organizations.manage')) return 'OWNER'
  if (
    permissions.includes('platform.users.manage') ||
    permissions.includes('platform.settings.manage')
  ) {
    return 'ADMIN'
  }
  // Manager-tier: any explicit *.manage permission across modules
  if (
    permissions.some(
      (p) => p.endsWith('.manage') || p.endsWith('.manage_session')
    )
  ) {
    return 'MANAGER'
  }
  return 'CASHIER'
}

export interface CurrentUserRoleResult {
  role: AppRole | null
  hasRole: (required: AppRole | AppRole[]) => boolean
  isAtLeast: (minimum: AppRole) => boolean
}

export function useCurrentUserRole(): CurrentUserRoleResult {
  const permissions = authStore((s) => s.permissions)
  const role = inferRole(permissions)

  const hasRole = (required: AppRole | AppRole[]): boolean => {
    if (!role) return false
    const list = Array.isArray(required) ? required : [required]
    return list.includes(role)
  }

  const isAtLeast = (minimum: AppRole): boolean => {
    if (!role) return false
    return ROLE_RANK[role] >= ROLE_RANK[minimum]
  }

  return { role, hasRole, isAtLeast }
}
