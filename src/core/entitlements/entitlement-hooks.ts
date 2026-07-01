import { authStore } from '@/core/auth/auth-store'

export function useHasModule(moduleCode: string | undefined): boolean {
  const modules = authStore((s) => s.entitlements.modules)
  if (moduleCode == null) return true
  return modules.includes(moduleCode)
}

export function useGetLimit(key: string): number | undefined {
  const limits = authStore((s) => s.entitlements.limits)
  return limits[key]
}
