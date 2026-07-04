import type { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  Outlet,
  redirect,
} from '@tanstack/react-router'
import { z } from 'zod'

import { meQueryOptions, tokenStorage } from '@/core/access'
import { AuthLayout } from '@/app/layouts/auth-layout'
import { AppLayout } from '@/app/router/app-layout'
import { NotFound } from '@/app/router/not-found'
import { RootErrorComponent } from '@/app/router/root-error-boundary'
import { appFeatureRoutes } from '@/app/router/feature-routes'

import { LoginPage } from '@/features/auth/pages/login-page'
import { RegisterPage } from '@/features/auth/pages/register-page'
import { ForgotPasswordPage } from '@/features/auth/pages/forgot-password-page'
import { ResetPasswordPage } from '@/features/auth/pages/reset-password-page'
import { AcceptInvitePage } from '@/features/auth/pages/accept-invite-page'
import { CreateOrganizationPage } from '@/features/onboarding/pages/create-organization-page'
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page'

export interface RouterContext {
  queryClient: QueryClient
}

const internalPath = z
  .string()
  .refine((v) => v.startsWith('/') && !v.startsWith('//'), 'must be an internal path')

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />,
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  guestRoute.addChildren([loginRoute, registerRoute, forgotRoute, resetRoute, acceptInviteRoute]),
  onboardingRoute.addChildren([createOrgRoute]),
  appRoute.addChildren([dashboardRoute, ...appFeatureRoutes()]),
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
