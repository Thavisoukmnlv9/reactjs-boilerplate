/**
 * URL-synced table state (page, pageSize, sort, search, filters).
 *
 * Every list page that uses `<DataTable>` should drive its query params through this hook.
 * Search params are reflected into the URL so views are shareable and survive refresh.
 *
 * Usage:
 *
 *   const route = getRouteApi('/_app/pos/shop/suppliers/')
 *   const state = useTableState<SuppliersSearch>(route, { debounceMs: 400 })
 *   const query = useShopSuppliersQuery({
 *     page: state.page,
 *     limit: state.pageSize,
 *     search: state.search,
 *     ...state.filters,
 *   })
 *
 *   <DataTable
 *     pageIndex={state.pageIndex}
 *     pageSize={state.pageSize}
 *     onPaginationChange={state.onPaginationChange}
 *     ...
 *   />
 */
import { useNavigate } from '@tanstack/react-router'
import type { PaginationState } from '@tanstack/react-table'
import * as React from 'react'

export type BaseTableSearch = {
  page?: number
  limit?: number
  search?: string
  sort?: string
  [key: string]: string | number | boolean | undefined
}

export type UseTableStateOptions = {
  /** Default page size if the URL omits `?limit=`. */
  defaultPageSize?: number
  /** Debounce window for the search input in ms. */
  debounceMs?: number
}

export type TableState<TSearch extends BaseTableSearch> = {
  page: number
  pageIndex: number
  pageSize: number
  sort: string | undefined
  search: string | undefined
  searchInput: string
  setSearchInput: (next: string) => void
  filters: Omit<TSearch, 'page' | 'limit' | 'search' | 'sort'>
  hasActiveFilters: boolean
  setFilter: (key: string, value: string | undefined) => void
  setSort: (sort: string | undefined) => void
  clearFilters: () => void
  onPaginationChange: (next: PaginationState) => void
}

// biome-ignore lint/suspicious/noExplicitAny: hook is route-agnostic; routeApi shapes vary
type AnyRouteApi = {
  id: string
  useSearch: () => any
}

function trimEmpty(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = { ...obj }
  for (const k of Object.keys(out)) {
    const v = out[k]
    if (v === undefined || v === '' || v === null) delete out[k]
  }
  return out
}

const DEFAULT_PAGE_SIZE = 20

export function useTableState<
  TSearch extends BaseTableSearch = BaseTableSearch,
>(
  routeApi: AnyRouteApi,
  options: UseTableStateOptions = {}
): TableState<TSearch> {
  const { defaultPageSize = DEFAULT_PAGE_SIZE, debounceMs = 400 } = options
  const navigate = useNavigate()
  const searchParams = routeApi.useSearch() as TSearch

  const page = (searchParams.page as number | undefined) ?? 1
  const pageSize = (searchParams.limit as number | undefined) ?? defaultPageSize
  const sort = searchParams.sort
  const urlSearch = searchParams.search ?? ''

  const [searchInput, setSearchInput] = React.useState(urlSearch)

  React.useEffect(() => {
    setSearchInput(urlSearch)
  }, [urlSearch])

  // Generic navigate helper — accepts a Record updater, casts at the boundary.
  const updateSearch = React.useCallback(
    (
      updater: (prev: Record<string, unknown>) => Record<string, unknown>,
      replace = false
    ) => {
      void navigate({
        // biome-ignore lint/suspicious/noExplicitAny: typed via routeApi.id at runtime
        to: routeApi.id as any,
        // biome-ignore lint/suspicious/noExplicitAny: cross-route generic
        search: ((prev: Record<string, unknown>) =>
          trimEmpty(updater(prev))) as any,
        replace,
      })
    },
    [navigate, routeApi.id]
  )

  // Debounce search input → URL.
  React.useEffect(() => {
    const t = setTimeout(() => {
      const trimmed = searchInput.trim()
      if (trimmed !== urlSearch) {
        updateSearch(
          (prev) => ({
            ...prev,
            search: trimmed || undefined,
            page: undefined,
          }),
          true
        )
      }
    }, debounceMs)
    return () => clearTimeout(t)
  }, [searchInput, urlSearch, updateSearch, debounceMs])

  const setFilter = React.useCallback(
    (key: string, value: string | undefined) => {
      updateSearch((prev) => ({
        ...prev,
        [key]: value || undefined,
        page: undefined,
      }))
    },
    [updateSearch]
  )

  const setSort = React.useCallback(
    (next: string | undefined) => {
      updateSearch((prev) => ({ ...prev, sort: next || undefined }))
    },
    [updateSearch]
  )

  const clearFilters = React.useCallback(() => {
    setSearchInput('')
    updateSearch(() => ({ limit: searchParams.limit }))
  }, [updateSearch, searchParams.limit])

  const onPaginationChange = React.useCallback(
    (next: PaginationState) => {
      if (next.pageSize !== pageSize) {
        updateSearch((prev) => ({
          ...prev,
          limit: next.pageSize,
          page: undefined,
        }))
      } else if (next.pageIndex + 1 !== page) {
        updateSearch((prev) => ({ ...prev, page: next.pageIndex + 1 }))
      }
    },
    [updateSearch, page, pageSize]
  )

  const filters = React.useMemo(() => {
    const {
      page: _p,
      limit: _l,
      search: _s,
      sort: _so,
      ...rest
    } = searchParams as Record<string, unknown>
    return rest as Omit<TSearch, 'page' | 'limit' | 'search' | 'sort'>
  }, [searchParams])

  const hasActiveFilters = React.useMemo(() => {
    if (searchInput.trim() !== '') return true
    return Object.values(filters as Record<string, unknown>).some(
      (v) => v !== undefined && v !== '' && v !== null
    )
  }, [searchInput, filters])

  return {
    page,
    pageIndex: page - 1,
    pageSize,
    sort: sort as string | undefined,
    search: urlSearch || undefined,
    searchInput: searchInput as string,
    setSearchInput,
    filters,
    hasActiveFilters,
    setFilter,
    setSort,
    clearFilters,
    onPaginationChange,
  }
}
