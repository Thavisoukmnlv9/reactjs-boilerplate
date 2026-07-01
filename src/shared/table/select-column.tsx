import type { ColumnDef } from '@tanstack/react-table'

import { Checkbox } from '@/shared/components/ui/checkbox'
import type { TableSelection } from './use-table-selection'

/**
 * Builds the leading checkbox column for `DataTable` from a `useTableSelection`
 * instance. Prepend it to a resource's columns only when the viewer can run bulk
 * actions, so read-only users never see selection affordances.
 */
export function createSelectColumn<T extends { id: string }>(
  selection: TableSelection<T>,
  ariaLabel = 'row'
): ColumnDef<T, unknown> {
  return {
    id: 'select',
    size: 40,
    enableSorting: false,
    enableHiding: false,
    header: () => (
      <Checkbox
        checked={
          selection.allSelected
            ? true
            : selection.someSelected
              ? 'indeterminate'
              : false
        }
        onCheckedChange={() => selection.toggleAll()}
        aria-label={`Select all ${ariaLabel}s on this page`}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={selection.isSelected(row.original.id)}
        onCheckedChange={() => selection.toggleOne(row.original.id)}
        onClick={(e) => e.stopPropagation()}
        aria-label={`Select ${ariaLabel}`}
      />
    ),
  }
}
