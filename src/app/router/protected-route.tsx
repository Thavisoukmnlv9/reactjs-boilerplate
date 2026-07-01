import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { appConfig } from '@/config/app-config'
import { hasSession } from '@/lib/auth'

/** Gate for authenticated routes. Redirects to /login preserving returnTo. */
export function ProtectedRoute() {
  const location = useLocation()

  if (!hasSession()) {
    const returnTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`${appConfig.auth.loginPath}?returnTo=${returnTo}`} replace />
  }

  return <Outlet />
}
