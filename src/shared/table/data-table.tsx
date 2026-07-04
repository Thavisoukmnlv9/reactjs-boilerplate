import {
  type ColumnDef,
  type ColumnFiltersState,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from 'lucide-react'
import * as React from 'react'
import { useIsMobile } from '@/core/hooks/use-mobile'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { MobileCardList } from '@/shared/table/mobile-card-list'
import { MobileCardListCustom } from '@/shared/table/mobile-card-list-custom'
import { DataTablePagination } from './data-table-pagination'

// Utility functions for creating columns
export function createSortableColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  options: {
    size?: number
    cell?: (props: {
      row: { getValue: (key: string) => unknown; original: TData }
    }) => React.ReactNode
  } = {}
): ColumnDef<TData, unknown> {
  return {
    accessorKey: accessorKey as string,
    header,
    size: options.size,
    cell:
      options.cell ||
      (({ row }) => <div>{String(row.getValue(accessorKey as string))}</div>),
    enableSorting: true,
    enableColumnFilter: false,
  }
}

export function createFilterableColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  options: {
    size?: number
    cell?: (props: {
      row: { getValue: (key: string) => unknown; original: TData }
    }) => React.ReactNode
  } = {}
): ColumnDef<TData, unknown> {
  return {
    accessorKey: accessorKey as string,
    header,
    size: options.size,
    cell:
      options.cell ||
      (({ row }) => <div>{String(row.getValue(accessorKey as string))}</div>),
    enableSorting: false,
    enableColumnFilter: true,
  }
}

export function createSelectableColumn<TData>(
  accessorKey: keyof TData,
  header: string,
  options: {
    size?: number
    cell?: (props: {
      row: { getValue: (key: string) => unknown; original: TData }
    }) => React.ReactNode
  } = {}
): ColumnDef<TData, unknown> {
  return {
    accessorKey: accessorKey as string,
    header,
    size: options.size,
    cell:
      options.cell ||
      (({ row }) => <div>{String(row.getValue(accessorKey as string))}</div>),
    enableSorting: true,
    enableColumnFilter: true,
  }
}

export function createExpandableColumn<TData>(
  header = 'Expand',
  options: {
    size?: number
    cell?: (props: {
      row: { getValue: (key: string) => unknown; original: TData }
    }) => React.ReactNode
  } = {}
): ColumnDef<TData, unknown> {
  return {
    id: 'expand',
    header,
    size: options.size || 50,
    cell:
      options.cell ||
      (({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => row.toggleExpanded()}
          className="h-8 w-8 p-0"
        >
          {row.getIsExpanded() ? (
            <ChevronDownIcon className="h-4 w-4" />
          ) : (
            <ChevronRightIcon className="h-4 w-4" />
          )}
        </Button>
      )),
    enableSorting: false,
    enableColumnFilter: false,
  }
}

// Props interfaces
export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalCount?: number
  isLoading?: boolean
  /** Backwards-compatible alias for isLoading */
  loading?: boolean
  pageSize?: number
  pageIndex?: number
  onPaginationChange?: (pagination: PaginationState) => void
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  onSortingChange?: (sorting: SortingState) => void
  onColumnFiltersChange?: (filters: ColumnFiltersState) => void

  onRowSelectionChange?: (selection: RowSelectionState) => void
  enableSorting?: boolean
  enableFiltering?: boolean
  enableRowSelection?: boolean
  enablePagination?: boolean

  noDataMessage?: string
  /** Backwards-compatible alias for noDataMessage */
  emptyMessage?: string
  /** Provide stable IDs for row keys/selection */
  keyExtractor?: (row: TData) => string
  className?: string
  renderExpandedContent?: (row: {
    original: TData
    getValue: (key: string) => unknown
  }) => React.ReactNode
  /** Custom card renderer for mobile; when provided, used instead of column-based mobile list */
  renderMobileCard?: (item: TData) => React.ReactNode
}

// mobile list moved to `mobile-card-list.tsx` and `mobile-card-list-custom.tsx`

