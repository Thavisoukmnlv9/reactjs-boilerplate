import { appConfig } from '@/config/app-config'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

const { accessTokenKey, refreshTokenKey } = appConfig.auth

/**
 * Token persistence. Uses localStorage for demo simplicity; production apps
 * should prefer httpOnly cookies so tokens are never reachable from JS.
 * Centralizing access here means that swap touches only this file.
 */
export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(accessTokenKey)
  } catch {
    return null
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(refreshTokenKey)
  } catch {
    return null
  }
}

export function setTokens(tokens: AuthTokens): void {
  localStorage.setItem(accessTokenKey, tokens.accessToken)
  localStorage.setItem(refreshTokenKey, tokens.refreshToken)
}

export function clearTokens(): void {
  localStorage.removeItem(accessTokenKey)
  localStorage.removeItem(refreshTokenKey)
}

export function hasSession(): boolean {
  return Boolean(getAccessToken())
}
