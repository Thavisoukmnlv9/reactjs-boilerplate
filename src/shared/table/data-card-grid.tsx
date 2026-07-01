import {
  type ColumnDef,
  getCoreRowModel,
  type PaginationState,
  useReactTable,
} from '@tanstack/react-table'
import { LayoutGrid } from 'lucide-react'
import * as React from 'react'

import { useIsMobile } from '@/core/hooks/use-mobile'
import { cn } from '@/core/utils/cn'
import { Skeleton } from '@/shared/components/ui/skeleton'

import { DataTablePagination } from './data-table-pagination'

const SKELETON_PLACEHOLDER_KEYS = [
  'card-sk-0',
  'card-sk-1',
  'card-sk-2',
  'card-sk-3',
  'card-sk-4',
  'card-sk-5',
  'card-sk-6',
  'card-sk-7',
  'card-sk-8',
  'card-sk-9',
  'card-sk-10',
  'card-sk-11',
  'card-sk-12',
  'card-sk-13',
  'card-sk-14',
  'card-sk-15',
  'card-sk-16',
  'card-sk-17',
  'card-sk-18',
  'card-sk-19',
] as const

export type DataCardGridProps<TData> = {
  data: TData[]
  totalCount?: number
  isLoading?: boolean
  pageSize?: number
  pageIndex?: number
  onPaginationChange?: (pagination: PaginationState) => void
  enablePagination?: boolean
  noDataMessage?: string
  className?: string
  /** Applied to the responsive grid wrapper around cards */
  gridClassName?: string
  renderCard: (item: TData) => React.ReactNode
  getRowKey: (item: TData, index: number) => React.Key
}

const placeholderColumn = <TData,>(): ColumnDef<TData, unknown> => ({
  id: '__data_card_grid',
  accessorFn: () => null,
  header: '',
  cell: () => null,
})

export function DataCardGrid<TData>({
  data,
  totalCount = 0,
  isLoading = false,
  pageSize = 10,
  pageIndex = 0,
  onPaginationChange,
  enablePagination = true,
  noDataMessage = 'No data available',
  className,
  gridClassName = 'grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3',
  renderCard,
  getRowKey,
}: DataCardGridProps<TData>) {
  const isMobile = useIsMobile()
  const columns = React.useMemo<ColumnDef<TData, unknown>[]>(
    () => [placeholderColumn<TData>()],
    []
  )
  const pageCount = Math.ceil(totalCount / Number(pageSize) || 10)

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex,
    pageSize,
  })

  React.useEffect(() => {
    setPagination((prev) => {
      if (prev.pageIndex === pageIndex && prev.pageSize === pageSize) {
        return prev
      }
      return { pageIndex, pageSize }
    })
  }, [pageIndex, pageSize])

  React.useEffect(() => {
    if (
      onPaginationChange &&
      (pagination.pageIndex !== pageIndex || pagination.pageSize !== pageSize)
    ) {
      onPaginationChange(pagination)
    }
  }, [pagination, onPaginationChange, pageIndex, pageSize])

  const table = useReactTable({
    data,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
  })

  const skeletonCount = Math.min(pageSize, isMobile ? 4 : 6)

  const cardShell =
    'flex h-full min-h-[19rem] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground shadow-sm shadow-black/[0.02] ring-1 ring-black/[0.02] transition-[border-color,box-shadow,transform] duration-200 ease-out dark:shadow-black/20 dark:ring-white/[0.04]'

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {isLoading ? (
        <div className={gridClassName}>
          {SKELETON_PLACEHOLDER_KEYS.slice(0, skeletonCount).map((skKey) => (
            <div key={skKey} className={cn(cardShell, 'p-5')}>
              <div className="flex gap-3">
                <Skeleton className="size-14 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-5 w-3/5 rounded-md" />
                  <Skeleton className="h-3.5 w-2/5 rounded-md" />
                  <Skeleton className="mt-3 h-3 w-full rounded-md" />
                  <Skeleton className="h-3 w-11/12 rounded-md" />
                </div>
              </div>
              <Skeleton className="mt-5 h-px w-full shrink-0 rounded-full bg-border/60" />
              <div className="mt-auto flex justify-between gap-3 pt-5">
                <Skeleton className="h-9 w-28 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : !data.length ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl  bg-gradient-to-b from-muted/40 to-muted/15 px-8 py-14 text-center sm:py-16">
          <div className="flex size-14 items-center justify-center rounded-2xl  bg-background/80 text-muted-foreground shadow-inner">
            <LayoutGrid className="size-7 stroke-[1.25]" aria-hidden />
          </div>
          <p className="max-w-sm text-pretty text-sm leading-relaxed text-muted-foreground">
            {noDataMessage}
          </p>
        </div>
      ) : (
        <div className={gridClassName}>
          {data.map((item, index) => (
            <article
              key={getRowKey(item, index)}
              className={cn(
                cardShell,
                'hover:-translate-y-0.5 hover:border-border hover:shadow-md hover:shadow-black/[0.06] focus-within:border-border focus-within:ring-2 focus-within:ring-ring/30 focus-within:ring-offset-2 focus-within:ring-offset-background dark:hover:shadow-black/40'
              )}
            >
              {renderCard(item)}
            </article>
          ))}
        </div>
      )}

      <div className="rounded-lg border border-border text-card-foreground">
        {enablePagination && (
          <DataTablePagination<TData>
            table={table}
            pageCount={pageCount}
            totalCount={totalCount}
            onPaginationChange={onPaginationChange}
          />
        )}
      </div>
    </div>
  )
}
