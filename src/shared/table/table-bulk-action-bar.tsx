import type { LucideIcon } from 'lucide-react'
import { XIcon } from 'lucide-react'
import { cn } from '@/core/utils/cn'
import { Button } from '@/shared/components/ui/button'

export type BulkAction = {
  label: string
  icon?: LucideIcon
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  onClick: () => void | Promise<void>
  disabled?: boolean
}

type Props = {
  selectedCount: number
  totalCount?: number
  actions: BulkAction[]
  onClearSelection: () => void
  className?: string
}

export function TableBulkActionBar({
  selectedCount,
  totalCount,
  actions,
  onClearSelection,
  className,
}: Props) {
  if (selectedCount <= 0) return null
  return (
    <section
      aria-label="Bulk actions"
      className={cn(
        'pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4',
        className
      )}
    >
      <div className="pointer-events-auto flex max-w-3xl flex-wrap items-center gap-2 rounded-full border bg-background px-3 py-2 shadow-lg">
        <span className="rounded-full bg-primary px-2.5 py-0.5 text-primary-foreground text-xs">
          {selectedCount}
          {typeof totalCount === 'number' ? ` of ${totalCount}` : ''} selected
        </span>
        <div className="flex flex-wrap items-center gap-1">
          {actions.map((a) => {
            const Icon = a.icon
            return (
              <Button
                key={a.label}
                variant={a.variant ?? 'outline'}
                size="sm"
                disabled={a.disabled}
                onClick={() => void a.onClick()}
              >
                {Icon ? <Icon className="mr-1.5 size-3.5" /> : null}
                {a.label}
              </Button>
            )
          })}
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Clear selection"
          onClick={onClearSelection}
          className="ml-1 size-8"
        >
          <XIcon className="size-4" />
        </Button>
      </div>
    </section>
  )
}
