import type React from 'react'
import { cn } from '@/core/utils/cn'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'

export type TableSummaryStat = {
  label: React.ReactNode
  value: React.ReactNode
  /** Optional secondary line (e.g. "+12% week-over-week"). */
  delta?: React.ReactNode
  icon?: React.ReactNode
  /** Light tone hint for the icon background. */
  tone?: 'default' | 'positive' | 'warning' | 'destructive'
}

type Props = {
  stats: TableSummaryStat[]
  isLoading?: boolean
  className?: string
}

const TONE_BG: Record<NonNullable<TableSummaryStat['tone']>, string> = {
  default: 'bg-muted text-muted-foreground',
  positive:
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  warning:
    'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  destructive: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
}

export function TableSummaryRow({ stats, isLoading, className }: Props) {
  if (stats.length === 0) return null
  return (
    <div
      className={cn(
        'mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4',
        className
      )}
    >
      {stats.map((s, i) => (
        <Card
          // biome-ignore lint/suspicious/noArrayIndexKey: stats are stable per render
          key={i}
          className="border"
        >
          <CardContent className="flex items-center gap-3 p-4">
            {s.icon ? (
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-md [&_svg]:size-4',
                  TONE_BG[s.tone ?? 'default']
                )}
              >
                {s.icon}
              </div>
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="truncate text-muted-foreground text-xs">
                {s.label}
              </p>
              {isLoading ? (
                <Skeleton className="mt-1 h-6 w-16" />
              ) : (
                <p className="truncate font-semibold text-xl">{s.value}</p>
              )}
              {s.delta ? (
                <p className="truncate text-muted-foreground text-xs">
                  {s.delta}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
