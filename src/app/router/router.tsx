import { createBrowserRouter } from 'react-router-dom'

import { AuthLayout } from '@/app/layouts/auth-layout'
import { DashboardLayout } from '@/app/layouts/dashboard-layout'
import { RootLayout } from '@/app/layouts/root-layout'
import { authRoutes } from '@/features/auth'
import { dashboardRoutes } from '@/features/dashboard'
import { usersRoutes } from '@/features/users'

import { NotFound } from './not-found'
import { ProtectedRoute } from './protected-route'
import { RootErrorBoundary } from './root-error-boundary'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RootErrorBoundary />,
    children: [
      // Public routes (redirect authed users away inside the pages if desired).
      { element: <AuthLayout />, children: authRoutes },
      // Authenticated app shell.
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [...dashboardRoutes, ...usersRoutes],
          },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
