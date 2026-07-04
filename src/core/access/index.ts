/**
 * Access-control library — the single import surface for auth + permissions on the
 * client. Feature code imports from `@/core/access`, never the deep `core/auth` /
 * `core/permissions` paths. Mirrors the backend `@/access` package.
 */
export { tokenStorage } from '@/core/auth/token'
export { authStore } from '@/core/auth/auth-store'
export type { Entitlements } from '@/core/auth/auth-store'
export { authService } from '@/core/auth/auth-service'
export type { LoginCredentials } from '@/core/auth/auth-service'
export { useMe, useLogin, useLogout } from '@/core/auth/auth-hooks'
export { sessionManager } from '@/core/auth/session-manager'
export { useCan, useCanAny, useCanCheck } from '@/core/permissions/permission-hooks'
export { PermissionGate } from '@/core/permissions/permission-gate'
export { meQueryOptions } from './me-query'
export type { MeResponse, MePolicy, User, Organization, MeBranch } from '@/core/types/auth'
