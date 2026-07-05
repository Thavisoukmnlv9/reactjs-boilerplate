import { Link, Outlet, useMatches, useNavigate } from '@tanstack/react-router'
import { Building2, LayoutDashboard, LogOut, Menu, ScrollText, Shield, Users } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

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
import { authStore, useCan, useCanCheck, useLogout, useMe } from '@/core/access'
import { PERMISSIONS } from '@/core/constants/permissions'
import { cn } from '@/core/utils/cn'
import { LanguageSwitcher } from '@/shared/components/layout/language-switcher'

interface NavItem {
  to: string
  labelKey: 'nav.dashboard' | 'nav.users' | 'nav.roles' | 'nav.branches' | 'nav.policies'
  icon: typeof LayoutDashboard
  permission?: string
}

const NAV: NavItem[] = [
  { to: '/dashboard', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/users', labelKey: 'nav.users', icon: Users, permission: PERMISSIONS.USERS_READ },
  { to: '/roles', labelKey: 'nav.roles', icon: Shield, permission: PERMISSIONS.ROLES_READ },
  { to: '/branches', labelKey: 'nav.branches', icon: Building2, permission: PERMISSIONS.BRANCHES_READ },
  { to: '/policies', labelKey: 'nav.policies', icon: ScrollText, permission: PERMISSIONS.POLICIES_READ },
]

function initials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/** Renders the deepest matched route's `staticData.permission` gate, or the page. */
function RoutePermissionGate({ children }: { children: ReactNode }) {
  const { t } = useTranslation('common')
  const matches = useMatches()
  const required = [...matches].reverse().find((m) => m.staticData?.permission)?.staticData?.permission
  const allowed = useCan(required)
  if (required && !allowed) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2 text-center">
        <Shield className="text-muted-foreground size-8" />
        <h2 className="text-lg font-semibold">{t('permission.noAccess')}</h2>
        <p className="text-muted-foreground text-sm">{t('permission.noAccessHint')}</p>
      </div>
    )
  }
  return <>{children}</>
}

export function AppLayout() {
  const { t } = useTranslation(['common', 'auth'])
  useMe() // keep the Zustand store mirrored from the /me query cache
  const canSee = useCanCheck()
  const user = authStore((s) => s.user)
  const logout = useLogout()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    try {
      await logout.mutateAsync()
    } finally {
      void navigate({ to: '/login' })
    }
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {NAV.filter((item) => canSee(item.permission)).map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => setMobileOpen(false)}
          className="text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors"
          activeProps={{ className: 'bg-sidebar-accent text-sidebar-accent-foreground' }}
        >
          <item.icon className="size-4" />
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  )

  return (
    <div className="bg-background flex min-h-svh">
      <aside className="bg-sidebar border-sidebar-border hidden w-64 shrink-0 flex-col border-r md:flex">
        <div className="flex h-14 items-center px-4 font-semibold">
          <Link to="/dashboard">{appConfig.name}</Link>
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
            <div className="flex h-14 items-center px-4 font-semibold">{appConfig.name}</div>
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
            className={cn('md:hidden')}
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
                  <AvatarFallback>{initials(user?.name)}</AvatarFallback>
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
          <RoutePermissionGate>
            <Outlet />
          </RoutePermissionGate>
        </main>
      </div>
    </div>
  )
}
