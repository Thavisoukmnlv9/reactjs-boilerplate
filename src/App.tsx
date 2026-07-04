import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'

import { queryClient } from '@/app/providers/query-client'
import { I18nProvider } from '@/app/providers/i18n-provider'
import { ThemeProvider } from '@/app/providers/theme-provider'
import { router } from '@/app/router/router'
import { Toaster } from '@/components/ui/sonner'

/**
 * Composition root. The router's `beforeLoad` IS the auth bootstrap (it awaits
 * `/me` via the shared queryClient), so there is no separate AuthProvider.
 */
export function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} context={{ queryClient }} />
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  )
}
