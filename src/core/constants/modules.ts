export const MODULES = [
  {
    code: 'example',
    label: 'Example',
    icon: 'LayoutGrid',
    path: '/example',
  },
] as const

export type ModuleCode = (typeof MODULES)[number]['code']

/**
 * Modules whose backend + UI are wired end-to-end and safe to expose to users.
 * Anything not listed here is hidden from the sidebar and short-circuits at the
 * route guard with a redirect to the dashboard. Add a code here when its
 * module is shipped.
 */
export const ENABLED_MODULE_CODES: ReadonlyArray<ModuleCode> = ['example']

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
