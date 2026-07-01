export const MODULES = [
  {
    code: 'pos_clothing',
    label: 'POS Clothing',
    icon: 'Shirt',
    path: '/pos/clothing',
  },
  {
    code: 'pos_shop',
    label: 'POS Shop',
    icon: 'ShoppingCart',
    path: '/pos/shop',
  },
  {
    code: 'pos_food_service',
    label: 'POS Food Service',
    icon: 'Coffee',
    path: '/pos/food-service',
  },
  { code: 'ecommerce', label: 'Ecommerce', icon: 'Globe', path: '/ecommerce' },
  {
    code: 'inventory',
    label: 'Inventory',
    icon: 'Package',
    path: '/inventory',
  },
  {
    code: 'ads_manager',
    label: 'Ads Manager',
    icon: 'Megaphone',
    path: '/ads',
  },
  {
    code: 'chat_manager',
    label: 'Chat Manager',
    icon: 'MessageCircle',
    path: '/chat',
  },
] as const

export type ModuleCode = (typeof MODULES)[number]['code']

/**
 * Modules whose backend + UI are wired end-to-end and safe to expose to users.
 * Anything not listed here is hidden from the sidebar and short-circuits at the
 * route guard with a redirect to the dashboard. Add a code here when its
 * vertical is shipped.
 */
export const ENABLED_MODULE_CODES: ReadonlyArray<ModuleCode> = [
  'pos_food_service',
  // 'pos_shop',
  // 'pos_clothing',
]

export function isModuleEnabled(code: ModuleCode): boolean {
  return ENABLED_MODULE_CODES.includes(code)
}

export function findDisabledModuleByPath(
  pathname: string
): (typeof MODULES)[number] | undefined {
  return MODULES.find(
    (m) =>
      !ENABLED_MODULE_CODES.includes(m.code) &&
      (pathname === m.path || pathname.startsWith(`${m.path}/`))
  )
}
