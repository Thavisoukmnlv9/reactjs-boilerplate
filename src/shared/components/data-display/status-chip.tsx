import type { ComponentProps } from 'react'
import { cn } from '@/core/utils/cn'
import { Badge } from '@/shared/components/ui/badge'

type Variant = ComponentProps<typeof Badge>['variant']

/**
 * Map of well-known status enum values to badge variants. Falls back to
 * `outline` when the status is unrecognised. Keep this list as the single
 * source of truth across the admin portal so list/detail/report pages stay
 * consistent (replaces ad-hoc `STATUS_TONE` maps).
 */
const statusVariantMap: Record<string, Variant> = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  ARCHIVED: 'secondary',
  PENDING: 'warning',
  PAID: 'success',
  OVERDUE: 'destructive',
  CANCELLED: 'secondary',
  OPEN: 'default',
  DRAFT: 'outline',
  COMPLETED: 'success',
  DELIVERED: 'success',
  SHIPPED: 'default',
  RECEIVED: 'success',
  APPROVED: 'success',
  REJECTED: 'destructive',
  REFUNDED: 'warning',
  VOID: 'destructive',
  VOIDED: 'destructive',
  CLOSED: 'secondary',
  ON_HOLD: 'warning',
  FAILED: 'destructive',
}

export function StatusChip({
  status,
  className,
}: {
  status: string | null | undefined
  className?: string
}) {
  const key = (status ?? '').toUpperCase()
  const variant = statusVariantMap[key] ?? 'outline'
  return (
    <Badge variant={variant} className={cn('capitalize', className)}>
      {status ?? '—'}
    </Badge>
  )
}
