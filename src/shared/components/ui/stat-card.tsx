import type * as React from 'react'

import { cn } from '@/core/utils/cn'
import { Card } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

/**
 * Modern KPI / stat tile used across the admin dashboards.
 *
 * One consistent treatment: muted label, an icon in a soft tinted chip, and a
 * number-forward value (large, tracking-tight, tabular figures). `accent` tints
 * the icon chip + value with a semantic colour. Replaces the per-resource
 * hand-rolled stat cards so the look stays identical everywhere.
 */
export type StatAccent =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'

const ACCENT_CHIP: Record<StatAccent, string> = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-success/12 text-success',
  warning: 'bg-warning/15 text-warning-foreground dark:text-warning',
  danger: 'bg-destructive/10 text-destructive',
  info: 'bg-sky-500/12 text-sky-600 dark:text-sky-400',
}

const ACCENT_VALUE: Record<StatAccent, string> = {
  default: 'text-foreground',
  primary: 'text-foreground',
  success: 'text-success',
  warning: 'text-foreground',
  danger: 'text-destructive',
  info: 'text-foreground',
}

export type StatCardProps = {
  label: string
  value: React.ReactNode
  icon?: React.ReactNode
  accent?: StatAccent
  /** Optional secondary line under the value (delta, unit, hint). */
  hint?: React.ReactNode
  isLoading?: boolean
  className?: string
}

export function StatCard({
  label,
  value,
  icon,
  accent = 'default',
  hint,
  isLoading,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('gap-0 py-0', className)}>
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0 space-y-2">
          <p className="truncate font-medium text-muted-foreground text-sm">
            {label}
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-16" />
          ) : (
            <p
              className={cn(
                'tnum font-semibold text-3xl/none tracking-tight',
                ACCENT_VALUE[accent]
              )}
            >
              {value}
            </p>
          )}
          {hint != null && !isLoading ? (
            <p className="truncate text-muted-foreground text-xs">{hint}</p>
          ) : null}
        </div>
        {icon ? (
          <span
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-lg [&>svg]:size-[18px]',
              ACCENT_CHIP[accent]
            )}
            aria-hidden
          >
            {icon}
          </span>
        ) : null}
      </div>
    </Card>
  )
}

/** Responsive grid wrapper for a row of StatCards. */
export function StatCardGrid({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-4', className)}
      {...props}
    />
  )
}
