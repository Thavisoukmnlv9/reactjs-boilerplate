import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="tx-motion-rise flex flex-col items-center justify-center px-6 py-14 text-center sm:py-16">
      {icon && (
        <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground ring-1 ring-border/60">
          {icon}
        </div>
      )}
      <h3 className="font-semibold text-base tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-pretty text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
