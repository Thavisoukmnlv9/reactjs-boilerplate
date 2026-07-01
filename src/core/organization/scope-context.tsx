import { createContext, type ReactNode, useContext } from 'react'
import { authStore } from '@/core/auth/auth-store'
import { branchStore } from './branch-store'

interface ScopeContextValue {
  orgId: string | undefined
  branchId: string | null
}

const ScopeContext = createContext<ScopeContextValue>({
  orgId: undefined,
  branchId: null,
})

export function ScopeProvider({ children }: { children: ReactNode }) {
  const orgId = authStore((s) => s.organization?.id)
  const branchId = branchStore((s) => s.branchId)
  return (
    <ScopeContext.Provider value={{ orgId, branchId }}>
      {children}
    </ScopeContext.Provider>
  )
}

export function useScope() {
  return useContext(ScopeContext)
}
