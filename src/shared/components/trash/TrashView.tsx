import { Link } from '@tanstack/react-router'
import { ArrowLeftIcon, Trash2Icon } from 'lucide-react'
import type React from 'react'

import { EmptyState } from '@/shared/components/states/empty-state'
import { ErrorState } from '@/shared/components/states/error-state'
import { LoadingState } from '@/shared/components/states/loading-state'
import { Button } from '@/shared/components/ui/button'

export interface TrashViewProps<TRow> {
  /** Title above the table — typically the pluralised resource name. */
  title: string
  /** Path to the live (non-trash) list page; rendered in the back button. */
  backHref: string
  rows: TRow[] | undefined
  isLoading: boolean
  error: Error | null
  /** Renders each soft-deleted row. Should include Restore + Permanent-delete buttons. */
  renderRow: (row: TRow) => React.ReactNode
  /** Optional override for the empty-trash copy. */
  emptyLabel?: string
}

/**
 * Generic shell for the per-resource Trash page. Consumers wire the queries
 * (with `withDeleted=true`) and supply a `renderRow` that includes Restore +
 * Permanent-delete actions per row.
 *
 * Role-gating (admin/owner only) is the caller's responsibility — wrap the
 * route element in `<RoleGate allowedRoles={['OWNER', 'ADMIN']}>` upstream.
 */
export function TrashView<TRow>(
  props: TrashViewProps<TRow>
): React.ReactElement {
  const { title, backHref, rows, isLoading, error, renderRow, emptyLabel } =
    props

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <header className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to={backHref}>
            <ArrowLeftIcon className="size-4" />
            <span>Back</span>
          </Link>
        </Button>
        <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Trash2Icon className="size-5 text-muted-foreground" />
          {title} — Trash
        </h1>
      </header>

      {isLoading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState message={error.message} />
      ) : !rows || rows.length === 0 ? (
        <EmptyState
          icon={<Trash2Icon className="size-8" />}
          title={emptyLabel ?? 'Trash is empty'}
          description="Soft-deleted records appear here. Restore them or delete them permanently."
        />
      ) : (
        <div className="flex flex-col gap-2">{rows.map(renderRow)}</div>
      )}
    </div>
  )
}
