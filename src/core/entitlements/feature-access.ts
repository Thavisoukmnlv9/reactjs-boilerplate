import { can } from '@/core/permissions/can'
import { entitlementService } from './entitlement-service'

export function canAccessFeature(
  moduleCode: string,
  permission: string
): boolean {
  return entitlementService.hasModule(moduleCode) && can(permission)
}
