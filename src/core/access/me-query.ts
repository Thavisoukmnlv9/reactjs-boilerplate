import { queryOptions } from '@tanstack/react-query'
import { queryKeys } from '@/core/api/query-keys'
import { authService } from '@/core/auth/auth-service'

/**
 * The single /me bootstrap definition. The router's `_app`/`_onboarding`
 * `beforeLoad` awaits `queryClient.ensureQueryData(meQueryOptions())`, so no
 * protected UI renders before /me resolves — the auth gate is race-free by
 * construction (no `isBootstrapped` flag needed). `staleTime` avoids a refetch on
 * every navigation; window-focus refetch (in `useMe`) picks up permission changes.
 */
export const meQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.me(),
    queryFn: authService.fetchMe,
    staleTime: 60_000,
  })
