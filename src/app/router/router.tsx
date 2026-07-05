import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  redirect,
  retainSearchParams,
} from '@tanstack/react-router'
import { z } from 'zod'

import { syncLanguage } from '@/app/i18n/language-sync'
import { AuthLayout } from '@/app/layouts/auth-layout'
import { AppLayout } from '@/app/router/app-layout'
import { appFeatureRoutes } from '@/app/router/feature-routes'
import { NotFound } from '@/app/router/not-found'
import { RootComponent } from '@/app/router/root-component'
import { RootErrorComponent } from '@/app/router/root-error-boundary'
import { LANGUAGE_CODES } from '@/config/languages'
import { meQueryOptions, tokenStorage } from '@/core/access'
import { PERMISSIONS } from '@/core/constants/permissions'
import { AcceptInvitePage } from '@/features/auth/pages/accept-invite-page'
import { ForgotPasswordPage } from '@/features/auth/pages/forgot-password-page'
import { LoginPage } from '@/features/auth/pages/login-page'
import { RegisterPage } from '@/features/auth/pages/register-page'
import { ResetPasswordPage } from '@/features/auth/pages/reset-password-page'
import { BranchCreatePage } from '@/features/branches/pages/branch-create-page'
import { BranchEditPage } from '@/features/branches/pages/branch-edit-page'
import { BranchesPage } from '@/features/branches/pages/branches-page'
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page'
import { CreateOrganizationPage } from '@/features/onboarding/pages/create-organization-page'
import { PoliciesPage } from '@/features/policies/pages/policies-page'
import { PolicyCreatePage } from '@/features/policies/pages/policy-create-page'
import { PolicyEditPage } from '@/features/policies/pages/policy-edit-page'
import { RoleCreatePage } from '@/features/roles/pages/role-create-page'
import { RoleDetailPage } from '@/features/roles/pages/role-detail-page'
import { RoleEditPage } from '@/features/roles/pages/role-edit-page'
import { RolesPage } from '@/features/roles/pages/roles-page'
import { UserCreatePage } from '@/features/users/pages/user-create-page'
import { UserDetailPage } from '@/features/users/pages/user-detail-page'
import { UsersPage } from '@/features/users/pages/users-page'
import { tableSearchBase } from '@/shared/table/table-url-state'

export interface RouterContext {
  queryClient: QueryClient
}

const internalPath = z
  .string()
  .refine((v) => v.startsWith('/') && !v.startsWith('//'), 'must be an internal path')

// The active language is carried in the URL as `?lang=`. `retainSearchParams`
// makes every Link/navigate/redirect preserve it without call-site changes, and
// the root `beforeLoad` applies it to i18next before any route renders — so deep
// links and back/forward land in the right language on first paint. An invalid
// value is neutralized by `.catch(undefined)` (falls back to the detector).
const rootSearchSchema = z.object({
  lang: z.enum(LANGUAGE_CODES).optional().catch(undefined),
})

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  validateSearch: rootSearchSchema,
  search: { middlewares: [retainSearchParams(['lang'])] },
  beforeLoad: ({ search }) => {
    syncLanguage(search.lang)
  },
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: tokenStorage.getAccessToken() ? '/dashboard' : '/login' })
  },
})

// ── Guest (redirect away if already authed) ─────────────────────────────────
const guestRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'guest',
  beforeLoad: () => {
    if (tokenStorage.getAccessToken()) throw redirect({ to: '/dashboard' })
  },
  component: () => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
})
const loginRoute = createRoute({
  getParentRoute: () => guestRoute,
  path: '/login',
  validateSearch: z.object({ returnTo: internalPath.optional() }),
  component: LoginPage,
})
const registerRoute = createRoute({ getParentRoute: () => guestRoute, path: '/register', component: RegisterPage })
const forgotRoute = createRoute({ getParentRoute: () => guestRoute, path: '/forgot-password', component: ForgotPasswordPage })
const resetRoute = createRoute({
  getParentRoute: () => guestRoute,
  path: '/reset-password',
  validateSearch: z.object({ token: z.string().optional() }),
  component: ResetPasswordPage,
})
const acceptInviteRoute = createRoute({
  getParentRoute: () => guestRoute,
  path: '/accept-invite',
  validateSearch: z.object({ token: z.string().optional() }),
  component: AcceptInvitePage,
})

// ── Onboarding (token required, org NOT required) ───────────────────────────
const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'onboarding',
  beforeLoad: async ({ context }) => {
    if (!tokenStorage.getAccessToken()) throw redirect({ to: '/login' })
    const me = await context.queryClient.ensureQueryData(meQueryOptions())
    if (me.organization) throw redirect({ to: '/dashboard' })
  },
  component: () => (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  ),
})
const createOrgRoute = createRoute({
  getParentRoute: () => onboardingRoute,
  path: '/onboarding/create-organization',
  component: CreateOrganizationPage,
})

