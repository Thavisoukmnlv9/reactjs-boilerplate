import * as React from 'react'

/**
 * Page-scoped multi-row selection for list views (tables and card grids).
 *
 * Selection is keyed by entity id and tracked in a `Set`. "Select all" operates
 * on the ids currently rendered on the page (server pagination means the rest of
 * the dataset isn't in memory), which matches how every other admin list behaves.
 *
 * Pair with `createSelectColumn` (for `DataTable`) or render a checkbox inside a
 * card via the returned `isSelected` / `toggleOne` helpers (for `DataCardGrid`),
 * and surface the bulk actions through the shared `TableBulkActionBar`.
 */
export function useTableSelection<T extends { id: string }>(items: T[]) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    () => new Set()
  )

  const pageIds = React.useMemo(() => items.map((i) => i.id), [items])

  const toggleOne = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const toggleAll = React.useCallback(() => {
    setSelectedIds((prev) => {
      const allOnPage =
        pageIds.length > 0 && pageIds.every((id) => prev.has(id))
      const next = new Set(prev)
      if (allOnPage) {
        for (const id of pageIds) next.delete(id)
      } else {
        for (const id of pageIds) next.add(id)
      }
      return next
    })
  }, [pageIds])

  const clear = React.useCallback(() => setSelectedIds(new Set()), [])

  const isSelected = React.useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  )

  const ids = React.useMemo(() => Array.from(selectedIds), [selectedIds])

  const allSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.has(id))
  const someSelected = !allSelected && pageIds.some((id) => selectedIds.has(id))

  return {
    selectedIds,
    ids,
    selectedCount: selectedIds.size,
    toggleOne,
    toggleAll,
    clear,
    isSelected,
    allSelected,
    someSelected,
  }
}

export type TableSelection<T extends { id: string }> = ReturnType<
  typeof useTableSelection<T>
>
