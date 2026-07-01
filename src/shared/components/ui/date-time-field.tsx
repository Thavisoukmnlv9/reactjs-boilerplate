import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/core/utils/cn'
import { Button } from './button'
import { Calendar } from './calendar'
import { Input } from './input'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

interface Props {
  value?: Date
  onChange: (next: Date | undefined) => void
  /** When true, render a 24h time input under the calendar. */
  showTime?: boolean
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  disabled?: boolean
  className?: string
}

/**
 * Single-date (+ optional time) picker. Calendar is locale-aware via the
 * underlying ``react-day-picker``; the display format is set in
 * ``date-fns``'s ``format`` so it follows the same locale.
 *
 * Mirrors the mobile ``<DateTimeField>`` shape so both apps speak the
 * same UX vocabulary.
 */
export function DateTimeField({
  value,
  onChange,
  showTime,
  minDate,
  maxDate,
  placeholder = 'Pick a date',
  disabled,
  className,
}: Props) {
  const [open, setOpen] = useState(false)
  const display = value
    ? format(value, showTime ? 'PPP p' : 'PPP')
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
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="size-4" />
          {display}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            if (!d) {
              onChange(undefined)
              return
            }
            const next = new Date(d)
            if (value && showTime) {
              next.setHours(value.getHours(), value.getMinutes(), 0, 0)
            }
            onChange(next)
            if (!showTime) setOpen(false)
          }}
          disabled={(d) =>
            (minDate ? d < minDate : false) || (maxDate ? d > maxDate : false)
          }
        />
        {showTime ? (
          <div className="border-t border-border p-3">
            <label className="block text-xs text-muted-foreground">
              Time
              <Input
                type="time"
                step={60}
                value={value ? format(value, 'HH:mm') : '12:00'}
                onChange={(e) => {
                  if (!value) return
                  const [hh, mm] = e.target.value.split(':').map(Number)
                  const next = new Date(value)
                  next.setHours(hh ?? 0, mm ?? 0, 0, 0)
                  onChange(next)
                }}
                className="mt-1"
              />
            </label>
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  )
}