// ── App (authenticated + in-org). beforeLoad is the race-free auth chokepoint ─
export const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  beforeLoad: async ({ context, location }) => {
    if (!tokenStorage.getAccessToken()) throw redirect({ to: '/login', search: { returnTo: location.href } })
    const me = await context.queryClient.ensureQueryData(meQueryOptions())
    if (!me.organization) throw redirect({ to: '/onboarding/create-organization' })
    return { me }
  },
  component: AppLayout,
})
const dashboardRoute = createRoute({ getParentRoute: () => appRoute, path: '/dashboard', component: DashboardPage })

// ── Roles ───────────────────────────────────────────────────────────────────
const rolesRoute = createRoute({ getParentRoute: () => appRoute, path: '/roles', staticData: { permission: PERMISSIONS.ROLES_READ }, validateSearch: z.object(tableSearchBase), component: RolesPage })
const roleNewRoute = createRoute({ getParentRoute: () => appRoute, path: '/roles/new', staticData: { permission: PERMISSIONS.ROLES_MANAGE }, component: RoleCreatePage })
const roleDetailRoute = createRoute({ getParentRoute: () => appRoute, path: '/roles/$roleId', staticData: { permission: PERMISSIONS.ROLES_READ }, component: RoleDetailPage })
const roleEditRoute = createRoute({ getParentRoute: () => appRoute, path: '/roles/$roleId/edit', staticData: { permission: PERMISSIONS.ROLES_MANAGE }, component: RoleEditPage })

// ── Branches ────────────────────────────────────────────────────────────────
const branchesSearchSchema = z.object({
  ...tableSearchBase,
  status: z.enum(['active', 'archived']).optional(),
  vertical: z.string().optional(),
})
const branchesRoute = createRoute({ getParentRoute: () => appRoute, path: '/branches', staticData: { permission: PERMISSIONS.BRANCHES_READ }, validateSearch: branchesSearchSchema, component: BranchesPage })
const branchNewRoute = createRoute({ getParentRoute: () => appRoute, path: '/branches/new', staticData: { permission: PERMISSIONS.BRANCHES_MANAGE }, component: BranchCreatePage })
const branchEditRoute = createRoute({ getParentRoute: () => appRoute, path: '/branches/$branchId/edit', staticData: { permission: PERMISSIONS.BRANCHES_MANAGE }, component: BranchEditPage })

// ── Policies ────────────────────────────────────────────────────────────────
const policiesSearchSchema = z.object({
  ...tableSearchBase,
  subject: z.string().optional(),
  action: z.string().optional(),
})
const policiesRoute = createRoute({ getParentRoute: () => appRoute, path: '/policies', staticData: { permission: PERMISSIONS.POLICIES_READ }, validateSearch: policiesSearchSchema, component: PoliciesPage })
const policyNewRoute = createRoute({ getParentRoute: () => appRoute, path: '/policies/new', staticData: { permission: PERMISSIONS.POLICIES_MANAGE }, component: PolicyCreatePage })
const policyEditRoute = createRoute({ getParentRoute: () => appRoute, path: '/policies/$policyId/edit', staticData: { permission: PERMISSIONS.POLICIES_MANAGE }, component: PolicyEditPage })

// ── Users ───────────────────────────────────────────────────────────────────
const usersSearchSchema = z.object({
  ...tableSearchBase,
  status: z.string().optional(),
  role_id: z.string().optional(),
})
const usersRoute = createRoute({ getParentRoute: () => appRoute, path: '/users', staticData: { permission: PERMISSIONS.USERS_READ }, validateSearch: usersSearchSchema, component: UsersPage })
// Legacy routes now open the in-context create/edit Sheet on the list page.
const userNewRoute = createRoute({ getParentRoute: () => appRoute, path: '/users/new', staticData: { permission: PERMISSIONS.USERS_INVITE }, component: UserCreatePage })
const userDetailRoute = createRoute({ getParentRoute: () => appRoute, path: '/users/$memberId', staticData: { permission: PERMISSIONS.USERS_READ }, component: UserDetailPage })

const routeTree = rootRoute.addChildren([
  indexRoute,
  guestRoute.addChildren([loginRoute, registerRoute, forgotRoute, resetRoute, acceptInviteRoute]),
  onboardingRoute.addChildren([createOrgRoute]),
  appRoute.addChildren([
    dashboardRoute,
    rolesRoute,
    roleNewRoute,
    roleDetailRoute,
    roleEditRoute,
    branchesRoute,
    branchNewRoute,
    branchEditRoute,
    policiesRoute,
    policyNewRoute,
    policyEditRoute,
    usersRoute,
    userNewRoute,
    userDetailRoute,
    ...appFeatureRoutes(),
  ]),
])

export const router = createRouter({
  routeTree,
  context: { queryClient: undefined as unknown as QueryClient },
  defaultPreload: 'intent',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  interface StaticDataRouteOption {
    permission?: string
  }
}
