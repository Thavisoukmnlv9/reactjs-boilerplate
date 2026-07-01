import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/app/providers/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-md p-2 hover:bg-accent"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  )
}
