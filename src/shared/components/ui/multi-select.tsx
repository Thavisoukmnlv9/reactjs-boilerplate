import { CheckIcon, ChevronDownIcon, XIcon } from 'lucide-react'
import type React from 'react'
import { useMemo, useState } from 'react'
import { cn } from '@/core/utils/cn'
import { Button } from './button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from './command'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export type MultiSelectOption = {
  value: string
  label: string
  disabled?: boolean
}

export type MultiSelectProps = {
  values: string[]
  onValuesChange: (next: string[]) => void
  options: MultiSelectOption[]
  /** Shown in the closed trigger when nothing is selected */
  placeholder?: string
  /** Short hint inside the dropdown search field (avoid long copy; it shares the panel width) */
  searchPlaceholder?: string
  disabled?: boolean
  clearable?: boolean
  className?: string
  maxViewportHeight?: number
  renderOptionLabel?: (opt: MultiSelectOption) => React.ReactNode
}

export function MultiSelect({
  values,
  onValuesChange,
  options,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  disabled = false,
  clearable = false,
  className,
  maxViewportHeight = 300,
  renderOptionLabel,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const valuesSet = useMemo(() => new Set(values ?? []), [values])
  const filtered = useMemo(() => {
    if (!query) return options
    const q = query.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(q))
  }, [options, query])

  const labelByValue = useMemo(() => {
    const m = new Map<string, string>()
    for (const o of options) m.set(o.value, o.label)
    return m
  }, [options])

  const triggerSummary = useMemo(() => {
    if (values.length === 0) return null
    const labels = values.map((v) => labelByValue.get(v) ?? v)
    if (labels.length === 1) return labels[0]
    if (labels.length === 2) return `${labels[0]}, ${labels[1]}`
    return `${labels[0]}, ${labels[1]} +${labels.length - 2} more`
  }, [values, labelByValue])

  const toggle = (v: string) => {
    const next = new Set(valuesSet)
    if (next.has(v)) next.delete(v)
    else next.add(v)
    onValuesChange(Array.from(next))
  }

  const handleClear = () => onValuesChange([])

  const handleOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setQuery('')
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA combobox + listbox for searchable multi-select
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          className={cn(
            'h-auto min-h-9 w-full justify-between gap-2 py-2 font-normal',
            values.length === 0 && 'text-muted-foreground',
            className
          )}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {triggerSummary ?? placeholder}
          </span>
          <div className="flex shrink-0 items-center gap-1">
            {clearable && values.length > 0 && (
              <button
                type="button"
                className="inline-flex rounded-sm opacity-50 hover:opacity-100"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
                aria-label="Clear selection"
              >
                <XIcon className="h-4 w-4 shrink-0" />
              </button>
            )}
            <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] max-w-[min(var(--radix-popover-trigger-width),calc(100vw-1.5rem))] p-0"
        align="start"
        side="bottom"
        sideOffset={6}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList
            className="max-h-[var(--radix-popover-content-height)]"
            style={
              {
                '--radix-popover-content-height': `${maxViewportHeight}px`,
              } as React.CSSProperties
            }
          >
            {filtered.length === 0 && query ? (
              <CommandEmpty>No results</CommandEmpty>
            ) : null}
            <div className="relative" style={{ minHeight: 4 }}>
              {filtered.map((opt) => {
                const isSelected = valuesSet.has(opt.value)
                return (
                  <CommandItem
                    key={opt.value}
                    disabled={opt.disabled}
                    onSelect={() => toggle(opt.value)}
                    className={cn(
                      isSelected &&
                        'bg-primary/10 font-medium text-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground'
                    )}
                  >
                    <div className="flex w-full min-w-0 items-center gap-2">
                      {renderOptionLabel ? (
                        renderOptionLabel(opt)
                      ) : (
                        <span className="min-w-0 flex-1 truncate">
                          {opt.label}
                        </span>
                      )}
                      {isSelected && (
                        <CheckIcon className="ml-auto size-4 shrink-0 text-primary" />
                      )}
                    </div>
                  </CommandItem>
                )
              })}
            </div>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
