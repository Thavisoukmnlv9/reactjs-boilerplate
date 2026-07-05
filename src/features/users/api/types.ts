export interface MemberUserView {
  id: string
  email: string | null
  name: string | null
  avatar_url: string | null
  status: string
}

export interface MemberView {
  id: string
  user: MemberUserView
  role_id: string | null
  is_owner: boolean
  status: string
  branch_ids: string[]
  default_branch_id: string | null
  staff_title: string | null
  staff_note: string | null
  invited_at: string
  invitation_expires_at: string | null
  accepted_at: string | null
}

export interface InviteIssued {
  member: MemberView
  invite_token: string
  invitation_expires_at: string
}

export interface InviteInput {
  email: string
  name?: string
  role_id: string
  branch_ids?: string[]
  default_branch_id?: string | null
  staff_title?: string | null
  staff_note?: string | null
}

export interface UpdateInput {
  name?: string
  role_id?: string
  branch_ids?: string[]
  default_branch_id?: string | null
  staff_title?: string | null
  staff_note?: string | null
}

export interface Paginated<T> {
  items: T[]
  total: number
  limit: number
  offset: number
}

/** Aggregate counts for the members-page stat cards. */
export interface UserStats {
  total: number
  active: number
  pending: number
  suspended: number
  inactive: number
}

export const USER_SORT_FIELDS = ['name', 'email', 'status', 'invited_at'] as const

export interface UsersListParams {
  q?: string
  status?: string
  role_id?: string
  sort?: string
  order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export type UserBulkAction = 'remove' | 'resend_invite' | 'set_role'

export interface BulkUsersInput {
  action: UserBulkAction
  ids: string[]
  role_id?: string
}

export const userKeys = {
  all: ['users'] as const,
  list: (params: UsersListParams) => ['users', 'list', params] as const,
  stats: ['users', 'stats'] as const,
  one: (id: string) => ['users', id] as const,
}
