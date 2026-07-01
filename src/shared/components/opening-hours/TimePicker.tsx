import { Clock } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/core/utils/cn'
import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

function parseTime(value: string): { hour: number; minute: number } {
  if (!value || !/^\d{1,2}:\d{2}$/.test(value)) {
    return { hour: 10, minute: 0 }
  }
  const [h, m] = value.split(':').map(Number)
  return {
    hour: Math.min(23, Math.max(0, h)),
    minute: Math.min(59, Math.max(0, m)),
  }
}

function formatTime(hour: number, minute: number): string {
  const h = Math.min(23, Math.max(0, hour))
  const m = Math.min(59, Math.max(0, minute))
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function to12h(hour24: number): { hour12: number; period: 'AM' | 'PM' } {
  if (hour24 === 0) return { hour12: 12, period: 'AM' }
  if (hour24 < 12) return { hour12: hour24, period: 'AM' }
  if (hour24 === 12) return { hour12: 12, period: 'PM' }
  return { hour12: hour24 - 12, period: 'PM' }
}

function from12h(hour12: number, period: 'AM' | 'PM'): number {
  if (period === 'AM') return hour12 === 12 ? 0 : hour12
  return hour12 === 12 ? 12 : hour12 + 12
}

const HOURS_12 = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as const
const MINUTES = Array.from({ length: 60 }, (_, i) => i)
const PERIODS: ('AM' | 'PM')[] = ['AM', 'PM']

export interface TimePickerProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
  /** Height of the scroll column in the dropdown */
  columnHeight?: number
}

export const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(
  (
    {
      value,
      onChange,
      disabled,
      placeholder = 'Select time',
      className,
      columnHeight = 180,
    },
    ref
  ) => {
    const { hour, minute } = parseTime(value)
    const { hour12, period } = to12h(hour)
    const [open, setOpen] = React.useState(false)

    const handleHour12 = (h: number) => {
      const h24 = from12h(h, period)
      onChange(formatTime(h24, minute))
    }
    const handleMinute = (m: number) => {
      onChange(formatTime(hour, m))
    }
    const handlePeriod = (p: 'AM' | 'PM') => {
      const h24 = from12h(hour12, p)
      onChange(formatTime(h24, minute))
    }

    const displayText =
      value && /^\d{1,2}:\d{2}$/.test(value) ? value : placeholder

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'h-9 min-w-[6rem] justify-between gap-1 border bg-background font-medium tabular-nums',
              'hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-ring',
              className
            )}
          >
            <span className="truncate">{displayText}</span>
            <Clock className="text-muted-foreground h-4 w-4 shrink-0 opacity-70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <div className="flex border-b bg-muted/40 px-3 py-2">
            <div className="flex items-center gap-1">
              <span className="rounded border border-primary/30 bg-primary/20 px-2 py-1 font-semibold text-primary">
                {String(hour12).padStart(2, '0')}
              </span>
              <span className="text-muted-foreground">:</span>
              <span className="rounded border border-primary/30 bg-primary/20 px-2 py-1 font-semibold text-primary">
                {String(minute).padStart(2, '0')}
              </span>
              <span className="rounded border border-primary/30 bg-primary/20 px-2 py-1 font-semibold text-primary">
                {period}
              </span>
            </div>
          </div>
          <div className="flex">
            <ScrollColumn
              height={columnHeight}
              items={HOURS_12.map((h) => ({ value: h, label: String(h) }))}
              selected={hour12}
              onSelect={handleHour12}
              ariaLabel="Hour"
            />
            <ScrollColumn
              height={columnHeight}
              items={MINUTES.map((m) => ({
                value: m,
                label: String(m).padStart(2, '0'),
              }))}
              selected={minute}
              onSelect={handleMinute}
              ariaLabel="Minute"
            />
            <ScrollColumn
              height={columnHeight}
              items={PERIODS.map((p) => ({ value: p, label: p }))}
              selected={period}
              onSelect={handlePeriod}
              ariaLabel="AM/PM"
            />
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)

TimePicker.displayName = 'TimePicker'

function ScrollColumn<T>({
  items,
  selected,
  onSelect,
  height,
  ariaLabel,
}: {
  items: { value: T; label: string }[]
  selected: T
  onSelect: (value: T) => void
  height: number
  ariaLabel: string
}) {
  const listRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = listRef.current
    if (!el) return
    const selectedEl = el.querySelector('[data-selected=true]')
    selectedEl?.scrollIntoView({ block: 'nearest', behavior: 'auto' })
  }, [selected])

  return (
    <div
      role="listbox"
      aria-label={ariaLabel}
      className="overflow-y-auto overscroll-contain"
      style={{ maxHeight: height }}
      ref={listRef}
    >
      {items.map((item) => {
        const isSelected = item.value === selected
        return (
          <button
            key={String(item.value)}
            type="button"
            role="option"
            aria-selected={isSelected}
            data-selected={isSelected}
            className={cn(
              'flex w-12 items-center justify-center py-2 text-sm outline-none transition-colors',
              'hover:bg-accent focus:bg-accent',
              isSelected
                ? 'bg-primary text-primary-foreground font-semibold'
                : 'text-foreground'
            )}
            onClick={() => onSelect(item.value)}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
