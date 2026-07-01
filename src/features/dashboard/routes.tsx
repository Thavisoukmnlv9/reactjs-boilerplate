import type { RouteObject } from 'react-router-dom'

export const dashboardRoutes: RouteObject[] = [
  {
    index: true,
    lazy: () => import('./pages/dashboard-page').then((m) => ({ Component: m.DashboardPage })),
  },
]
