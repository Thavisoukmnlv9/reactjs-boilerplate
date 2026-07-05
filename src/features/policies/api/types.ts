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

/** Aggregate counts for the policies-page stat cards. */
export interface PolicyStats {
  total: number
  allow: number
  deny: number
  conditional: number
}

export const POLICY_SORT_FIELDS = ['effect', 'action', 'subject', 'created_at', 'updated_at'] as const

export interface PoliciesListParams {
  subject?: string
  action?: string
  role_id?: string
  sort?: string
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface BulkPoliciesInput {
  action: 'delete'
  ids: string[]
}

/** Catalog served by GET /policies/condition-schema; drives the guided builder. */
export type ConditionFieldType = 'boolean' | 'string' | 'number' | 'enum' | 'string[]'

export interface ConditionField {
  path: string
  label: string
  type: ConditionFieldType
  options?: string[]
  operators?: string[]
}

export interface PolicyConditionSchema {
  operators: { value: string; label: string }[]
  principal: ConditionField[]
  subjects: Record<string, ConditionField[]>
}

export const policyKeys = {
  all: ['policies'] as const,
  list: (params: PoliciesListParams) => ['policies', 'list', params] as const,
  stats: ['policies', 'stats'] as const,
  conditionSchema: ['policies', 'condition-schema'] as const,
  one: (id: string) => ['policies', id] as const,
}
