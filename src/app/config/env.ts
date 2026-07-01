import { env as baseEnv } from '@/config/env'

/**
 * Compatibility shim for the vendored `src/core`, which expects an origin-only
 * `apiBaseUrl` (it appends `/api/v1` itself). The boilerplate's env already
 * includes the version segment, so strip it here.
 */
export const env = {
  ...baseEnv,
  apiBaseUrl: baseEnv.apiBaseUrl.replace(/\/api\/v\d+\/?$/, ''),
}
