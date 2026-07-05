export interface BranchView {
  id: string
  organization_id: string
  name: string
  code: string | null
  address: string | null
  type: string | null
  vertical: string | null
  is_active: boolean
  is_main: boolean
  phone: string | null
  email: string | null
  timezone: string
  currency_code: string
  locale: string
  tax_rate_bps: number
  service_fee_bps: number
  prices_include_tax: boolean
  created_at: string
  updated_at: string
}

export interface BranchWriteInput {
  name: string
  code?: string | null
  address?: string | null
  type?: string | null
  vertical?: string | null
  phone?: string | null
  email?: string | null
  timezone?: string
  currency_code?: string
  locale?: string
  tax_rate_bps?: number
  service_fee_bps?: number
  prices_include_tax?: boolean
  is_active?: boolean
}

export interface Paginated<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

/** Aggregate counts for the branches-page stat cards. */
export interface BranchStats {
  total: number
  active: number
  archived: number
  by_vertical: Record<string, number>
}

export const BRANCH_VERTICALS = ['GENERAL', 'RETAIL', 'SERVICE'] as const
export const BRANCH_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'] as const
export const BRANCH_SORT_FIELDS = ['name', 'code', 'vertical', 'is_active', 'created_at', 'updated_at'] as const

export interface BranchesListParams {
  q?: string
  is_active?: boolean
  vertical?: string
  sort?: string
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export type BranchBulkAction = 'archive' | 'activate' | 'delete'

export interface BulkBranchesInput {
  action: BranchBulkAction
  ids: string[]
}

export const branchKeys = {
  all: ['branches'] as const,
  list: (params: BranchesListParams) => ['branches', 'list', params] as const,
  stats: ['branches', 'stats'] as const,
  one: (id: string) => ['branches', id] as const,
}
