import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { appConfig } from '@/config/app-config'
import { ApiError } from '@/core/api/api-error'

function messageFor(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Unexpected error'
}

/**
 * The single QueryClient — shared by the React tree (QueryClientProvider) AND the
 * router (`context.queryClient` for `beforeLoad`'s `ensureQueryData`). It must be
 * one instance so the /me the router awaits is the same cache the hooks read.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: appConfig.query.staleTime,
      gcTime: appConfig.query.gcTime,
      retry: appConfig.query.retry,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: 0 },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof ApiError && error.status >= 500) toast.error(messageFor(error))
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => toast.error(messageFor(error)),
  }),
})
