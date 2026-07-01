export interface Branch {
  id: string
  organization_id: string
  name: string
  code: string | null
  address: string | null
  timezone: string | null
  type: string | null
  is_active: boolean
}

export interface Role {
  id: string
  name: string
  is_system: boolean
}

export interface Permission {
  id: string
  code: string
  module: string | null
  description: string | null
}
