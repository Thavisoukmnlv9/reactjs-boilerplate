export interface RoleView {
  id: string
  organization_id: string | null
  name: string
  description: string | null
  is_system: boolean
  member_count: number
  permission_codes: string[]
  created_at: string
}

export interface PermissionView {
  id: string
  code: string
  module: string
  description: string | null
}

export interface RoleWriteInput {
  name: string
  description?: string | null
  permission_codes: string[]
}

export interface Paginated<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

/** Aggregate counts for the roles-page stat cards. */
export interface RoleStats {
  total: number
  system: number
  custom: number
  unused: number
}

export const ROLE_SORT_FIELDS = ['name', 'created_at', 'is_system'] as const

export interface RolesListParams {
  q?: string
  sort?: string
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export type RoleBulkAction = 'delete'

export interface BulkRolesInput {
  action: RoleBulkAction
  ids: string[]
}

export const roleKeys = {
  all: ['roles'] as const,
  list: (params: RolesListParams) => ['roles', 'list', params] as const,
  stats: ['roles', 'stats'] as const,
}
