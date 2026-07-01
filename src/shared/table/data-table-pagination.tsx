import type { PaginationState, useReactTable } from '@tanstack/react-table'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { useIsMobile } from '@/core/hooks/use-mobile'
import { Button } from '@/shared/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'

export interface DataTablePaginationProps<TData = unknown> {
  table: ReturnType<typeof useReactTable<TData>>
  pageCount: number
  totalCount: number
  onPaginationChange?: (pagination: PaginationState) => void
}

export function DataTablePagination<TData = unknown>({
  table,
  pageCount,
  totalCount,
  onPaginationChange,
}: DataTablePaginationProps<TData>) {
  const { t } = useTranslation()
  const isMobile = useIsMobile()
  const { pageIndex, pageSize } = table.getState().pagination
  const start = totalCount === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, totalCount)
  const hasMultiplePages = (pageCount || 1) > 1

  const handlePageSizeChange = (value: string) => {
    table.setPageSize(Number(value))
    if (onPaginationChange) {
      onPaginationChange({
        pageIndex: table.getState().pagination.pageIndex,
        pageSize: Number(value),
      })
    }
  }

  const goToPage = (index: number) => {
    table.setPageIndex(index)
    if (onPaginationChange) {
      onPaginationChange({
        pageIndex: index,
        pageSize: table.getState().pagination.pageSize,
      })
    }
  }

  const buttonClass = isMobile
    ? 'h-10 min-w-10 p-0 touch-manipulation'
    : 'h-8 w-8 p-0'

  return (
    <div className="bg-muted/20 px-3 py-3 sm:px-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-center gap-2 text-brand-sm text-muted-foreground sm:justify-start">
          {totalCount === 0 ? (
            <span>{t('dataTable.noResults')}</span>
          ) : hasMultiplePages ? (
            <span>
              {t(isMobile ? 'dataTable.showingMobile' : 'dataTable.showing', {
                start,
                end,
                total: totalCount,
              })}
            </span>
          ) : (
            <span>
              {t(
                totalCount === 1
                  ? 'dataTable.resultOne'
                  : 'dataTable.resultOther',
                { count: totalCount }
              )}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2">
            <label
              htmlFor="pagination-page-size"
              className="text-brand-sm font-medium text-muted-foreground whitespace-nowrap"
            >
              {t(isMobile ? 'dataTable.perPage' : 'dataTable.rowsPerPage')}
            </label>
            <Select value={`${pageSize}`} onValueChange={handlePageSizeChange}>
              <SelectTrigger
                id="pagination-page-size"
                className={
                  isMobile
                    ? 'h-9 min-w-[64px] touch-manipulation'
                    : 'h-8 w-[70px]'
                }
              >
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasMultiplePages && (
            <div className="flex items-center gap-2">
              <span className="text-brand-sm font-medium text-foreground tabular-nums">
                {t('dataTable.pageXofY', {
                  page: pageIndex + 1,
                  total: pageCount,
                })}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden lg:flex"
                  onClick={() => goToPage(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">{t('dataTable.firstPage')}</span>
                  <ChevronsLeftIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={buttonClass}
                  onClick={() => goToPage(pageIndex - 1)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">{t('dataTable.previousPage')}</span>
                  <ChevronLeftIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={buttonClass}
                  onClick={() => goToPage(pageIndex + 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">{t('dataTable.nextPage')}</span>
                  <ChevronRightIcon className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hidden lg:flex"
                  onClick={() => goToPage(pageCount - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">{t('dataTable.lastPage')}</span>
                  <ChevronsRightIcon className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
