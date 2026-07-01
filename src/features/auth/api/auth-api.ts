import { api } from '@/lib/api'
import { clearTokens, setTokens, type AuthUser } from '@/lib/auth'

import type { LoginCredentials, LoginResponse } from '../types'

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', credentials)
  setTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken })
  return response
}

export function logout(): void {
  clearTokens()
  // If your backend maintains server-side sessions, also fire-and-forget:
  // void api.post('/auth/logout').catch(() => {})
}

export function getCurrentUser(): Promise<AuthUser> {
  return api.get<AuthUser>('/auth/me')
}
