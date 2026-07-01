import { LogOut, Menu, PanelLeftClose } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

import { LanguageSwitcher } from '@/components/common/language-switcher'
import { RoleGate } from '@/components/common/role-gate'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { appConfig } from '@/config/app-config'
import { navItems } from '@/config/navigation'
import { logout } from '@/features/auth/api/auth-api'
import { useAuth } from '@/hooks/use-auth'
import { useAuthStore } from '@/lib/auth'
import { cn, initials } from '@/lib/utils'

export function DashboardLayout() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const navigate = useNavigate()
  const reset = useAuthStore((s) => s.reset)
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    logout()
    reset()
    navigate(appConfig.auth.loginPath, { replace: true })
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {navItems.map((item) => {
        const link = (
          <NavLink
            to={item.to}
            end={item.to === '/'}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
              )
            }
          >
            <item.icon className="size-4" />
            {t(item.labelKey)}
          </NavLink>
        )
        return item.permission ? (
          <RoleGate key={item.to} permission={item.permission}>
            {link}
          </RoleGate>
        ) : (
          <span key={item.to}>{link}</span>
        )
      })}
    </nav>
  )

  return (
    <div className="bg-background flex min-h-svh">
      <aside className="bg-sidebar border-sidebar-border hidden w-64 shrink-0 flex-col border-r md:flex">
        <div className="flex h-14 items-center px-4 font-semibold">
          <Link to="/">{appConfig.name}</Link>
        </div>
        <Separator className="bg-sidebar-border" />
        {nav}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="bg-sidebar border-sidebar-border absolute inset-y-0 left-0 flex w-64 flex-col border-r">
            <div className="flex h-14 items-center justify-between px-4 font-semibold">
              <Link to="/" onClick={() => setMobileOpen(false)}>
                {appConfig.name}
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <PanelLeftClose className="size-4" />
              </Button>
            </div>
            <Separator className="bg-sidebar-border" />
            {nav}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="size-4" />
          </Button>
          <div className="flex-1" />
          <LanguageSwitcher />
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarFallback>{user ? initials(user.name) : '?'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.name}</span>
                  <span className="text-muted-foreground text-xs">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                <LogOut className="size-4" />
                {t('auth:signOut')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
