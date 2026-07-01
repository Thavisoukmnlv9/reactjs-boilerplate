import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'

import { appConfig } from '@/config/app-config'
import { env } from '@/config/env'
import { ApiError } from '@/lib/api'

function messageFor(error: unknown): string {
  return error instanceof ApiError ? error.message : 'Unexpected error'
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: appConfig.query.staleTime,
            gcTime: appConfig.query.gcTime,
            retry: appConfig.query.retry,
            refetchOnWindowFocus: false,
          },
          mutations: { retry: 0 },
        },
        // Surface server errors from background refetches globally; component
        // handlers still receive the error first via useQuery's error state.
        queryCache: new QueryCache({
          onError: (error) => {
            if (error instanceof ApiError && error.status >= 500) toast.error(messageFor(error))
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => toast.error(messageFor(error)),
        }),
      }),
  )

  return (
    <QueryClientProvider client={client}>
      {children}
      {env.isDev ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  )
}
