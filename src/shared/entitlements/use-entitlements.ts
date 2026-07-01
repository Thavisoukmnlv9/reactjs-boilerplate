import { authStore } from '@/core/auth/auth-store'

/**
 * Returns true if the org's current plan includes the given feature.
 *
 * Backed by authStore.entitlements (loaded from /api/v1/entitlements/me at
 * login). Features that aren't in the payload at all return false.
 *
 * Pair with the FeatureGate component to render lock-icon UI when false.
 */
export function useCan(featureCode: string): boolean {
  const features = authStore((s) => s.entitlements?.features ?? [])
  const ent = features.find((f) => f.code === featureCode)
  return !!ent?.included
}

/**
 * Returns the numeric limit for a feature, or null if unlimited / unset.
 *
 * Use for "X of Y users" usage meters and pre-flight count checks.
 */
export function useFeatureLimit(featureCode: string): number | null {
  const features = authStore((s) => s.entitlements?.features ?? [])
  const ent = features.find((f) => f.code === featureCode)
  return ent?.limit ?? null
}

/**
 * Returns true if `currentCount + amount` is within the plan limit for
 * `limitKey` (e.g. `max_branches`, `max_users`). Returns true if no limit
 * is configured on the current plan (treat as unlimited).
 *
 * NOTE: currentCount is passed in by the caller because the entitlements
 * payload doesn't carry live counts. Callers typically pair this with a
 * TanStack Query that fetches the current resource count.
 */
export function useWithinLimit(
  limitKey: string,
  currentCount: number,
  amount = 1
): boolean {
  const limit = authStore((s) => s.entitlements?.limits?.[limitKey])
  if (limit == null) return true
  return currentCount + amount <= limit
}
