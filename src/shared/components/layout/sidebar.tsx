import { Link, useRouterState } from '@tanstack/react-router'
import {
  Activity,
  Armchair,
  ArrowLeftRight,
  BadgeAlert,
  BadgeCheck,
  BadgePercent,
  BarChart3,
  Barcode,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  CircleUserRound,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Coffee,
  CreditCard,
  FileSearch,
  FileText,
  FolderTree,
  Gauge,
  Gift,
  Globe,
  HandCoins,
  Heart,
  Keyboard,
  LayoutDashboard,
  LayoutGrid,
  LayoutPanelTop,
  LibraryBig,
  MapPin,
  Megaphone,
  MessageCircle,
  Monitor,
  Package,
  Percent,
  Receipt,
  ReceiptText,
  Ruler,
  Scissors,
  ScrollText,
  Settings,
  Shield,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Tag,
  TrendingDown,
  Truck,
  Undo2,
  UserCog,
  Users,
  Utensils,
  Wallet,
  Warehouse,
  Wrench,
} from 'lucide-react'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import {
  isModuleNavLink,
  type ModuleNavChild,
  moduleItems,
  moduleNavChildren,
  moduleNavDefaultOpen,
  platformItems,
  type SidebarItem,
} from '@/app/config/sidebar-config'
import type { ModuleCode } from '@/core/constants/modules'
import { ROUTES } from '@/core/constants/routes'
import { useHasModule } from '@/core/entitlements/entitlement-hooks'
import { useCan, useCanCheck } from '@/core/permissions/permission-hooks'
import { BrandMark } from '@/shared/components/brand/brand-mark'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar,
} from '@/shared/components/ui/sidebar'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Activity,
  Armchair,
  ArrowLeftRight,
  BadgeAlert,
  BadgeCheck,
  BadgePercent,
  Barcode,
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  CalendarCheck,
  CircleUserRound,
  ClipboardList,
  Clock,
  Coffee,
  CreditCard,
  FileSearch,
  FileText,
  FolderTree,
  Gauge,
  Gift,
  Globe,
  HandCoins,
  Heart,
  Keyboard,
  LayoutDashboard,
  LibraryBig,
  MapPin,
  Megaphone,
  MessageCircle,
  Monitor,
  Package,
  Percent,
  Receipt,
  ReceiptText,
  Ruler,
  Scissors,
  ScrollText,
  Settings,
  Shield,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Tag,
  TrendingDown,
  Truck,
  Undo2,
  UserCog,
  Users,
  Utensils,
  Wallet,
  Warehouse,
  Wrench,
  LayoutGrid,
  LayoutPanelTop,
  CalendarDays,
  ClipboardCheck,
}

function normalizePath(p: string) {
  const t = p.replace(/\/$/, '')
  return t === '' ? '/' : t
}

function pathIsActive(pathname: string, itemPath: string) {
  const p = normalizePath(pathname)
  const i = normalizePath(itemPath)
  if (p === i) return true
  if (i !== '/' && p.startsWith(`${i}/`)) return true
  return false
}

function childPathIsActive(
  pathname: string,
  itemPath: string,
  matchExact?: boolean
) {
  if (matchExact) {
    return normalizePath(pathname) === normalizePath(itemPath)
  }
  return pathIsActive(pathname, itemPath)
}

/**
 * Given a module's nav children and a permission checker, drop links the user
 * can't access, then drop any group header left with no visible link beneath
 * it. Pure with respect to `canSee`: same items + same checker → same result.
 */
function collectVisibleChildren(
  subItems: ModuleNavChild[],
  canSee: (permission: string | undefined) => boolean
): ModuleNavChild[] {
  const out: ModuleNavChild[] = []
  for (let i = 0; i < subItems.length; i++) {
    const child = subItems[i]
    if (isModuleNavLink(child)) {
      if (canSee(child.permission)) out.push(child)
      continue
    }
    let hasVisibleLink = false
    for (
      let j = i + 1;
      j < subItems.length && isModuleNavLink(subItems[j]);
      j++
    ) {
      if (canSee((subItems[j] as { permission?: string }).permission)) {
        hasVisibleLink = true
        break
      }
    }
    if (hasVisibleLink) out.push(child)
  }
  return out
}

