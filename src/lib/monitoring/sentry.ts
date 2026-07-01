import * as Sentry from '@sentry/react'

import { env } from '@/config/env'

/** No-op unless VITE_ENABLE_SENTRY=true and a DSN is provided. */
export function initMonitoring(): void {
  if (!env.enableSentry || !env.sentryDsn) return
  Sentry.init({
    dsn: env.sentryDsn,
    environment: env.isProd ? 'production' : 'development',
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
  })
}

export function captureException(error: unknown): void {
  if (env.enableSentry) Sentry.captureException(error)
}
