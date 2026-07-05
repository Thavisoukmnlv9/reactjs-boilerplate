import type { ColumnDef } from '@tanstack/react-table'
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react'
import * as React from 'react'

import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'

type MobileExpandedRow<TData> = {
  original: TData
  getValue: (key: string) => unknown
}

type MobileCellContext<TData> = {
  getValue: () => unknown
  renderValue: () => unknown
  row: {
    original: TData
    index: number
    getValue: (key: string) => unknown
    getIsSelected: () => boolean
    toggleSelected: () => void
    getIsExpanded: () => boolean
    toggleExpanded: () => void
  }
  column: never
  table: never
  cell: never
}

function getMobileColumnValue<TData>(
  column: ColumnDef<TData, unknown>,
  row: TData
): unknown {
  const def = column as {
    accessorFn?: (originalRow: TData) => unknown
    accessorKey?: string
  }
  if (typeof def.accessorFn === 'function') return def.accessorFn(row)
  if (typeof def.accessorKey === 'string') {
    if (def.accessorKey.includes('.')) {
      let result: unknown = row as Record<string, unknown>
      for (const part of def.accessorKey.split('.')) {
        result = (result as Record<string, unknown> | null)?.[part]
      }
      return result
    }
    return (row as Record<string, unknown>)[def.accessorKey]
  }
  return undefined
}

function rowGetValueByKey<TData>(row: TData, key: string): unknown {
  if (key.includes('.')) {
    let result: unknown = row as Record<string, unknown>
    for (const part of key.split('.')) {
      result = (result as Record<string, unknown> | null)?.[part]
    }
    return result
  }
  return row[key as keyof TData]
}

function buildMobileCellContext<TData>(
  column: ColumnDef<TData, unknown>,
  row: TData,
  rowIndex: number,
  expandedRows: Record<number, boolean>,
  toggleExpanded: (index: number) => void
): MobileCellContext<TData> {
  const getValue = () => getMobileColumnValue(column, row)
  return {
    getValue,
    renderValue: getValue,
    row: {
      original: row,
      index: rowIndex,
      getValue: (key: string) => rowGetValueByKey(row, key),
      getIsSelected: () => false,
      toggleSelected: () => {},
      getIsExpanded: () => expandedRows[rowIndex] || false,
      toggleExpanded: () => toggleExpanded(rowIndex),
    },
    column: column as never,
    table: {} as never,
    cell: {} as never,
  }
}

/**
 * Render a column's cell for the mobile card. The actions branch and the value
 * branch both invoke the cell function with the same mobile cell context; this
 * keeps that single call in one place. Callers keep their own
 * `typeof column.cell === 'function'` guard and their own non-function fallback.
 */
function renderMobileCell<TData>(
  column: ColumnDef<TData, unknown>,
  row: TData,
  rowIndex: number,
  expandedRows: Record<number, boolean>,
  toggleExpanded: (index: number) => void
): React.ReactNode {
  // The mobile cell context is a structural subset of TanStack's CellContext;
  // cast the same way the original inline call sites did (type-only, no runtime change).
  // biome-ignore lint/suspicious/noExplicitAny: matches the original inline cast
  return (column.cell as any)(
    buildMobileCellContext(column, row, rowIndex, expandedRows, toggleExpanded)
  )
}

export function MobileCardList<TData>({
  columns,
  data,
  isLoading,
  pageSize,
  noDataMessage,
  renderExpandedContent,
  keyExtractor,
}: {
  columns: ColumnDef<TData, unknown>[]
  data: TData[]
  isLoading: boolean
  pageSize: number
  noDataMessage: string
  renderExpandedContent?: (row: MobileExpandedRow<TData>) => React.ReactNode
  keyExtractor?: (row: TData) => string
}) {
  const [expandedRows, setExpandedRows] = React.useState<
    Record<number, boolean>
  >({})

  const toggleExpanded = (index: number) => {
    setExpandedRows((prev) => ({ ...prev, [index]: !prev[index] }))
  }

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
              {columns.slice(0, 4).map((_, cellIndex) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells have no stable ids
                  key={`mobile-skeleton-cell-${index}-${cellIndex}`}
                >
                  <Skeleton className="mb-1 h-3 w-1/3 rounded" />
                  <Skeleton className="h-4 w-full rounded" />
                </div>
              ))}
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
          key={keyExtractor ? keyExtractor(row) : `mobile-row-${index}`}
          className="rounded-xl border bg-card shadow-sm transition-shadow active:shadow-md"
        >
          <div className="flex flex-col gap-4 p-4">
            {columns.map((column) => {
              if (column.id === 'select' || column.id === 'expand') return null

              if (column.id === 'actions') {
                return (
                  <div
                    className="flex flex-col gap-2 border-t pt-4"
                    key={`mobile-${column.id}-${index}`}
                  >
                    <div className="flex flex-wrap gap-2">
                      {typeof column.cell === 'function' ? (
                        renderMobileCell(
                          column,
                          row,
                          index,
                          expandedRows,
                          toggleExpanded
                        )
                      ) : (
                        <div className="text-muted-foreground text-sm">
                          {String((column as any).accessorKey)}
                        </div>
                      )}
                    </div>

                    {columns.some((col) => col.id === 'expand') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleExpanded(index)}
                        className="min-h-11 w-full touch-manipulation"
                      >
                        {expandedRows[index] ? (
                          <>
                            <ChevronDownIcon className="h-4 w-4 shrink-0" />
                            <span>Collapse</span>
                          </>
                        ) : (
                          <>
                            <ChevronRightIcon className="h-4 w-4 shrink-0" />
                            <span>Expand</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )
              }

              return (
                <div
                  key={`mobile-${column.id || (column as any).accessorKey}-${index}`}
                  className="min-h-[2.5rem]"
                >
                  <div className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wider">
                    {typeof column.header === 'function'
                      ? column.header({
                          column: {} as any,
                          table: {} as any,
                          header: {} as any,
                        })
                      : column.header}
                  </div>
                  <div className="text-sm">
                    {typeof column.cell === 'function' ? (
                      renderMobileCell(
                        column,
                        row,
                        index,
                        expandedRows,
                        toggleExpanded
                      )
                    ) : (
                      <div>
                        {String(
                          row[(column as any).accessorKey as keyof TData]
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {expandedRows[index] && (
            <div className="border-t bg-muted/40 px-4 py-4">
              <div className="rounded-lg bg-background p-4">
                {renderExpandedContent ? (
                  renderExpandedContent({
                    original: row,
                    getValue: (key: string) => row[key as keyof TData],
                  })
                ) : (
                  <pre className="overflow-x-auto text-sm">
                    {JSON.stringify(row, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          )}
        </article>
      ))}
    </div>
  )
}
