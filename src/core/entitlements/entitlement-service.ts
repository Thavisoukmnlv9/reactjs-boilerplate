import { authStore } from '@/core/auth/auth-store'

export const entitlementService = {
  hasModule: (moduleCode: string): boolean => {
    return authStore.getState().entitlements.modules.includes(moduleCode)
  },
  getLimit: (key: string): number | undefined => {
    return authStore.getState().entitlements.limits[key]
  },
}
