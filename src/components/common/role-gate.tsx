import type { ReactNode } from 'react'

import { usePermissions } from '@/hooks/use-permissions'

interface RoleGateProps {
  children: ReactNode
  /** Require a single permission. */
  permission?: string
  /** Require at least one of these permissions. */
  anyOf?: string[]
  /** Require a role. */
  role?: string
  /** Rendered when access is denied (defaults to nothing). */
  fallback?: ReactNode
}

/** Conditionally renders children based on the current user's RBAC. */
export function RoleGate({ children, permission, anyOf, role, fallback = null }: RoleGateProps) {
  const { can, canAny, hasRole } = usePermissions()

  const allowed =
    (permission ? can(permission) : true) &&
    (anyOf ? canAny(anyOf) : true) &&
    (role ? hasRole(role) : true)

  return <>{allowed ? children : fallback}</>
}
