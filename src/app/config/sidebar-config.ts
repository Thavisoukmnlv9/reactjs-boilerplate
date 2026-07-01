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
    // pos_shop: [
    //   { kind: 'group', label: 'sidebar.group.overview', icon: 'Gauge' },
    //   {
    //     label: 'sidebar.posShop.dashboard',
    //     path: '/pos/shop/',
    //     icon: 'BarChart3',
    //     matchExact: true,
    //     permission: 'pos_shop.dashboard',
    //   },

    //   { kind: 'group', label: 'sidebar.group.catalog', icon: 'LibraryBig' },
    //   {
    //     label: 'sidebar.posShop.products',
    //     path: '/pos/shop/products/',
    //     icon: 'Package',
    //     permission: 'pos_shop.products',
    //   },
    //   {
    //     label: 'sidebar.posShop.categories',
    //     path: '/pos/shop/categories/',
    //     icon: 'FolderTree',
    //     permission: 'pos_shop.categories',
    //   },

    //   { kind: 'group', label: 'sidebar.group.inventory', icon: 'Warehouse' },
    //   {
    //     label: 'sidebar.posShop.inventory',
    //     path: '/pos/shop/inventories/',
    //     icon: 'Boxes',
    //     permission: 'pos_shop.inventory',
    //   },
    //   {
    //     label: 'sidebar.posShop.stockTransfers',
    //     path: '/pos/shop/stock-transfers/',
    //     icon: 'ArrowLeftRight',
    //     permission: 'pos_shop.stock_transfers',
    //   },
    //   {
    //     label: 'sidebar.posShop.purchaseOrders',
    //     path: '/pos/shop/purchase-orders/',
    //     icon: 'ScrollText',
    //     permission: 'pos_shop.purchase_orders',
    //   },
    //   {
    //     label: 'sidebar.posShop.suppliers',
    //     path: '/pos/shop/suppliers/',
    //     icon: 'Truck',
    //     permission: 'pos_shop.suppliers',
    //   },

    //   { kind: 'group', label: 'sidebar.group.sales', icon: 'ShoppingBag' },
    //   {
    //     label: 'sidebar.posShop.sales',
    //     path: '/pos/shop/sales/',
    //     icon: 'Receipt',
    //     permission: 'pos_shop.sales',
    //   },
    //   {
    //     label: 'sidebar.posShop.promotions',
    //     path: '/pos/shop/promotions/',
    //     icon: 'BadgePercent',
    //     permission: 'pos_shop.promotions',
    //   },
    //   {
    //     label: 'sidebar.posShop.shifts',
    //     path: '/pos/shop/shifts/',
    //     icon: 'Clock',
    //     permission: 'pos_shop.shifts',
    //   },

    //   { kind: 'group', label: 'sidebar.group.people', icon: 'Users' },
    //   {
    //     label: 'sidebar.posShop.customers',
    //     path: '/pos/shop/customers/',
    //     icon: 'Users',
    //     permission: 'pos_shop.customers',
    //   },

    //   { kind: 'group', label: 'sidebar.group.setup', icon: 'Settings' },
    //   {
    //     label: 'sidebar.posShop.branches',
    //     path: '/pos/shop/branches/',
    //     icon: 'MapPin',
    //     permission: 'pos_shop.branches',
    //   },
    //   {
    //     label: 'sidebar.posShop.billConfig',
    //     path: '/pos/shop/bill-config/',
    //     icon: 'ReceiptText',
    //     permission: 'pos_shop.bill_config',
    //   },
    //   {
    //     label: 'sidebar.posShop.settings',
    //     path: '/pos/shop/settings/',
    //     icon: 'Settings',
    //     permission: 'pos_shop.settings',
    //   },
    //   {
    //     label: 'sidebar.posShop.audit',
    //     path: '/pos/shop/audit/',
    //     icon: 'FileSearch',
    //     permission: 'pos_shop.audit',
    //   },
    // ],
    // pos_clothing: [
    //   { kind: 'group', label: 'sidebar.group.overview', icon: 'Gauge' },
    //   {
    //     label: 'sidebar.posClothing.dashboard',
    //     path: '/pos/clothing/',
    //     icon: 'LayoutDashboard',
    //     matchExact: true,
    //     permission: 'pos_clothing.dashboard',
    //   },
    //   {
    //     label: 'sidebar.posClothing.reports',
    //     path: '/pos/clothing/reports/',
    //     icon: 'BarChart3',
    //     permission: 'pos_clothing.reports',
    //   },

    //   { kind: 'group', label: 'sidebar.group.catalog', icon: 'LibraryBig' },
    //   {
    //     label: 'sidebar.posClothing.products',
    //     path: '/pos/clothing/products/',
    //     icon: 'Shirt',
    //     permission: 'pos_clothing.products',
    //   },
    //   {
    //     label: 'sidebar.posClothing.categories',
    //     path: '/pos/clothing/categories/',
    //     icon: 'FolderTree',
    //     permission: 'pos_clothing.categories',
    //   },
    //   {
    //     label: 'sidebar.posClothing.brands',
    //     path: '/pos/clothing/brands/',
    //     icon: 'BadgeCheck',
    //     permission: 'pos_clothing.brands',
    //   },
    //   {
    //     label: 'sidebar.posClothing.barcodes',
    //     path: '/pos/clothing/barcodes/',
    //     icon: 'Barcode',
    //     permission: 'pos_clothing.barcodes',
    //   },

    //   { kind: 'group', label: 'sidebar.group.pricing', icon: 'Tag' },
    //   {
    //     label: 'sidebar.posClothing.pricing',
    //     path: '/pos/clothing/pricing/',
    //     icon: 'Tag',
    //     permission: 'pos_clothing.pricing',
    //   },
    //   {
    //     label: 'sidebar.posClothing.markdowns',
    //     path: '/pos/clothing/markdowns/',
    //     icon: 'TrendingDown',
    //     permission: 'pos_clothing.markdowns',
    //   },
    //   {
    //     label: 'sidebar.posClothing.promotions',
    //     path: '/pos/clothing/promotions/',
    //     icon: 'BadgePercent',
    //     permission: 'pos_clothing.promotions',
    //   },

    //   { kind: 'group', label: 'sidebar.group.inventory', icon: 'Warehouse' },
    //   {
    //     label: 'sidebar.posClothing.inventory',
    //     path: '/pos/clothing/inventories/',
    //     icon: 'Boxes',
    //     permission: 'pos_clothing.inventory',
    //   },
    //   {
    //     label: 'sidebar.posClothing.stockTransfers',
    //     path: '/pos/clothing/stock-transfers/',
    //     icon: 'ArrowLeftRight',
    //     permission: 'pos_clothing.stock_transfers',
    //   },
    //   {
    //     label: 'sidebar.posClothing.purchaseOrders',
    //     path: '/pos/clothing/purchase-orders/',
    //     icon: 'ScrollText',
    //     permission: 'pos_clothing.purchase_orders',
    //   },
    //   {
    //     label: 'sidebar.posClothing.suppliers',
    //     path: '/pos/clothing/suppliers/',
    //     icon: 'Truck',
    //     permission: 'pos_clothing.suppliers',
    //   },

    //   { kind: 'group', label: 'sidebar.group.sales', icon: 'ShoppingBag' },
    //   {
    //     label: 'sidebar.posClothing.transactions',
    //     path: '/pos/clothing/transactions/',
    //     icon: 'Receipt',
    //     permission: 'pos_clothing.transactions',
    //   },
    //   {
    //     label: 'sidebar.posClothing.returns',
    //     path: '/pos/clothing/returns/',
    //     icon: 'Undo2',
    //     permission: 'pos_clothing.returns',
    //   },
    //   {
    //     label: 'sidebar.posClothing.shifts',
    //     path: '/pos/clothing/shifts/',
    //     icon: 'Clock',
    //     permission: 'pos_clothing.shifts',
    //   },

    //   { kind: 'group', label: 'sidebar.group.customers', icon: 'Users' },
    //   {
    //     label: 'sidebar.posClothing.customers',
    //     path: '/pos/clothing/customers/',
    //     icon: 'Users',
    //     permission: 'pos_clothing.customers',
    //   },
    //   {
    //     label: 'sidebar.posClothing.loyalty',
    //     path: '/pos/clothing/loyalty/',
    //     icon: 'Heart',
    //     permission: 'pos_clothing.loyalty',
    //   },
    //   {
    //     label: 'sidebar.posClothing.giftCards',
    //     path: '/pos/clothing/gift-cards/',
    //     icon: 'Gift',
    //     permission: 'pos_clothing.gift_cards',
    //   },
    //   {
    //     label: 'sidebar.posClothing.storeCredit',
    //     path: '/pos/clothing/store-credit/',
    //     icon: 'Wallet',
    //     permission: 'pos_clothing.store_credit',
    //   },

    //   { kind: 'group', label: 'sidebar.group.services', icon: 'Wrench' },
    //   {
    //     label: 'sidebar.posClothing.alterations',
    //     path: '/pos/clothing/alterations/',
    //     icon: 'Scissors',
    //     permission: 'pos_clothing.alterations',
    //   },
    //   {
    //     label: 'sidebar.posClothing.fitting',
    //     path: '/pos/clothing/fitting/',
    //     icon: 'Ruler',
    //     permission: 'pos_clothing.fitting_holds',
    //   },
    //   {
    //     label: 'sidebar.posClothing.tailors',
    //     path: '/pos/clothing/tailors/',
    //     icon: 'UserCog',
    //     permission: 'pos_clothing.tailors',
    //   },

    //   { kind: 'group', label: 'sidebar.group.setup', icon: 'Settings' },
    //   {
    //     label: 'sidebar.posClothing.branches',
    //     path: '/pos/clothing/branches/',
    //     icon: 'MapPin',
    //     permission: 'pos_clothing.branches',
    //   },
    //   {
    //     label: 'sidebar.posClothing.devices',
    //     path: '/pos/clothing/devices/',
    //     icon: 'Monitor',
    //     permission: 'pos_clothing.devices',
    //   },
    //   {
    //     label: 'sidebar.posClothing.tax',
    //     path: '/pos/clothing/tax/',
    //     icon: 'Percent',
    //     permission: 'pos_clothing.tax',
    //   },
    //   {
    //     label: 'sidebar.posClothing.quickKeys',
    //     path: '/pos/clothing/quick-keys/',
    //     icon: 'Keyboard',
    //     permission: 'pos_clothing.quick_keys',
    //   },
    //   {
    //     label: 'sidebar.posClothing.defectReports',
    //     path: '/pos/clothing/defect-reports/',
    //     icon: 'BadgeAlert',
    //     permission: 'pos_clothing.defect_reports',
    //   },
    //   {
    //     label: 'sidebar.posClothing.alerts',
    //     path: '/pos/clothing/alerts/',
    //     icon: 'Bell',
    //     permission: 'pos_clothing.alerts',
    //   },
    //   {
    //     label: 'sidebar.posClothing.audit',
    //     path: '/pos/clothing/audit/',
    //     icon: 'FileSearch',
    //     permission: 'pos_clothing.audit',
    //   },
    // ],
  }

