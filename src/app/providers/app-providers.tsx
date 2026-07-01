import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'

import { AuthProvider } from './auth-provider'
import { I18nProvider } from './i18n-provider'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'

/** Single composition point for every cross-cutting provider. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <I18nProvider>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </I18nProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
