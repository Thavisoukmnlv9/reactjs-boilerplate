import { RouterProvider } from 'react-router-dom'

import { AppProviders } from '@/app/providers/app-providers'
import { router } from '@/app/router/router'
import { ErrorBoundary } from '@/components/common/error-boundary'

export function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  )
}