// Order reflects user mental model:
//   1. People       — Users, Roles
//   2. Workspace    — Branches, Organization
//   3. Plan & money — Subscription, Billing
//   4. Ops          — Settings, Audit logs
//   5. Personal     — Notifications, My account
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
  // ── Workspace ──────────────────────────────────────────────────────────
  // {
  //   label: 'sidebar.platform.branches',
  //   path: ROUTES.BRANCHES,
  //   icon: 'MapPin',
  //   permission: 'platform.branches.read',
  // },
  // ── Plan & money ───────────────────────────────────────────────────────
  // {
  //   label: 'sidebar.platform.subscription',
  //   path: ROUTES.SUBSCRIPTION,
  //   icon: 'CreditCard',
  //   permission: 'platform.subscription.read',
  // },
  // {
  //   label: 'sidebar.platform.billing',
  //   path: ROUTES.BILLING,
  //   icon: 'Receipt',
  //   permission: 'platform.billing.read',
  // },
  // ── Ops ────────────────────────────────────────────────────────────────
  // {
  //   label: 'sidebar.platform.settings',
  //   path: ROUTES.SETTINGS,
  //   icon: 'Settings',
  //   permission: 'platform.settings.manage',
  // },
  // {
  //   label: 'sidebar.platform.auditLogs',
  //   path: ROUTES.AUDIT_LOGS,
  //   icon: 'FileText',
  //   permission: 'platform.audit.read',
  // },
  // ── Personal (no permission gate — every member sees these) ────────────
  // {
  //   label: 'sidebar.platform.notifications',
  //   path: ROUTES.NOTIFICATIONS,
  //   icon: 'Bell',
  // },
  // {
  //   label: 'sidebar.platform.profile',
  //   path: ROUTES.ME,
  //   icon: 'CircleUserRound',
  // },
]

export const moduleNavOrder: Partial<Record<ModuleCode, number>> = {
  pos_food_service: 1,
  // pos_shop: 2,
  // pos_clothing: 4,
}

/**
 * i18n key for each module's sidebar label, by module code.
 * Falls back to the module's own `label` from MODULES when missing.
 */
export const moduleLabelKeys: Partial<Record<ModuleCode, string>> = {
  // pos_shop: 'sidebar.module.posShop',
  pos_food_service: 'sidebar.module.posFoodService',
  // pos_clothing: 'sidebar.module.posClothing',
  // ecommerce: 'sidebar.module.ecommerce',
  // inventory: 'sidebar.module.inventory',
  // ads_manager: 'sidebar.module.adsManager',
  // chat_manager: 'sidebar.module.chatManager',
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
