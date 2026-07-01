import type { ReactNode } from 'react'
import { useHasModule } from '@/core/entitlements/entitlement-hooks'
import { NoAccessState } from '@/shared/components/states/no-access-state'

interface EntitlementGateProps {
  moduleCode: string
  fallback?: ReactNode
  children: ReactNode
}

export function EntitlementGate({
  moduleCode,
  fallback = <NoAccessState />,
  children,
}: EntitlementGateProps) {
  const hasModule = useHasModule(moduleCode)
  return hasModule ? <>{children}</> : <>{fallback}</>
}
