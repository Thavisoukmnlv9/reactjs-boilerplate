import {
  ENABLED_MODULE_CODES,
  MODULES,
  type ModuleCode,
} from '@/core/constants/modules'
import { ROUTES } from '@/core/constants/routes'

export interface SidebarItem {
  /**
   * Either a literal label OR an i18n key (e.g. `sidebar.platform.users`).
   * Consumers should pass this through `t()` to translate.
   */
  label: string
  path: string
  icon: string
  moduleCode?: string
  permission?: string
  children?: SidebarItem[]
  defaultOpen?: boolean
}

export interface ModuleNavLink {
  kind?: 'link'
  /** i18n key (e.g. `sidebar.example.items`). */
  label: string
  path: string
  icon?: string
  matchExact?: boolean
  /**
   * Permission code gating this link. When set, the link (and any group
   * header left empty by it) is hidden from users who lack the permission.
   * Omit to always show the link to anyone who has the module.
   */
  permission?: string
}

export interface ModuleNavGroup {
  kind: 'group'
  /** i18n key (e.g. `sidebar.group.overview`). */
  label: string
  icon?: string
}

export type ModuleNavChild = ModuleNavLink | ModuleNavGroup

export const isModuleNavLink = (
  child: ModuleNavChild
): child is ModuleNavLink => child.kind !== 'group'

export const moduleNavDefaultOpen: Partial<Record<ModuleCode, boolean>> = {
  example: true,
}

export const moduleNavChildren: Partial<Record<ModuleCode, ModuleNavChild[]>> =
  {
    example: [
      { kind: 'group', label: 'sidebar.group.overview', icon: 'Gauge' },
      {
        label: 'sidebar.example.dashboard',
        path: '/example/',
        icon: 'LayoutDashboard',
        matchExact: true,
        permission: 'example.view',
      },
      {
        label: 'sidebar.example.items',
        path: '/example/items/',
        icon: 'ClipboardList',
        permission: 'example.view',
      },
      {
        label: 'sidebar.example.reports',
        path: '/example/reports/',
        icon: 'BarChart3',
        permission: 'example.reports',
      },

      { kind: 'group', label: 'sidebar.group.setup', icon: 'Settings' },
      {
        label: 'sidebar.example.settings',
        path: '/example/settings/',
        icon: 'SlidersHorizontal',
        permission: 'example.manage',
      },
    ],
  }

export const platformItems: SidebarItem[] = [
  // ── People ─────────────────────────────────────────────────────────────
  {
    label: 'sidebar.platform.users',
    path: ROUTES.USERS,
    icon: 'Users',
    permission: 'platform.users.read',
    defaultOpen: true,
  },
  {
    label: 'sidebar.platform.roles',
    path: ROUTES.ROLES,
    icon: 'Shield',
    permission: 'platform.roles.read',
  },
]

export const moduleNavOrder: Partial<Record<ModuleCode, number>> = {
  example: 1,
}

export const moduleLabelKeys: Partial<Record<ModuleCode, string>> = {
  example: 'sidebar.module.example',
}

export const moduleItems: SidebarItem[] = MODULES.filter((m) =>
  ENABLED_MODULE_CODES.includes(m.code)
)
  .map((m) => ({
    label: moduleLabelKeys[m.code] ?? m.label,
    path: m.path,
    icon: m.icon,
    moduleCode: m.code,
  }))
  .sort(
    (a, b) =>
      (moduleNavOrder[a.moduleCode as ModuleCode] ?? Number.MAX_SAFE_INTEGER) -
      (moduleNavOrder[b.moduleCode as ModuleCode] ?? Number.MAX_SAFE_INTEGER)
  )
