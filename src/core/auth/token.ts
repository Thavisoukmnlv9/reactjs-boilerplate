import { secureStorage } from '@/core/security/secure-storage'

const ACCESS_TOKEN_KEY = 'bs_access_token'
const REFRESH_TOKEN_KEY = 'bs_refresh_token'

export const tokenStorage = {
  getAccessToken: () => secureStorage.getString(ACCESS_TOKEN_KEY),
  setAccessToken: (token: string) =>
    secureStorage.setString(ACCESS_TOKEN_KEY, token),
  getRefreshToken: () => secureStorage.getString(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string) =>
    secureStorage.setString(REFRESH_TOKEN_KEY, token),
  clear: () => {
    secureStorage.remove(ACCESS_TOKEN_KEY)
    secureStorage.remove(REFRESH_TOKEN_KEY)
  },
}
