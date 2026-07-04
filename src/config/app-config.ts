import { env } from './env'

/**
 * Static, non-secret app configuration derived from validated `env`.
 * One import surface for names, timeouts, storage keys, and route defaults.
 */
export const appConfig = {
  name: env.appName,
  description: 'Production-grade modular React + TypeScript boilerplate',
  defaultLocale: 'en',
  supportedLocales: ['en', 'es'] as const,
  api: {
    baseUrl: env.apiBaseUrl,
    timeout: 30_000,
  },
  auth: {
    // NOTE: localStorage is used for demo simplicity. For production prefer
    // httpOnly, SameSite cookies set by the backend — see docs/ARCHITECTURE.md.
    accessTokenKey: 'rb_access_token',
    refreshTokenKey: 'rb_refresh_token',
    loginPath: '/login',
    afterLoginPath: '/',
  },
  query: {
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  },
} as const

export type SupportedLocale = (typeof appConfig.supportedLocales)[number]
