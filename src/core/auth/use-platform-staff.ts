import { authStore } from '@/core/auth/auth-store'

/**
 * True when the signed-in user is a Boilerplate platform operator
 * (`is_platform_staff`). Platform-staff endpoints under `/api/v1/platform`
 * are gated server-side by `require_platform_staff`; this mirrors that gate on
 * the client so the operations console (plan + org-subscription management) is
 * only surfaced to staff. Tenant users get `false`.
 */
export function useIsPlatformStaff(): boolean {
  return authStore((s) => s.user?.is_platform_staff ?? false)
}
