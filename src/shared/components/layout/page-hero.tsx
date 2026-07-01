import type { ReactNode } from 'react'

import { cn } from '@/core/utils/cn'

interface PageHeroProps {
  title: ReactNode
  subtitle?: ReactNode
  description?: ReactNode
  brandColor?: string | null
  logoUrl?: string | null
  fallbackInitial?: string
  actions?: ReactNode
  badges?: ReactNode
  className?: string
}

function isHex(value: string | null | undefined): value is string {
  return !!value && /^#[0-9a-fA-F]{6}$/.test(value)
}

export function PageHero({
  title,
  subtitle,
  description,
  brandColor,
  logoUrl,
  fallbackInitial,
  actions,
  badges,
  className,
}: PageHeroProps) {
  const tint = isHex(brandColor) ? brandColor : '#f54a00'
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-card',
        className
      )}
    >
      <div
        className="absolute inset-x-0 top-0 h-24 opacity-90"
        style={{
          background: `linear-gradient(135deg, ${tint} 0%, ${tint}cc 60%, transparent 100%)`,
        }}
        aria-hidden
      />
      <div className="relative flex flex-col gap-4 px-6 pt-20 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-4 min-w-0">
          <div
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm"
            style={
              isHex(brandColor) ? { borderColor: `${brandColor}33` } : undefined
            }
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt=""
                className="h-12 w-12 rounded object-cover"
              />
            ) : (
              <span
                className="text-2xl font-semibold uppercase"
                style={{ color: tint }}
              >
                {(fallbackInitial ?? '?').slice(0, 1)}
              </span>
            )}
          </div>
          <div className="min-w-0 pb-1">
            {subtitle && (
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {subtitle}
              </p>
            )}
            <h1 className="truncate text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
            {badges && (
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {badges}
              </div>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap gap-2 pb-1">{actions}</div>
        )}
      </div>
    </div>
  )
}
