/**
 * Analytics wrapper — canonical interface used across the admin portal.
 * No-op today; canonical event taxonomy in ``dev-note/analytics-events.md``.
 *
 * When wiring a provider (PostHog recommended for product analytics +
 * feature flags), edit ``initAnalytics`` only; call sites need no change.
 */

let initialized = false

export function initAnalytics(): void {
  if (initialized) return
  initialized = true
  // TODO:
  //   import posthog from 'posthog-js'
  //   posthog.init(import.meta.env.VITE_POSTHOG_KEY, { api_host, capture_pageview: false })
}

export function identify(
  userId: string,
  props?: Record<string, unknown>
): void {
  if (import.meta.env.DEV) {
    console.debug('[analytics] identify', userId, props)
  }
  // TODO: posthog.identify(userId, props)
}

export function resetUser(): void {
  // TODO: posthog.reset()
}

export function track(event: string, props?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.debug('[analytics] track', event, props ?? {})
  }
  // TODO: posthog.capture(event, props)
}

export function isFeatureEnabled(_flag: string): boolean {
  return false
}
