export const POLICY_ACTIONS = ['read', 'create', 'update', 'delete', 'manage', '*'] as const
export const POLICY_SUBJECTS = ['Branch', 'Role', 'User', 'Policy', 'Organization', '*'] as const
export const POLICY_EFFECTS = ['ALLOW', 'DENY'] as const

export interface PolicyView {
  id: string
  organization_id: string
  role_id: string | null
  effect: 'ALLOW' | 'DENY'
  action: string
  subject: string
  conditions: unknown | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface PolicyWriteInput {
  effect: 'ALLOW' | 'DENY'
  action: string
  subject: string
  role_id?: string | null
  conditions?: unknown | null
  description?: string | null
}

export interface Paginated<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

export const policyKeys = {
  all: ['policies'] as const,
  one: (id: string) => ['policies', id] as const,
}
