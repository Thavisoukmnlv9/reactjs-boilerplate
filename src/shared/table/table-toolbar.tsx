import type { ReactNode } from 'react'
import { cn } from '@/core/utils/cn'

type TableToolbarProps = {
  /** Free slot on the left — typically search and filter chips. */
  left?: ReactNode
  /** Free slot on the right — typically column visibility, export, refresh. */
  right?: ReactNode
  /** Toolbar tightens vertical rhythm; reset to 0 if you supply your own. */
  className?: string
}

export function TableToolbar({ left, right, className }: TableToolbarProps) {
  if (!left && !right) return null
  return (
    <div
      className={cn(
        'mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between',
        className
      )}
    >
      {left ? (
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          {left}
        </div>
      ) : null}
      {right ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {right}
        </div>
      ) : null}
    </div>
  )
}
