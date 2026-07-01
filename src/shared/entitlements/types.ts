export interface EntitlementFeature {
  code: string
  included: boolean
  limit: number | null
  is_addon: boolean
}

export interface EntitlementsPayload {
  status: string | null
  plan_slug: string | null
  plan_name: string | null
  billing_interval: string | null
  modules: string[]
  features: EntitlementFeature[]
  limits: Record<string, number>
  trial_end: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  grace_until: string | null
}
