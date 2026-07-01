import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { LogOut, User } from 'lucide-react'
import { authService } from '@/core/auth/auth-service'
import { authStore } from '@/core/auth/auth-store'
import { ThemeToggle } from '@/core/theme/theme-toggle'
import { LanguageSwitcher } from '@/shared/components/layout/language-switcher'
import { NotificationsPopover } from '@/shared/components/layout/notifications-popover'
import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { SidebarTrigger } from '@/shared/components/ui/sidebar'

export function Topbar() {
  const user = authStore((s) => s.user)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    try {
      await authService.logout()
    } finally {
      queryClient.clear()
      await navigate({ to: '/login', replace: true })
    }
  }
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
      </div>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationsPopover />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="User menu">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name ?? user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
