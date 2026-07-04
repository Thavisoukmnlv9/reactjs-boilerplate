import type { RouteObject } from 'react-router-dom'

/** Lazy-loaded so the login bundle isn't shipped with the authed app. */
export const authRoutes: RouteObject[] = [
  {
    path: 'login',
    lazy: () => import('./pages/login-page').then((m) => ({ Component: m.LoginPage })),
  },
]



