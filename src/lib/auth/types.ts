export interface AuthUser {
  id: string
  name: string
  email: string
  roles: string[]
  permissions: string[]
  avatarUrl?: string
}

export type AuthStatus = 'idle' | 'authenticated' | 'unauthenticated'
