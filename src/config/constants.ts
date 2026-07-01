/** Centralized route paths — import these instead of hardcoding strings. */
export const ROUTES = {
  root: '/',
  login: '/login',
  dashboard: '/',
  users: '/users',
  userDetail: (id: string) => `/users/${id}`,
  settings: '/settings',
} as const

/** Example permission constants used by the RBAC guards. */
export const PERMISSIONS = {
  usersRead: 'users:read',
  usersWrite: 'users:write',
  usersDelete: 'users:delete',
} as const
