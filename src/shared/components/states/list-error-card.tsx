import { AlertTriangle, RefreshCw } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'

interface ListErrorCardProps {
  /** Headline, e.g. "Couldn't load customers". */
  title: ReactNode
  /** Secondary line; defaults to a generic connectivity message. */
  description?: ReactNode
  /** Retry handler — renders the retry button when provided. */
  onRetry?: () => void
  retryLabel?: string
}

/**
 * Compact inline error banner for list/table screens — a tinted card with a
 * danger icon, a headline + hint, and a retry affordance on the right.
 *
 * Distinct from the centered `ErrorState` (used for full-area failures): this
 * sits inline above a table so filters/stats stay visible. Consolidates the
 * per-list hand-rolled banners into one consistent treatment.
 */
export function ListErrorCard({
  title,
  description = 'There was a problem connecting to the server.',
  onRetry,
  retryLabel = 'Retry',
}: ListErrorCardProps) {
  return (
    <Card className="border-destructive/40 bg-destructive/5">
      <CardContent className="flex items-center gap-3 py-4">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive"
          aria-hidden
        >
          <AlertTriangle className="size-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-destructive text-sm">{title}</p>
          {description ? (
            <p className="text-muted-foreground text-xs">{description}</p>
          ) : null}
        </div>
        {onRetry ? (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" aria-hidden />
            {retryLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  )
}
