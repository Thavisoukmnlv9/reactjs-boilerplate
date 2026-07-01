import { XIcon } from 'lucide-react'
import type React from 'react'
import { cn } from '@/core/utils/cn'
import { Button } from '@/shared/components/ui/button'

export type FilterChip = {
  id: string
  label: React.ReactNode
  onRemove: () => void
}

type Props = {
  chips: FilterChip[]
  onClearAll?: () => void
  className?: string
}

export function TableFilterChips({ chips, onClearAll, className }: Props) {
  if (chips.length === 0) return null
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {chips.map((c) => (
        <span
          key={c.id}
          className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs"
        >
          {c.label}
          <button
            type="button"
            aria-label={`Remove filter ${c.id}`}
            onClick={c.onRemove}
            className="rounded-full text-muted-foreground transition-colors hover:text-foreground"
          >
            <XIcon className="size-3" />
          </button>
        </span>
      ))}
      {chips.length > 1 && onClearAll ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="h-6 px-2 text-xs"
        >
          Clear all
        </Button>
      ) : null}
    </div>
  )
}
