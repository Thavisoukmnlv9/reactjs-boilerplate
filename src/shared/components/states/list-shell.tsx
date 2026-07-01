import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { EmptyState } from './empty-state'
import { ErrorState } from './error-state'
import { LoadingState } from './loading-state'

interface ListShellEmpty {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}

interface ListShellProps<T> {
  /** TanStack Query result to drive the shell's state machine. */
  query: UseQueryResult<readonly T[] | T[]>
  /** True when the page is showing filtered results (alters the empty copy). */
  isFiltered?: boolean
  /** Copy for the "no rows ever yet" state. */
  empty: ListShellEmpty
  /** Copy for the "filtered, but no matches" state. Optional. */
  filteredEmpty?: { title: string; description?: string }
  /** Renderer for the success state. */
  children: (rows: T[]) => ReactNode
  /** Override loading skeleton row count. */
  loadingRows?: number
}

/**
 * Wraps a list/table page with the canonical five UI states
 * (loading / error / unfiltered-empty / filtered-empty / success).
 *
 * Goal: stop list pages from rendering blank tables on query failure or
 * stale data while loading. Drop this around the existing
 * ``<DataTable />`` and pass through ``children`` as the success body.
 */
export function ListShell<T>({
  query,
  isFiltered,
  empty,
  filteredEmpty,
  children,
  loadingRows = 6,
}: ListShellProps<T>) {
  if (query.isLoading) return <LoadingState rows={loadingRows} />

  if (query.isError) {
    const message =
      (query.error as { message?: string } | null)?.message ??
      'Something went wrong'
    return <ErrorState message={message} onRetry={() => query.refetch()} />
  }

  const rows = (query.data ?? []) as T[]
  if (rows.length === 0) {
    if (isFiltered && filteredEmpty) {
      return (
        <EmptyState
          title={filteredEmpty.title}
          description={filteredEmpty.description}
        />
      )
    }
    return (
      <EmptyState
        title={empty.title}
        description={empty.description}
        action={empty.action}
        icon={empty.icon}
      />
    )
  }

  return <>{children(rows)}</>
}
