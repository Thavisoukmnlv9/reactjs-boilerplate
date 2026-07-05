export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  status: string
  /** True for Boilerplate platform operators (not org-scoped). Gates the
   *  subscription/plan operations console. Defaults to false for tenant users. */
  is_platform_staff?: boolean
  platform_staff_role?: string | null
}

export interface Organization {
  id: string
  name: string
  slug: string
  logo_url: string | null
  currency?: string | null
  locale?: string | null
}

/** A branch the signed-in member may operate. Owners get every active org
 *  branch; other members only their assigned ones. Sourced from `/me`. */
export interface MeBranch {
  id: string
  name: string
  is_default: boolean
}

/** A compact stored ABAC policy, shipped by /me so the client can mirror can(). */
export interface MePolicy {
  effect: 'ALLOW' | 'DENY'
  action: string
  subject: string
  conditions: unknown | null
  role_id: string | null
}

export interface MeResponse {
  user: User
  /** Null for an org-less user (freshly registered / platform staff) → route to onboarding. */
  organization: Organization | null
  permissions: string[]
  /** Branches the member may operate; drives branch pickers/filters. */
  branches: MeBranch[]
  /** The member's preferred branch among `branches`, if any. */
  default_branch_id: string | null
  policies: MePolicy[]
  entitlements: { modules: string[]; limits: Record<string, number> }
}
