import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { LoadingState } from '@/components/common/loading-state'

export function RootLayout() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center">
          <LoadingState />
        </div>
      }
    >
      <Outlet />
    </Suspense>
  )
}
