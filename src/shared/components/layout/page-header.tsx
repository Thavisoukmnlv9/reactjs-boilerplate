import type { ReactNode } from 'react'

import { cn } from '@/core/utils/cn'

interface PageHeaderProps {
  title: string
  description?: string
  /** Optional uppercase overline above the title (e.g. a module / section name). */
  eyebrow?: string
  /** Optional glyph rendered in a brand-tinted icon tile beside the title. */
  icon?: ReactNode
  actions?: ReactNode
  className?: string
}

/**
 * Standard list / index page header: an optional icon tile + eyebrow, a
 * balanced title, a muted description, and a right-aligned actions cluster.
 * `icon` and `eyebrow` are additive — existing call sites render unchanged.
 */
export function PageHeader({
  title,
  description,
  eyebrow,
  icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4',
        className
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon && (
          <span className="icon-tile mt-0.5 size-10 [&>svg]:size-5" aria-hidden>
            {icon}
          </span>
        )}
        <div className="min-w-0 space-y-1">
          {eyebrow && <p className="text-eyebrow">{eyebrow}</p>}
          <h1 className="text-balance font-semibold text-2xl/tight tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="max-w-prose text-pretty text-muted-foreground text-sm">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
}
