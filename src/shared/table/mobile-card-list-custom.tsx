import type * as React from 'react'

import { Skeleton } from '@/shared/components/ui/skeleton'

export function MobileCardListCustom<TData>({
  data,
  isLoading,
  pageSize,
  noDataMessage,
  renderCard,
}: {
  data: TData[]
  isLoading: boolean
  pageSize: number
  noDataMessage: string
  renderCard: (item: TData) => React.ReactNode
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-1 py-2 sm:px-0">
        {Array.from({ length: Math.min(pageSize, 5) }).map((_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no stable ids
            key={`mobile-skeleton-${index}`}
            className="rounded-xl border bg-card p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3">
              <Skeleton className="mb-1 h-4 w-2/3 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
        <p className="text-muted-foreground text-sm">{noDataMessage}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 px-1 py-2 sm:px-0">
      {data.map((row, index) => (
        <article
          // biome-ignore lint/suspicious/noArrayIndexKey: no keyExtractor available in custom renderer mode
          key={`mobile-card-${index}`}
          className="rounded-xl border bg-card shadow-sm transition-shadow active:shadow-md"
        >
          {renderCard(row)}
        </article>
      ))}
    </div>
  )
}