// Main DataTable component
export function DataTable<TData, TValue>({
  columns,
  data,
  totalCount = 0,
  isLoading = false,
  loading,
  pageSize = 10,
  pageIndex = 0,
  onPaginationChange,
  sortBy,
  sortOrder,
  onSortingChange,
  onColumnFiltersChange,
  onRowSelectionChange,
  enableSorting = true,
  enableFiltering = true,
  enableRowSelection = true,
  enablePagination = true,
  noDataMessage = 'No data available',
  emptyMessage,
  keyExtractor,
  className,
  renderExpandedContent,
  renderMobileCard,
}: DataTableProps<TData, TValue>) {
  const isMobile = useIsMobile()
  const resolvedIsLoading = loading ?? isLoading
  const resolvedNoDataMessage = emptyMessage ?? noDataMessage
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: sortBy || '',
      desc: sortOrder === 'desc',
    },
  ])

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex,
    pageSize,
  })

  const pageCount = Math.ceil(totalCount / (Number(pageSize) || 10))

  // Controlled state changes
  React.useEffect(() => {
    if (
      onPaginationChange &&
      (pagination.pageIndex !== pageIndex || pagination.pageSize !== pageSize)
    ) {
      onPaginationChange(pagination)
    }
  }, [pagination, onPaginationChange])

  React.useEffect(() => {
    if (
      onSortingChange &&
      sorting.length > 0 &&
      (sorting[0].id !== sortBy || sorting[0].desc !== (sortOrder === 'desc'))
    ) {
      onSortingChange(sorting)
    }
  }, [sorting, onSortingChange])

  React.useEffect(() => {
    if (onColumnFiltersChange) {
      onColumnFiltersChange(columnFilters)
    }
  }, [columnFilters, onColumnFiltersChange])

  React.useEffect(() => {
    if (onRowSelectionChange) {
      onRowSelectionChange(rowSelection)
    }
  }, [rowSelection, onRowSelectionChange])

  const rowId: ((row: TData) => string) | undefined = keyExtractor
    ? (row) => keyExtractor(row)
    : undefined

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      expanded,
      columnFilters,
      sorting,
      pagination,
    },
    getRowId: rowId,
    enableRowSelection: enableRowSelection,
    enableExpanding: true,
    enableSorting,
    enableFilters: enableFiltering,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: !!onPaginationChange,
    manualSorting: !!onSortingChange,
    manualFiltering: !!onColumnFiltersChange,
    pageCount,
  })

  return (
    <div className={className}>
      {/* Mobile Card List View */}
      {isMobile ? (
        <div className="min-w-0">
          {renderMobileCard ? (
            <MobileCardListCustom
              data={data}
              isLoading={resolvedIsLoading}
              pageSize={pageSize}
              noDataMessage={resolvedNoDataMessage}
              renderCard={renderMobileCard}
            />
          ) : (
            <MobileCardList
              columns={columns as ColumnDef<TData, unknown>[]}
              data={data}
              isLoading={resolvedIsLoading}
              pageSize={pageSize}
              noDataMessage={resolvedNoDataMessage}
              renderExpandedContent={renderExpandedContent}
              keyExtractor={keyExtractor}
            />
          )}

          {enablePagination && (
            <DataTablePagination<TData>
              table={table}
              pageCount={pageCount}
              totalCount={totalCount}
              onPaginationChange={onPaginationChange}
            />
          )}
        </div>
      ) : (
        /* Desktop Table View */
        <>
          <div className="border [.border]:rounded-lg">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          style={{ width: header.getSize() }}
                        >
                          {header.isPlaceholder ? null : (
                            <div className="flex items-center">
                              {header.column.getCanSort() ? (
                                <button
                                  type="button"
                                  className="flex items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-muted/50"
                                  onClick={header.column.getToggleSortingHandler()}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      header.column.getToggleSortingHandler()?.(
                                        e
                                      )
                                    }
                                  }}
                                >
                                  {typeof header.column.columnDef.header ===
                                  'function'
                                    ? header.column.columnDef.header({
                                        column: header.column,
                                        table,
                                        header,
                                      })
                                    : header.column.columnDef.header}
                                  {{
                                    asc: <ArrowUpIcon className="h-4 w-4" />,
                                    desc: <ArrowDownIcon className="h-4 w-4" />,
                                  }[header.column.getIsSorted() as string] ?? (
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                  )}
                                </button>
                              ) : (
                                <div>
                                  {typeof header.column.columnDef.header ===
                                  'function'
                                    ? header.column.columnDef.header({
                                        column: header.column,
                                        table,
                                        header,
                                      })
                                    : header.column.columnDef.header}
                                </div>
                              )}
                            </div>
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {resolvedIsLoading ? (
                  // Skeleton loading rows
                  Array.from({ length: pageSize }).map((_, index) => (
                    <TableRow
                      // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no stable ids
                      key={`skeleton-row-${index}`}
                    >
                      {Array.from({ length: columns.length }).map(
                        (_, cellIndex) => (
                          <TableCell
                            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cells have no stable ids
                            key={`skeleton-cell-${index}-${cellIndex}`}
                          >
                            <Skeleton className="h-4 w-full" />
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  ))
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow data-state={row.getIsSelected() && 'selected'}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {
                              (typeof cell.column.columnDef.cell === 'function'
                                ? flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )
                                : cell.getValue()) as React.ReactNode
                            }
                          </TableCell>
                        ))}
                      </TableRow>
                      {row.getIsExpanded() && (
                        <TableRow>
                          <TableCell colSpan={row.getVisibleCells().length}>
                            <div className="bg-muted/50 p-4">
                              {renderExpandedContent ? (
                                renderExpandedContent({
                                  original: row.original,
                                  getValue: (key: string) => row.getValue(key),
                                })
                              ) : (
                                <pre className="text-sm">
                                  {JSON.stringify(row.original, null, 2)}
                                </pre>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      {resolvedNoDataMessage}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {enablePagination && (
            <DataTablePagination<TData>
              table={table}
              pageCount={pageCount}
              totalCount={totalCount}
              onPaginationChange={onPaginationChange}
            />
          )}
        </>
      )}
    </div>
  )
}

export type { DataTablePaginationProps } from './data-table-pagination'
export { DataTablePagination } from './data-table-pagination'
