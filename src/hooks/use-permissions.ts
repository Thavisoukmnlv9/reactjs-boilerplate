import { useMemo } from 'react'

import { useAuthStore } from '@/lib/auth'

/** RBAC helpers bound to the current user. Recomputes only when user changes. */
export function usePermissions() {
  const user = useAuthStore((s) => s.user)

  return useMemo(() => {
    const permissions = user?.permissions ?? []
    const roles = user?.roles ?? []
    return {
      permissions,
      roles,
      can: (permission: string) => permissions.includes(permission),
      canAny: (required: string[]) => required.some((p) => permissions.includes(p)),
      canAll: (required: string[]) => required.every((p) => permissions.includes(p)),
      hasRole: (role: string) => roles.includes(role),
    }
  }, [user])
}
