import { Inbox, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-10 text-center',
        className,
      )}
    >
      <div className="bg-muted flex size-11 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground size-5" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        {description ? <p className="text-muted-foreground text-sm">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
