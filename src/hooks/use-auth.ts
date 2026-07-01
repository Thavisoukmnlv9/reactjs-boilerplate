import { useAuthStore } from '@/lib/auth'

/** Read-only view of the current auth session. */
export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const status = useAuthStore((s) => s.status)
  return { user, status, isAuthenticated: status === 'authenticated' }
}
