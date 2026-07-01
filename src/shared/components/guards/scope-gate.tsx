import type { ReactNode } from 'react'
import { useScope } from '@/core/organization/scope-context'

interface ScopeGateProps {
  requireBranch?: boolean
  fallback?: ReactNode
  children: ReactNode
}

export function ScopeGate({
  requireBranch,
  fallback = null,
  children,
}: ScopeGateProps) {
  const { branchId } = useScope()
  if (requireBranch && !branchId) return <>{fallback}</>
  return <>{children}</>
}
