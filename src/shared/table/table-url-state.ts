import { useNavigate, useSearch } from '@tanstack/react-router'
import { useCallback, useMemo } from 'react'
import { z } from 'zod'

/**
 * URL-synced list/table state. Page, page size, sort, search and the create/edit
 * Sheet target all live in the route's search params, so every admin list view is
 * shareable, bookmarkable and back-button-correct — refreshing keeps your filters,
 * and `/users/new` can simply redirect to `/users?sheet=create`.
 *
 * Each list route spreads `tableSearchBase` into its `validateSearch` (extended
 * with the feature's own filters), then the page reads/writes through
 * `useTableUrlState()`. The hook is route-agnostic (`useSearch({ strict: false })`)
 * so it never imports the router — avoiding a cycle with the page modules the
 * router imports.
 */
export const tableSearchBase = {
  page: z.coerce.number().int().min(1).catch(1).optional(),
  size: z.coerce.number().int().min(1).max(100).catch(20).optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  q: z.string().trim().min(1).optional(),
  sheet: z.enum(['create', 'edit']).optional(),
  sheetId: z.string().optional(),
}

export interface TableSearchState {
  page?: number
  size?: number
  sort?: string
  order?: 'asc' | 'desc'
  q?: string
  sheet?: 'create' | 'edit'
  sheetId?: string
  [key: string]: unknown
}

const DEFAULT_PAGE_SIZE = 20

/** Drop empty/undefined keys so the URL stays clean (`?q=&page=1` → `?page=1`). */
function prune<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue
    out[k] = v
  }
  return out as Partial<T>
}

export function useTableUrlState<S extends TableSearchState = TableSearchState>() {
  // Route-agnostic read so this hook never imports the router (which imports the
  // page modules that call it). `strict: false` returns the current route's search.
  const search = useSearch({ strict: false } as never) as S
  const navigate = useNavigate()

  const setSearch = useCallback(
    (patch: Partial<S>) => {
      void navigate({ search: (prev) => prune({ ...(prev as object), ...patch }) as never, replace: true })
    },
    [navigate],
  )

  const pageIndex = (search.page ?? 1) - 1
  const pageSize = search.size ?? DEFAULT_PAGE_SIZE

  const helpers = useMemo(
    () => ({
      /** DataTable pagination (0-based index) → URL (1-based page). */
      setPagination: (next: { pageIndex: number; pageSize: number }) =>
        setSearch({ page: next.pageIndex + 1, size: next.pageSize } as Partial<S>),
      setSort: (sort: string | undefined, order: 'asc' | 'desc' | undefined) =>
        setSearch({ sort, order } as Partial<S>),
      /** Editing the query resets to page 1. */
      setQuery: (q: string) => setSearch({ q: q || undefined, page: 1 } as Partial<S>),
      /** Update a feature filter (also resets to page 1). */
      setFilter: (key: keyof S, value: unknown) =>
        setSearch({ [key]: value || undefined, page: 1 } as unknown as Partial<S>),
      openCreate: () => setSearch({ sheet: 'create', sheetId: undefined } as Partial<S>),
      openEdit: (id: string) => setSearch({ sheet: 'edit', sheetId: id } as Partial<S>),
      closeSheet: () => setSearch({ sheet: undefined, sheetId: undefined } as Partial<S>),
    }),
    [setSearch],
  )

  return { search, setSearch, pageIndex, pageSize, ...helpers }
}

/** Build the `?limit&offset&sort&order` query fragment the list APIs expect. */
export function toListParams(state: {
  pageIndex: number
  pageSize: number
  sort?: string
  order?: 'asc' | 'desc'
}): Record<string, string | number> {
  const params: Record<string, string | number> = {
    limit: state.pageSize,
    offset: state.pageIndex * state.pageSize,
  }
  if (state.sort) {
    params.sort = state.sort
    params.order = state.order ?? 'asc'
  }
  return params
}

/** Serialise a params object to a query string, skipping empty values. */
export function toQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === '') continue
    sp.set(k, String(v))
  }
  const s = sp.toString()
  return s ? `?${s}` : ''
}
