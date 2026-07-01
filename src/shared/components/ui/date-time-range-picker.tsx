'use client'

import { ChevronDownIcon } from 'lucide-react'
import { type ComponentProps, useId, useState } from 'react'
import { cn } from '@/core/utils/cn'
import { Button } from './button'
import { Calendar } from './calendar'
import { Input } from './input'
import { Label } from './label'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export type DateTimeRangePickerProps = {
  /** Selected calendar date (single). Rendered only when `showDate` is true. */
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  showDate?: boolean
  dateLabel?: string
  datePlaceholder?: string
  captionLayout?: ComponentProps<typeof Calendar>['captionLayout']
  /** Start time formatted for a native time input, e.g. "06:00" (or "06:00:00" with seconds). */
  from?: string
  onFromChange?: (value: string) => void
  /** End time formatted for a native time input, e.g. "11:00". */
  to?: string
  onToChange?: (value: string) => void
  fromLabel?: string
  toLabel?: string
  /** `<input type="time">` step. Pass "1" to include seconds. */
  step?: string
  id?: string
  disabled?: boolean
  className?: string
  'aria-invalid'?: boolean
}

// Hides the browser's native time-picker indicator so the field matches the
// rest of the design system.
const TIME_INPUT_CLASSES =
  'bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'

/**
 * Combined single-date picker and start/end time range, ported from
 * shadcn-studio's `date-picker-11`. Fully controlled so it can be driven by
 * form state — see `FormDateTimeRange` for the react-hook-form wrapper.
 */
export function DateTimeRangePicker({
  date,
  onDateChange,
  showDate = true,
  dateLabel = 'Date',
  datePlaceholder = 'Select date',
  captionLayout = 'dropdown',
  from,
  onFromChange,
  to,
  onToChange,
  fromLabel = 'From',
  toLabel = 'To',
  step,
  id,
  disabled,
  className,
  'aria-invalid': ariaInvalid,
}: DateTimeRangePickerProps) {
  const [open, setOpen] = useState(false)
  const generatedId = useId()
  const baseId = id ?? generatedId
  const dateId = `${baseId}-date`
  const fromId = `${baseId}-from`
  const toId = `${baseId}-to`

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {showDate ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor={dateId} className="px-1">
            {dateLabel}
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                id={dateId}
                disabled={disabled}
                aria-invalid={ariaInvalid}
                className="w-full justify-between font-normal"
              >
                {date ? date.toLocaleDateString() : datePlaceholder}
                <ChevronDownIcon className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                captionLayout={captionLayout}
                onSelect={(value) => {
                  onDateChange?.(value)
                  setOpen(false)
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      ) : null}

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor={fromId} className="px-1">
            {fromLabel}
          </Label>
          <Input
            type="time"
            id={fromId}
            step={step}
            value={from ?? ''}
            disabled={disabled}
            aria-invalid={ariaInvalid}
            onChange={(event) => onFromChange?.(event.target.value)}
            className={TIME_INPUT_CLASSES}
          />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label htmlFor={toId} className="px-1">
            {toLabel}
          </Label>
          <Input
            type="time"
            id={toId}
            step={step}
            value={to ?? ''}
            disabled={disabled}
            aria-invalid={ariaInvalid}
            onChange={(event) => onToChange?.(event.target.value)}
            className={TIME_INPUT_CLASSES}
          />
        </div>
      </div>
    </div>
  )
}
