import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

interface UseInfiniteComboboxDataParams<T> {
  queryKey: Array<string>
  queryFn: (params: {
    search: string
    pageParam: number
  }) => Promise<{ items: Array<T>; nextPage: number | null }>
  preloadQueryFn: (id: string) => Promise<T | null>
  getValue: (item: T) => string
  value: string
  search: string
  open: boolean
}

/**
 * Data layer for {@link InfiniteCombobox}: preloads the currently-selected item (so
 * its label shows before the list opens), paginates the searchable list, and merges
 * the selected item in when it isn't on the current page. Behavior is identical to
 * the previous inline implementation — extracted only to keep the component readable.
 */
export function useInfiniteComboboxData<T>({
  queryKey,
  queryFn,
  preloadQueryFn,
  getValue,
  value,
  search,
  open,
}: UseInfiniteComboboxDataParams<T>) {
  const { data: selectedItem } = useQuery({
    queryKey: [...queryKey, 'preload', value],
    queryFn: () => preloadQueryFn(value),
    enabled: !!value,
    staleTime: Number.POSITIVE_INFINITY,
  })

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: [...queryKey, search],
      queryFn: ({ pageParam = 1 }) => queryFn({ search, pageParam }),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      initialPageParam: 1,
      enabled: open,
      refetchOnWindowFocus: false,
      staleTime: 0,
    })

  const items = data ? data.pages.flatMap((page) => page.items) : []

  const mergedItems = useMemo(() => {
    if (!value) return items
    const exists = items.some((item) => getValue(item) === value)
    if (!exists && selectedItem) {
      return [selectedItem, ...items]
    }
    return items
  }, [items, value, selectedItem, getValue])

  return {
    selectedItem,
    mergedItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  }
}
