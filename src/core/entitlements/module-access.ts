import { MODULES } from '@/core/constants/modules'
import { entitlementService } from './entitlement-service'

export function hasModuleAccess(moduleCode: string): boolean {
  return entitlementService.hasModule(moduleCode)
}

export function getEnabledModules(): string[] {
  return MODULES.map((m) => m.code).filter(entitlementService.hasModule)
}
