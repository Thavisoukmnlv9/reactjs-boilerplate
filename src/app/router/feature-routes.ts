import type { AnyRoute } from '@tanstack/react-router'

/**
 * Feature routes mounted under the authenticated `app` layout. Built incrementally
 * (users, roles, branches, policies) so the core auth flow can be verified first.
 * Each feature appends its routes here via `makeFeatureRoutes(appRoute)`.
 */
export function appFeatureRoutes(): AnyRoute[] {
  return []
}
