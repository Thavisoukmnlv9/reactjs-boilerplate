import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'
import type { MeResponse, Organization } from '@/core/types/auth'
import { authStore } from './auth-store'
import { tokenStorage } from './token'

export interface LoginCredentials {
  email: string
  password: string
}

export interface TokenPair {
  access_token: string
  refresh_token: string
}

export interface RegisterInput {
  email: string
  password: string
  display_name?: string
}

export interface AcceptInviteInput {
  token: string
  password: string
  name?: string
}

export interface CreateOrganizationInput {
  name: string
  first_branch_name?: string
  currency_code?: string
  locale?: string
  timezone?: string
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const res = await apiClient.post<TokenPair>(endpoints.auth.login, credentials)
    tokenStorage.setAccessToken(res.access_token)
    tokenStorage.setRefreshToken(res.refresh_token)
    return res
  },

  /** Self-serve register — creates an org-less account, then the SPA routes to onboarding. */
  async register(input: RegisterInput) {
    const res = await apiClient.post<TokenPair>(endpoints.auth.register, input)
    tokenStorage.setAccessToken(res.access_token)
    tokenStorage.setRefreshToken(res.refresh_token)
    return res
  },

  /** Accept an org invite: set a password and auto-login. */
  async acceptInvite(input: AcceptInviteInput) {
    const res = await apiClient.post<TokenPair>(endpoints.auth.acceptInvite, input)
    tokenStorage.setAccessToken(res.access_token)
    tokenStorage.setRefreshToken(res.refresh_token)
    return res
  },

  /** Onboarding: create an org, become Owner, and swap in the org-scoped access token. */
  async createOrganization(input: CreateOrganizationInput) {
    const res = await apiClient.post<{ organization: Organization; access_token: string }>(
      endpoints.organizations.create,
      input
    )
    tokenStorage.setAccessToken(res.access_token)
    return res
  },

  async logout() {
    const refreshToken = tokenStorage.getRefreshToken()
    try {
      if (refreshToken) {
        await apiClient.post(endpoints.auth.logout, {
          refresh_token: refreshToken,
        })
      }
    } finally {
      authStore.getState().logout()
    }
  },

  async forgotPassword(email: string) {
    return apiClient.post(endpoints.auth.forgotPassword, { email })
  },

  async resetPassword(token: string, newPassword: string) {
    return apiClient.post(endpoints.auth.resetPassword, {
      token,
      new_password: newPassword,
    })
  },

  async fetchMe() {
    return apiClient.get<MeResponse>(endpoints.me.get)
  },
}
