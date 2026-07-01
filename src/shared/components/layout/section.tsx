import type { ReactNode } from 'react'

import { cn } from '@/core/utils/cn'

interface SectionProps {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
}

export function Section({
  title,
  description,
  icon,
  actions,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn('space-y-3', className)}>
      {(title || actions) && (
        <header className="flex items-end justify-between gap-3">
          <div className="min-w-0">
            {title && (
              <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
                {icon && (
                  <span className="text-muted-foreground [&_svg]:size-4">
                    {icon}
                  </span>
                )}
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  )
}
