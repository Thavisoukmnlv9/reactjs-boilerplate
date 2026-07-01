export type UserRole = 'admin' | 'member' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface UsersQuery {
  search?: string
}
