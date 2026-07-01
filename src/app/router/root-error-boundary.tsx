import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function RootErrorBoundary() {
  const error = useRouteError()

  let title = 'Unexpected error'
  let message = 'Something went wrong. Please try again.'

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    const data = error.data as { message?: string } | undefined
    message = data?.message ?? message
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
      <Button onClick={() => window.location.assign('/')}>Go home</Button>
    </div>
  )
}
