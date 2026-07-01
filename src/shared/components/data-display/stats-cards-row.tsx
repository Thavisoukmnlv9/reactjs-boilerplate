/**
 * `<StatsCardsRow>` — opinionated KPI strip above list pages.
 *
 * Replaces the bespoke per-feature stat-card grids (ShopProductStatsCards,
 * ShopSupplierStatsCards, ShopCustomerStatsCards, …). Each item renders into the
 * existing `Card` primitive with a consistent header (label + icon) and value layout.
 *
 * Usage:
 *
 *   <StatsCardsRow
 *     isLoading={statsLoading}
 *     items={[
 *       { id: 'total', label: 'Total suppliers', value: stats.total, icon: <Truck /> },
 *       { id: 'active', label: 'Active', value: stats.active, icon: <CheckCircle />, tone: 'success' },
 *       { id: 'inactive', label: 'Inactive', value: stats.inactive, icon: <XCircle /> },
 *       { id: 'pending', label: 'Open POs', value: stats.open_pos, icon: <Clock />, tone: 'warning' },
 *     ]}
 *   />
 *
 * Tones map onto theme color tokens (no hard-coded hex). Pass `tone` ONLY when the
 * value should be visually highlighted — keep neutral for plain counts.
 */

import type React from 'react'
import { cn } from '@/core/utils/cn'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

export type StatTone = 'neutral' | 'success' | 'warning' | 'danger' | 'accent'

export type StatItem = {
  /** Stable key for React; also surfaces as a data attribute for tests. */
  id: string
  /** Card title (top-left). */
  label: React.ReactNode
  /** Big number (or string like "LAK 12,400"). Falsy values render as "—". */
  value: React.ReactNode
  /** Optional icon in the top-right corner. */
  icon?: React.ReactNode
  /** Optional secondary line under the value (e.g. "+12% vs last week"). */
  hint?: React.ReactNode
  /** Optional pre-formatted trend pill (e.g. `<TrendPill value={5.2} />`). */
  trend?: React.ReactNode
  /** Visual emphasis for the value. Defaults to 'neutral'. */
  tone?: StatTone
  /** Optional inline-chart slot rendered under the value (mini bar or line). */
  spark?: React.ReactNode
}

export type StatsCardsRowProps = {
  items: StatItem[]
  isLoading?: boolean
  /** Override the responsive column count. Defaults to `auto` (1 / 2 / 4 by breakpoint). */
  columns?: 'auto' | 2 | 3 | 4 | 5 | 6
  className?: string
}

const TONE_VALUE: Record<StatTone, string> = {
  neutral: 'text-foreground',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-rose-600 dark:text-rose-400',
  accent: 'text-primary',
}

const TONE_ICON: Record<StatTone, string> = {
  neutral: 'text-muted-foreground',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  danger: 'text-rose-600 dark:text-rose-400',
  accent: 'text-primary',
}

const COLUMN_CLASSES: Record<
  NonNullable<StatsCardsRowProps['columns']>,
  string
> = {
  auto: 'sm:grid-cols-2 lg:grid-cols-4',
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
  5: 'sm:grid-cols-2 lg:grid-cols-5',
  6: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6',
}

export function StatsCardsRow({
  items,
  isLoading,
  columns = 'auto',
  className,
}: StatsCardsRowProps) {
  return (
    <div
      className={cn(
        'grid gap-3 grid-cols-1',
        COLUMN_CLASSES[columns],
        className
      )}
    >
      {items.map((item) => (
        <StatCardCell key={item.id} item={item} isLoading={isLoading} />
      ))}
    </div>
  )
}

function StatCardCell({
  item,
  isLoading,
}: {
  item: StatItem
  isLoading?: boolean
}) {
  const tone = item.tone ?? 'neutral'
  const displayValue =
    item.value === null || item.value === undefined || item.value === '' ? (
      <span className="text-muted-foreground/40">—</span>
    ) : (
      item.value
    )

  return (
    <Card className="border-border/80" data-stat-id={item.id}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-muted-foreground text-sm">
          {item.label}
        </CardTitle>
        {item.icon ? (
          <span
            className={cn('shrink-0 [&_svg]:size-4', TONE_ICON[tone])}
            aria-hidden
          >
            {item.icon}
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-1.5">
        {isLoading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="flex items-baseline gap-2">
            <p
              className={cn(
                'font-semibold text-2xl tabular-nums',
                TONE_VALUE[tone]
              )}
            >
              {displayValue}
            </p>
            {item.trend ? <div className="shrink-0">{item.trend}</div> : null}
          </div>
        )}
        {!isLoading && item.spark ? <div>{item.spark}</div> : null}
        {!isLoading && item.hint ? (
          <p className="text-muted-foreground text-xs">{item.hint}</p>
        ) : null}
      </CardContent>
    </Card>
  )
}
