import { Skeleton } from '@/shared/components/ui/skeleton'

// Stable keys + varied widths so the skeleton reads as content, not bars.
const ROW_KEYS = Array.from({ length: 12 }, (_, i) => `loading-row-${i}`)
const ROW_WIDTHS = ['w-full', 'w-11/12', 'w-10/12', 'w-9/12'] as const

export function LoadingState({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      {ROW_KEYS.slice(0, rows).map((key, i) => (
        <Skeleton
          key={key}
          className={`h-10 ${ROW_WIDTHS[i % ROW_WIDTHS.length]}`}
        />
      ))}
    </div>
  )
}
