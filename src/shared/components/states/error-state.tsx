import { AlertTriangle } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'

export function ErrorState({
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}: {
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="tx-motion-rise flex flex-col items-center justify-center px-6 py-14 text-center sm:py-16">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
        <AlertTriangle className="size-7" aria-hidden />
      </div>
      <h3 className="font-semibold text-base tracking-tight">
        Something went wrong
      </h3>
      <p className="mt-1.5 max-w-sm text-pretty text-muted-foreground text-sm leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
