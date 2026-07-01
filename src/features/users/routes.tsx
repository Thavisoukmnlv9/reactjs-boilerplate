import type { RouteObject } from 'react-router-dom'

export const usersRoutes: RouteObject[] = [
  {
    path: 'users',
    lazy: () => import('./pages/users-page').then((m) => ({ Component: m.UsersPage })),
  },
  {
    path: 'users/:id',
    lazy: () => import('./pages/user-detail-page').then((m) => ({ Component: m.UserDetailPage })),
  },
]
