/**
 * Sentry wrapper — canonical interface.
 *
 * No-op today; when the team installs ``@sentry/react``, wire the init in
 * ``initSentry`` and the rest of the app keeps using ``reportError``.
 *
 *   ```ts
 *   import * as Sentry from '@sentry/react'
 *   Sentry.init({
 *     dsn: import.meta.env.VITE_SENTRY_DSN,
 *     environment: import.meta.env.MODE,
 *     integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration({maskAllText: true})],
 *     tracesSampleRate: 0.05,
 *     replaysSessionSampleRate: 0.01,
 *     replaysOnErrorSampleRate: 1.0,
 *   })
 *   ```
 */

let initialized = false

export function initSentry(): void {
  if (initialized) return
  initialized = true
}

export function reportError(
  error: unknown,
  context?: Record<string, unknown>
): void {
  if (import.meta.env.DEV) {
    console.error('[sentry]', error, context ?? {})
  }
  // TODO: Sentry.captureException(error, { extra: context })
}

export function setUser(user: { id: string; email?: string } | null): void {
  // TODO: Sentry.setUser(user)
  if (import.meta.env.DEV) {
    console.debug('[sentry] setUser', user)
  }
}