function NavItem({
  label,
  path,
  icon,
  permission,
  moduleCode,
  pathname,
  children,
  defaultOpen,
}: {
  label: string
  path: string
  icon: string
  permission?: string
  moduleCode?: string
  pathname: string
  children?: SidebarItem[]
  defaultOpen?: boolean
}) {
  const { t } = useTranslation()
  const hasPermission = useCan(permission)
  const hasModule = useHasModule(moduleCode)
  const Icon = iconMap[icon] ?? LayoutDashboard
  const childActive =
    children?.some((c) => pathIsActive(pathname, c.path)) ?? false
  const [open, setOpen] = React.useState(
    () => defaultOpen ?? childActive ?? false
  )

  React.useEffect(() => {
    if (childActive) setOpen(true)
  }, [childActive])

  if (!hasPermission || !hasModule) return null
  const isActive = pathIsActive(pathname, path)
  const translatedLabel = t(label, { defaultValue: label })

  if (!children?.length) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={isActive}
          tooltip={translatedLabel}
        >
          <Link to={path}>
            <Icon />
            <span>{translatedLabel}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            isActive={isActive || childActive}
            tooltip={translatedLabel}
          >
            <Icon />
            <span>{translatedLabel}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {children.map((child) => (
              <SidebarMenuSubItem key={child.path}>
                <SidebarMenuSubButton
                  asChild
                  isActive={pathIsActive(pathname, child.path)}
                >
                  <Link to={child.path}>
                    <span>{t(child.label, { defaultValue: child.label })}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function ModuleNavItem({
  label,
  path,
  icon,
  moduleCode,
  pathname,
  subItems,
}: {
  label: string
  path: string
  icon: string
  moduleCode: ModuleCode
  pathname: string
  subItems: ModuleNavChild[]
}) {
  const { t } = useTranslation()
  const hasModule = useHasModule(moduleCode)
  const canSee = useCanCheck()
  const Icon = iconMap[icon] ?? LayoutDashboard
  const basePath = normalizePath(path)

  const visibleChildren = React.useMemo(
    () => collectVisibleChildren(subItems, canSee),
    [subItems, canSee]
  )

  const childMatches = React.useCallback(
    () =>
      visibleChildren
        .filter(isModuleNavLink)
        .some((c) => childPathIsActive(pathname, c.path, c.matchExact)),
    [pathname, visibleChildren]
  )
  const [open, setOpen] = React.useState(
    () =>
      moduleNavDefaultOpen[moduleCode] === true ||
      pathname.startsWith(`${basePath}/`) ||
      normalizePath(pathname) === basePath ||
      childMatches()
  )

  React.useEffect(() => {
    if (
      pathname.startsWith(`${basePath}/`) ||
      normalizePath(pathname) === basePath ||
      childMatches()
    ) {
      setOpen(true)
    }
  }, [pathname, basePath, childMatches])

  if (!hasModule) return null
  // Module entitled but the user can't access any of its pages — hide it.
  if (!visibleChildren.some(isModuleNavLink)) return null

  const parentActive = pathIsActive(pathname, path) || childMatches()
  const translatedLabel = t(label, { defaultValue: label })

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton isActive={parentActive} tooltip={translatedLabel}>
            <Icon />
            <span>{translatedLabel}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[collapsible=icon]:hidden group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {visibleChildren.map((child, index) => {
              if (!isModuleNavLink(child)) {
                const GroupIcon = child.icon ? iconMap[child.icon] : undefined
                return (
                  <li
                    key={`group:${child.label}:${index}`}
                    className="flex items-center gap-1.5 px-2 pt-3 pb-1 text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/60 first:pt-1"
                  >
                    {GroupIcon ? (
                      <GroupIcon className="size-3 shrink-0" />
                    ) : null}
                    <span>{t(child.label, { defaultValue: child.label })}</span>
                  </li>
                )
              }
              const ChildIcon = child.icon ? iconMap[child.icon] : undefined
              return (
                <SidebarMenuSubItem key={child.path}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={childPathIsActive(
                      pathname,
                      child.path,
                      child.matchExact
                    )}
                  >
                    <Link to={child.path}>
                      {ChildIcon ? (
                        <ChildIcon className="size-4 shrink-0" />
                      ) : null}
                      <span>
                        {t(child.label, { defaultValue: child.label })}
                      </span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const platformNavItems = platformItems.filter(
  (item) => item.path !== ROUTES.DASHBOARD
)

export function AppSidebar() {
  const { t } = useTranslation()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { state } = useSidebar()
  const collapsed = state === 'collapsed'
  const dashboardActive = pathIsActive(pathname, ROUTES.DASHBOARD)

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size={collapsed ? 'default' : 'lg'}
              asChild
              isActive={dashboardActive}
              tooltip={collapsed ? 'Boilerplate · Dashboard' : undefined}
            >
              <Link to={ROUTES.DASHBOARD}>
                <BrandMark className="size-5" />
                {!collapsed && (
                  <span className="truncate font-semibold">Boilerplate</span>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pt-1 group-data-[collapsible=icon]:pt-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {platformNavItems.map((item) => (
                <NavItem key={item.path} pathname={pathname} {...item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {moduleItems.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>{t('sidebar.modules')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {moduleItems.map((item) => {
                  const code = item.moduleCode as ModuleCode | undefined
                  const children = code ? moduleNavChildren[code] : undefined
                  if (children?.length && code) {
                    return (
                      <ModuleNavItem
                        key={item.path}
                        label={item.label}
                        path={item.path}
                        icon={item.icon}
                        moduleCode={code}
                        pathname={pathname}
                        subItems={children}
                      />
                    )
                  }
                  return (
                    <NavItem key={item.path} pathname={pathname} {...item} />
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
