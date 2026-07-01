import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Input } from '@/shared/components/ui/input'
import { useFieldError } from '../core/useFieldError'
import { Field } from './Field'

type TimeRangeValue = { start?: string; end?: string } | undefined

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  startLabel?: string
  endLabel?: string
}

export function FormTimeRange({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  startLabel = 'Start',
  endLabel = 'End',
}: Props) {
  const { control } = useFormContext()
  const error = useFieldError(name)

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const value = (field.value as TimeRangeValue) ?? {}
          const setPart = (key: 'start' | 'end', v: string) =>
            field.onChange({ ...value, [key]: v })
          return (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="mb-1 block text-muted-foreground text-xs">
                  {startLabel}
                </span>
                <Input
                  id={`${name}-start`}
                  type="time"
                  value={value.start ?? ''}
                  disabled={disabled}
                  aria-invalid={Boolean(error)}
                  onChange={(e) => setPart('start', e.target.value)}
                />
              </div>
              <div>
                <span className="mb-1 block text-muted-foreground text-xs">
                  {endLabel}
                </span>
                <Input
                  id={`${name}-end`}
                  type="time"
                  value={value.end ?? ''}
                  disabled={disabled}
                  aria-invalid={Boolean(error)}
                  onChange={(e) => setPart('end', e.target.value)}
                />
              </div>
            </div>
          )
        }}
      />
    </Field>
  )
}
