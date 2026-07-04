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
  /** i18n key (e.g. `sidebar.posShop.products`). */
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
  // pos_shop: false,
  pos_food_service: true,
  // pos_clothing: false,
}

export const moduleNavChildren: Partial<Record<ModuleCode, ModuleNavChild[]>> =
  {
    pos_food_service: [
      { kind: 'group', label: 'sidebar.group.overview', icon: 'Gauge' },
      {
        label: 'sidebar.posFoodService.dashboard',
        path: '/pos/food-service/',
        icon: 'LayoutDashboard',
        matchExact: true,
        permission: 'pos_food_service.dashboard',
      },
      {
        label: 'sidebar.posFoodService.reports',
        path: '/pos/food-service/reports/',
        icon: 'BarChart3',
        permission: 'pos_food_service.reports',
      },

      { kind: 'group', label: 'sidebar.group.operations', icon: 'Activity' },
      {
        label: 'sidebar.posFoodService.orders',
        path: '/pos/food-service/orders/',
        icon: 'ClipboardList',
        permission: 'pos_food_service.orders',
      },
      {
        label: 'sidebar.posFoodService.tables',
        path: '/pos/food-service/tables/',
        icon: 'Armchair',
        permission: 'pos_food_service.tables',
      },
      {
        label: 'sidebar.posFoodService.reservations',
        path: '/pos/food-service/reservations/',
        icon: 'CalendarCheck',
        permission: 'pos_food_service.reservations',
      },

      { kind: 'group', label: 'sidebar.group.menu', icon: 'BookOpen' },
      {
        label: 'sidebar.posFoodService.menu',
        path: '/pos/food-service/menu/',
        icon: 'BookOpen',
        permission: 'pos_food_service.menu',
      },
      {
        label: 'sidebar.posFoodService.products',
        path: '/pos/food-service/products/',
        icon: 'Coffee',
        permission: 'pos_food_service.products',
      },
      {
        label: 'sidebar.posFoodService.categories',
        path: '/pos/food-service/categories/',
        icon: 'FolderTree',
        permission: 'pos_food_service.categories',
      },
      {
        label: 'sidebar.posFoodService.promotions',
        path: '/pos/food-service/promotions/',
        icon: 'BadgePercent',
        permission: 'pos_food_service.promotions',
      },
      {
        label: 'sidebar.posFoodService.combos',
        path: '/pos/food-service/combos/',
        icon: 'Package',
        permission: 'pos_food_service.combos',
      },

      { kind: 'group', label: 'sidebar.group.inventory', icon: 'Warehouse' },
      {
        label: 'sidebar.posFoodService.inventories',
        path: '/pos/food-service/inventories/',
        icon: 'Boxes',
        permission: 'pos_food_service.inventory',
      },
      {
        label: 'sidebar.posFoodService.stockTransfers',
        path: '/pos/food-service/stock-transfers/',
        icon: 'ArrowLeftRight',
        permission: 'pos_food_service.stock_transfers',
      },
      {
        label: 'sidebar.posFoodService.suppliers',
        path: '/pos/food-service/suppliers/',
        icon: 'Truck',
        permission: 'pos_food_service.suppliers',
      },
      { kind: 'group', label: 'sidebar.group.people', icon: 'Users' },
      {
        label: 'sidebar.posFoodService.customers',
        path: '/pos/food-service/customers/',
        icon: 'Users',
        permission: 'pos_food_service.customers',
      },
      {
        label: 'sidebar.posFoodService.shifts',
        path: '/pos/food-service/shifts/',
        icon: 'CalendarDays',
        permission: 'pos_food_service.shifts',
      },
      {
        label: 'sidebar.posFoodService.timeClock',
        path: '/pos/food-service/time-clock/',
        icon: 'Clock',
        permission: 'pos_food_service.time_clock',
      },
      // {
      //   label: 'sidebar.posFoodService.staff',
      //   path: '/pos/food-service/staff/',
      //   icon: 'UserCog',
      //   permission: 'pos_food_service.staff',
      // },

      { kind: 'group', label: 'sidebar.group.setup', icon: 'Settings' },
      {
        label: 'sidebar.posFoodService.branches',
        path: '/pos/food-service/branches/',
        icon: 'MapPin',
        // Food-service branches reuse the shop branch surface (shared clone),
        // so the page guards on pos_shop.branches — gate the nav to match.
        permission: 'pos_shop.branches',
      },
      {
        label: 'sidebar.posFoodService.billConfig',
        path: '/pos/food-service/bill-config/',
        icon: 'ReceiptText',
        permission: 'pos_food_service.bill_config',
      },
      {
        label: 'sidebar.posFoodService.measurementUnits',
        path: '/pos/food-service/measurement-units/',
        icon: 'Ruler',
        permission: 'pos_food_service.measurement_units',
      },
      {
        label: 'sidebar.posFoodService.paymentMethods',
        path: '/pos/food-service/payment-methods/',
        icon: 'CreditCard',
        permission: 'pos_food_service.payment_methods',
      },
      {
        label: 'sidebar.posFoodService.devices',
        path: '/pos/food-service/devices/',
        icon: 'Monitor',
        permission: 'pos_food_service.devices',
      },
      {
        label: 'sidebar.posFoodService.tax',
        path: '/pos/food-service/tax/',
        icon: 'Percent',
        permission: 'pos_food_service.tax',
      },
      {
        label: 'sidebar.posFoodService.tips',
        path: '/pos/food-service/tips/',
        icon: 'HandCoins',
        permission: 'pos_food_service.tips',
      },
      {
        label: 'sidebar.posFoodService.audit',
        path: '/pos/food-service/audit/',
        icon: 'ScrollText',
        permission: 'pos_food_service.audit',
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
  pos_food_service: 1,
}


export const moduleLabelKeys: Partial<Record<ModuleCode, string>> = {
  pos_food_service: 'sidebar.module.posFoodService',
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
