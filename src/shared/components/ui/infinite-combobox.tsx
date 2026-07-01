import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Check, ChevronsUpDown, Loader2, Search, X } from 'lucide-react'
import React, { useRef } from 'react'
import { useDebouncedCallback } from '@/core/hooks/use-debounce'
import { cn } from '@/core/utils/cn'
import { Button } from '@/shared/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip'

interface InfiniteComboboxProps<T> {
  queryKey: Array<string>
  queryFn: (params: {
    search: string
    pageParam: number
  }) => Promise<{ items: Array<T>; nextPage: number | null }>
  preloadQueryFn: (id: string) => Promise<T | null>
  getLabel: (item: T) => string
  getValue: (item: T) => string
  getDisabled?: (item: T) => boolean
  value: string
  onValueChange: (value: string) => void
  /** Fires with the chosen item on select (and null on clear), for side-effects like syncing a dependent field. */
  onSelectItem?: (item: T | null) => void
  placeholder?: string
  className?: string
  clearable?: boolean
  disabled?: boolean
  icon?: React.ReactNode
}

export function InfiniteCombobox<T>({
  queryKey,
  queryFn,
  preloadQueryFn,
  getLabel,
  getValue,
  value,
  onValueChange,
  onSelectItem,
  placeholder = 'Select...',
  className,
  clearable,
  getDisabled,
  disabled,
  icon,
}: InfiniteComboboxProps<T>) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const handleWheel = React.useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (scrollContainerRef.current) {
        e.stopPropagation()
        scrollContainerRef.current.scrollTop += e.deltaY
      }
    },
    []
  )

  const debounced = useDebouncedCallback(
    (...args: Array<unknown>) => setSearch(args[0] as string),
    500
  )

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

  const mergedItems = React.useMemo(() => {
    if (!value) return items
    const exists = items.some((item) => getValue(item) === value)
    if (!exists && selectedItem) {
      return [selectedItem, ...items]
    }
    return items
  }, [items, value, selectedItem, getValue])

  React.useEffect(() => {
    if (open) {
      setSearch('')
    }
  }, [open])

  const parentRef = React.useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? mergedItems.length + 1 : mergedItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 42,
    overscan: 5,
  })

  React.useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse()
    if (!lastItem) return
    if (
      lastItem.index >= mergedItems.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage()
    }
  }, [
    hasNextPage,
    fetchNextPage,
    mergedItems.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ])

  const handleOpenChange = (isOpen: boolean) => {
    if (disabled && isOpen) return
    setOpen(isOpen)
    if (!isOpen) {
      setSearch('')
    }
  }

  const selected = mergedItems.find((item) => getValue(item) === value)
  const selectedIndex = selected ? mergedItems.indexOf(selected) : -1

  // Scroll selected option into view when dropdown opens
  React.useEffect(() => {
    if (!open || selectedIndex < 0 || !parentRef.current) return
    const id = setTimeout(() => {
      rowVirtualizer.scrollToIndex(selectedIndex, { align: 'auto' })
    }, 0)
    return () => clearTimeout(id)
  }, [open, selectedIndex])

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          ref={btnRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={
            selected ? `Selected: ${getLabel(selected)}` : placeholder
          }
          disabled={disabled}
          className={cn(
            'h-10 w-full justify-between font-normal text-sm',
            icon ? 'pl-9 pr-3' : 'px-3',
            'border-input bg-background hover:bg-muted/50 hover:border-input',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'data-[state=open]:border-ring data-[state=open]:ring-2 data-[state=open]:ring-ring/20 data-[state=open]:ring-offset-2 data-[state=open]:shadow-sm',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-200 rounded-lg',
            'relative',
            className
          )}
        >
          {icon && (
            <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
              {icon}
            </span>
          )}
          <div className="flex w-full min-w-0 items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center">
              {isFetching && !selected && value && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              <span
                className={cn(
                  'truncate text-left font-medium',
                  !selected && !value && 'font-normal text-muted-foreground'
                )}
              >
                {selected
                  ? getLabel(selected)
                  : value
                    ? 'Loading...'
                    : placeholder}
              </span>
            </div>
            <div className="ml-2 flex items-center gap-0.5">
              {clearable && value && (
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <span
                      role="button"
                      tabIndex={0}
                      className="inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-destructive/15 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                        onValueChange('')
                        onSelectItem?.(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          e.stopPropagation()
                          onValueChange('')
                          onSelectItem?.(null)
                        }
                      }}
                      aria-label="Clear selection"
                    >
                      <X className="size-3.5" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="border border-border bg-popover text-popover-foreground"
                  >
                    Clear selection
                  </TooltipContent>
                </Tooltip>
              )}
              <ChevronsUpDown
                className={cn(
                  'size-4 transition-transform duration-200 text-muted-foreground',
                  open && 'rotate-180',
                  'motion-reduce:transition-none'
                )}
              />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] rounded-xl border bg-popover p-0 shadow-lg overflow-hidden"
        style={{ width: btnRef.current?.offsetWidth }}
        align="start"
        sideOffset={6}
      >
        <Command
          shouldFilter={false}
          className="rounded-xl border-0 bg-transparent"
        >
          <div className="sticky top-0 z-10 border-b border-border/80 bg-popover/95 backdrop-blur-[2px]">
            <CommandInput
              placeholder="Type to search..."
              className="h-11 border-0 bg-transparent px-3 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-muted/30 transition-colors rounded-none"
              onValueChange={(v: string) => debounced(v)}
            />
          </div>
          <CommandList
            ref={parentRef}
            className="max-h-[min(320px,70vh)] overflow-auto overflow-x-hidden py-1.5 pb-3 scroll-smooth"
            role="listbox"
            aria-label="Options"
          >
            {isFetching && mergedItems.length === 0 && (
              <CommandEmpty className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="rounded-full bg-muted/90 p-3 ring-2 ring-muted/50">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
                <span className="text-sm text-muted-foreground">
                  Loading options...
                </span>
                <span className="text-xs text-muted-foreground/80">
                  This may take a moment
                </span>
              </CommandEmpty>
            )}
            {!isFetching && mergedItems.length === 0 && (
              <CommandEmpty className="flex flex-col items-center justify-center gap-3 py-12 px-4">
                <div className="rounded-full bg-muted/70 p-3">
                  <Search className="size-5 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  No results found
                </span>
                <span className="text-xs text-muted-foreground text-center max-w-[200px]">
                  Try a different search or check your spelling
                </span>
              </CommandEmpty>
            )}
            <CommandGroup>
              <div
                onWheel={handleWheel}
                ref={scrollContainerRef}
                style={{
                  height: rowVirtualizer.getTotalSize(),
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const isLoaderRow = virtualRow.index > mergedItems.length - 1
                  const item = mergedItems[virtualRow.index]

                  return (
                    <div
                      key={virtualRow.index}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {isLoaderRow ? (
                        <div className="flex items-center justify-center gap-2 px-3 py-4 text-muted-foreground/90 text-xs">
                          {hasNextPage ? (
                            <>
                              <Loader2 className="size-4 animate-spin shrink-0" />
                              <span>Loading more...</span>
                            </>
                          ) : (
                            <span className="text-muted-foreground/70 text-[11px] uppercase tracking-wider">
                              End of list
                            </span>
                          )}
                        </div>
                      ) : (
                        <CommandItem
                          value={getValue(item)}
                          onSelect={() => {
                            onValueChange(getValue(item))
                            onSelectItem?.(item)
                            setOpen(false)
                          }}
                          disabled={getDisabled ? getDisabled(item) : false}
                          role="option"
                          aria-selected={value === getValue(item)}
                          className={cn(
                            'mx-1.5 flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 min-h-[42px]',
                            'hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
                            'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground',
                            'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50 data-[disabled=true]:line-through',
                            'transition-[background-color,color] duration-150 motion-reduce:transition-none',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover',
                            value === getValue(item) &&
                              'border-l-2 border-l-primary pl-[calc(0.75rem-2px)] bg-accent/80'
                          )}
                        >
                          <Tooltip delayDuration={400}>
                            <TooltipTrigger asChild>
                              <div
                                className="min-w-0 flex-1 truncate text-left text-sm"
                                tabIndex={-1}
                              >
                                {getLabel(item)}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="right"
                              sideOffset={8}
                              align="start"
                              className="max-w-[min(20rem,90vw)] border border-border bg-popover px-3 py-2 text-popover-foreground text-sm shadow-md"
                            >
                              {getLabel(item)}
                            </TooltipContent>
                          </Tooltip>
                          <Check
                            className={cn(
                              'size-4 shrink-0 text-primary transition-[transform,opacity] duration-200 motion-reduce:duration-0',
                              value === getValue(item)
                                ? 'opacity-100 scale-100'
                                : 'opacity-0 scale-75'
                            )}
                            aria-hidden
                          />
                        </CommandItem>
                      )}
                    </div>
                  )
                })}
              </div>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
