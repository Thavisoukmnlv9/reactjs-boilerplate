import type React from 'react'

import { cn } from '@/core/utils/cn'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent } from '@/shared/components/ui/card'

/**
 * `<FormSectionCard>` — the shared section-header treatment for wizard/form
 * cards: accent-tinted icon tile · uppercase eyebrow · title · description ·
 * optional badge · right-aligned `headerControl` slot. Generalized from the
 * product form's `ProductSectionCard` so every module's wizard steps share one
 * card style.
 */
export type FormSectionAccent = 'brand' | 'amber' | 'violet' | 'emerald' | 'sky'

const ACCENT_TILE: Record<FormSectionAccent, string> = {
  brand: 'bg-primary/10 text-primary',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  sky: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
}

export type FormSectionCardProps = {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  icon: React.ReactNode
  accent?: FormSectionAccent
  /** Renders a muted "Optional"-style chip next to the title. */
  badge?: React.ReactNode
  /** Right-aligned slot in the header — e.g. a segmented control. */
  headerControl?: React.ReactNode
  /** Tighter padding + smaller icon tile for sidebars. */
  compact?: boolean
  className?: string
  bodyClassName?: string
  children: React.ReactNode
}

export function FormSectionCard({
  eyebrow,
  title,
  description,
  icon,
  accent = 'brand',
  badge,
  headerControl,
  compact,
  className,
  bodyClassName,
  children,
}: FormSectionCardProps) {
  return (
    <Card className={cn('gap-0 py-0 border-border/80 shadow-sm', className)}>
      <div
        className={cn(
          'flex flex-wrap items-start justify-between gap-x-4 gap-y-3',
          compact ? 'px-4 pt-4 pb-3' : 'px-6 pt-6 pb-4'
        )}
      >
        <div className="flex min-w-0 items-start gap-3">
          <span
            className={cn(
              'flex shrink-0 items-center justify-center rounded-xl',
              compact ? 'size-8 [&_svg]:size-4' : 'size-10 [&_svg]:size-5',
              ACCENT_TILE[accent]
            )}
            aria-hidden
          >
            {icon}
          </span>
          <div className="min-w-0 space-y-0.5">
            {eyebrow ? <p className="text-eyebrow">{eyebrow}</p> : null}
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={cn(
                  'font-semibold leading-tight tracking-tight text-foreground',
                  compact ? 'text-sm' : 'text-base'
                )}
              >
                {title}
              </h3>
              {badge ? (
                <Badge variant="muted" size="sm" className="font-normal">
                  {badge}
                </Badge>
              ) : null}
            </div>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {headerControl ? <div className="shrink-0">{headerControl}</div> : null}
      </div>
      <CardContent
        className={cn(
          compact ? 'space-y-4 px-4 pb-4' : 'space-y-5 px-6 pb-6',
          bodyClassName
        )}
      >
        {children}
      </CardContent>
    </Card>
  )
}
