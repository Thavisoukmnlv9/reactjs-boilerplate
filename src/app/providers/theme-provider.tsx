import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

// Re-exported so the vendored src/core/theme/theme-toggle can import it from here.
// eslint-disable-next-line react-refresh/only-export-components
export { useTheme } from 'next-themes'

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
