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
