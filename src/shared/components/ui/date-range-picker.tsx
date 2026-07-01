import { endOfMonth, format, startOfMonth, subDays, subMonths } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/core/utils/cn'
import { Button } from './button'
import { Calendar } from './calendar'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export interface DateRange {
  from?: Date
  to?: Date
}

interface Props {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

interface Preset {
  label: string
  range: () => DateRange
}

const PRESETS: Preset[] = [
  {
    label: 'Today',
    range: () => {
      const now = new Date()
      return { from: now, to: now }
    },
  },
  {
    label: 'Last 7 days',
    range: () => ({ from: subDays(new Date(), 6), to: new Date() }),
  },
  {
    label: 'Last 30 days',
    range: () => ({ from: subDays(new Date(), 29), to: new Date() }),
  },
  {
    label: 'This month',
    range: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: 'Last month',
    range: () => {
      const prev = subMonths(new Date(), 1)
      return { from: startOfMonth(prev), to: endOfMonth(prev) }
    },
  },
  {
    label: 'Last 90 days',
    range: () => ({ from: subDays(new Date(), 89), to: new Date() }),
  },
]

/**
 * Date-range filter for list pages (audit log, reservations, orders).
 * Provides quick presets on the left rail + an inline two-month calendar
 * on the right. Replaces the previous ad-hoc free-text ISO inputs.
 */
export function DateRangePicker({
  value,
  onChange,
  placeholder = 'Pick a range',
  className,
  disabled,
}: Props) {
  const [open, setOpen] = useState(false)
  const display = value?.from
    ? value.to && +value.to !== +value.from
      ? `${format(value.from, 'MMM d')} – ${format(value.to, 'MMM d')}`
      : format(value.from, 'PPP')
    : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            'w-full justify-start gap-2 font-normal',
            !value?.from && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="size-4" />
          {display}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto gap-0 p-0" align="start">
        <div className="flex flex-col gap-1 border-r border-border p-2">
          {PRESETS.map((p) => (
            <Button
              key={p.label}
              type="button"
              variant="ghost"
              size="sm"
              className="justify-start"
              onClick={() => {
                onChange(p.range())
                setOpen(false)
              }}
            >
              {p.label}
            </Button>
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="justify-start text-muted-foreground"
            onClick={() => {
              onChange(undefined)
              setOpen(false)
            }}
          >
            Clear
          </Button>
        </div>
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={value as { from: Date | undefined; to: Date | undefined }}
          onSelect={(range) =>
            onChange(range ? { from: range.from, to: range.to } : undefined)
          }
        />
      </PopoverContent>
    </Popover>
  )
}
