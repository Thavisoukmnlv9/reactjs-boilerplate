import type React from 'react'
import { Controller, useController, useFormContext } from 'react-hook-form'
import {
  DateTimeRangePicker,
  type DateTimeRangePickerProps,
} from '@/shared/components/ui/date-time-range-picker'
import { Field } from './Field'

type Props = {
  /** RHF field holding the start time string (e.g. "06:00"). */
  fromName: string
  /** RHF field holding the end time string (e.g. "11:00"). */
  toName: string
  /** Optional RHF field holding the selected `Date`. Enables the calendar with `showDate`. */
  dateName?: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  /** Show the single-date calendar above the time range (needs `dateName`). */
  showDate?: boolean
  fromLabel?: string
  toLabel?: string
  dateLabel?: string
  datePlaceholder?: string
  captionLayout?: DateTimeRangePickerProps['captionLayout']
  /** `<input type="time">` step. Pass "1" to capture seconds. */
  step?: string
}

/**
 * react-hook-form wrapper around `DateTimeRangePicker`. Binds the start/end
 * times to two scalar fields and, optionally, a `Date` field — so it drops into
 * existing schemas (e.g. a menu's `available_from` / `available_to`) without
 * reshaping their values.
 */
export function FormDateTimeRange({
  fromName,
  toName,
  dateName,
  label,
  hint,
  requiredMark,
  disabled,
  showDate = false,
  fromLabel,
  toLabel,
  dateLabel,
  datePlaceholder,
  captionLayout,
  step,
}: Props) {
  const { control } = useFormContext()
  const from = useController({ control, name: fromName })
  const to = useController({ control, name: toName })

  const withDate = showDate && Boolean(dateName)

  const renderPicker = (
    date: Date | undefined,
    onDateChange: ((date: Date | undefined) => void) | undefined
  ) => (
    <DateTimeRangePicker
      id={fromName}
      showDate={withDate}
      date={date}
      onDateChange={onDateChange}
      dateLabel={dateLabel}
      datePlaceholder={datePlaceholder}
      captionLayout={captionLayout}
      fromLabel={fromLabel}
      toLabel={toLabel}
      step={step}
      from={(from.field.value as string | undefined) ?? ''}
      onFromChange={from.field.onChange}
      to={(to.field.value as string | undefined) ?? ''}
      onToChange={to.field.onChange}
      disabled={disabled}
      aria-invalid={Boolean(from.fieldState.error || to.fieldState.error)}
    />
  )

  return (
    <Field
      name={fromName}
      label={label}
      hint={hint}
      requiredMark={requiredMark}
    >
      {withDate && dateName ? (
        <Controller
          control={control}
          name={dateName}
          render={({ field }) =>
            renderPicker(field.value as Date | undefined, field.onChange)
          }
        />
      ) : (
        renderPicker(undefined, undefined)
      )}
    </Field>
  )
}
