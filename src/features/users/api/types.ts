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

export const userKeys = {
  all: ['users'] as const,
  one: (id: string) => ['users', id] as const,
}
