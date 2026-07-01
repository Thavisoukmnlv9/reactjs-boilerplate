import type { AuthUser } from '@/lib/auth'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: AuthUser
}
