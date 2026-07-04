import type { ReactNode } from 'react'

import { LanguageSwitcher } from '@/components/common/language-switcher'
import { ThemeToggle } from '@/components/common/theme-toggle'

/** Public/guest + onboarding shell. Children are the routed page (an <Outlet/>). */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-muted/30 relative flex min-h-svh flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">{children}</div>
    </div>
  )
}
