import { LayoutDashboard, Users, type LucideIcon } from 'lucide-react'

import { PERMISSIONS, ROUTES } from './constants'

export interface NavItem {
  to: string
  /** i18next key in `ns:key` form, e.g. 'users:title'. */
  labelKey: string
  icon: LucideIcon
  /** Optional permission required to see this item. */
  permission?: string
}

export const navItems: NavItem[] = [
  { to: ROUTES.dashboard, labelKey: 'dashboard:title', icon: LayoutDashboard },
  { to: ROUTES.users, labelKey: 'users:title', icon: Users, permission: PERMISSIONS.usersRead },
]
