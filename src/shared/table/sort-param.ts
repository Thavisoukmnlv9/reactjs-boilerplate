import type { SortingState } from '@tanstack/react-table'

/**
 * Shared helpers for driving server-side sort through a single `sort` URL param.
 *
 * Convention (matches the food service backend `build_order_by` helpers):
 *   ascending  → `field`
 *   descending → `-field`
 * The leading `-` is the only signal; the field must be in the resource's allowlist.
 */
export type ParsedSort = { sortBy: string; sortOrder: 'asc' | 'desc' }

/** Parse a `sort` query string into a `{ sortBy, sortOrder }` the DataTable understands. */
export function parseSortParam(
  sort: string | undefined,
  allowed: readonly string[],
  fallback?: ParsedSort
): ParsedSort | undefined {
  if (!sort) return fallback
  const desc = sort.startsWith('-')
  const field = desc ? sort.slice(1) : sort
  if (!allowed.includes(field)) return fallback
  return { sortBy: field, sortOrder: desc ? 'desc' : 'asc' }
}

/** Serialize TanStack Table sorting state back into the `sort` query string. */
export function sortingStateToParam(
  sorting: SortingState,
  allowed: readonly string[]
): string | undefined {
  const first = sorting[0]
  if (!first || !allowed.includes(first.id)) return undefined
  return first.desc ? `-${first.id}` : first.id
}
