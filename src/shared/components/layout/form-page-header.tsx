import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/core/utils/cn'

export type FormPageCrumb = { label: ReactNode; to?: string }

interface FormPageHeaderProps {
  /** Breadcrumb trail; the last entry renders as plain text. */
  crumbs?: FormPageCrumb[]
  /** Leading icon, shown in a soft brand-tinted chip. */
  icon?: ReactNode
  title: string
  description?: string
  /** Trailing actions (e.g. a "back to list" button). */
  actions?: ReactNode
  className?: string
}

/**
 * Shared header for create / edit / sub-action form pages.
 *
 * One consistent treatment — breadcrumb trail, a brand-tinted icon chip, a
 * number-forward title with a muted description, and a trailing action slot.
 * Replaces the per-page hand-rolled header blocks so every form screen reads
 * as the same product. Pair with `max-w-*` content wrappers on the page.
 */
export function FormPageHeader({
  crumbs,
  icon,
  title,
  description,
  actions,
  className,
}: FormPageHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {crumbs && crumbs.length > 0 ? (
        <nav
          aria-label="Breadcrumb"
          className="flex min-w-0 items-center gap-1.5 text-muted-foreground text-sm"
        >
          {crumbs.map((c, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: breadcrumbs are stable per render
              key={i}
              className="flex min-w-0 items-center gap-1.5"
            >
              {i > 0 ? (
                <ChevronRight className="size-3.5 shrink-0" aria-hidden />
              ) : null}
              {c.to && i < crumbs.length - 1 ? (
                <Link
                  to={c.to}
                  className="truncate transition-colors hover:text-foreground"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="truncate font-medium text-foreground">
                  {c.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {icon ? (
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary [&>svg]:size-5"
              aria-hidden
            >
              {icon}
            </span>
          ) : null}
          <div className="min-w-0 space-y-1">
            <h1 className="text-balance font-semibold text-2xl/tight tracking-tight">
              {title}
            </h1>
            {description ? (
              <p className="text-pretty text-muted-foreground text-sm">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}
