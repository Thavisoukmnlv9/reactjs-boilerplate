import { useQuery } from '@tanstack/react-query'
import { useEffect, type ReactNode } from 'react'

import { getCurrentUser } from '@/features/auth/api/auth-api'
import { queryKeys } from '@/lib/api'
import { hasSession, useAuthStore } from '@/lib/auth'

/**
 * Hydrates the auth store from /auth/me when a token exists. The token is the
 * source of truth; the user snapshot is always re-fetched (never persisted).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser)
  const setStatus = useAuthStore((s) => s.setStatus)
  const enabled = hasSession()

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getCurrentUser,
    enabled,
    retry: false,
    staleTime: Infinity,
  })

  useEffect(() => {
    if (!enabled) {
      setStatus('unauthenticated')
      return
    }
    if (isLoading) setStatus('idle')
    if (isSuccess && data) setUser(data)
    if (isError) setStatus('unauthenticated')
  }, [enabled, isLoading, isSuccess, isError, data, setUser, setStatus])

  return <>{children}</>
}
