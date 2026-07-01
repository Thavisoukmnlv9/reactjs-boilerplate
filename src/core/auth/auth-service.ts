import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'
import type { MeResponse } from '@/core/types/auth'
import { authStore } from './auth-store'
import { tokenStorage } from './token'

export interface LoginCredentials {
  email: string
  password: string
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const res = await apiClient.post<{
      access_token: string
      refresh_token: string
    }>(endpoints.auth.login, credentials)
    const { access_token, refresh_token } = res
    tokenStorage.setAccessToken(access_token)
    tokenStorage.setRefreshToken(refresh_token)
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
