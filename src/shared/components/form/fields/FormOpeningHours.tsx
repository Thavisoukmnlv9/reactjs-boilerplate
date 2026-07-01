import type React from 'react'
import { useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import type {
  OpeningHoursSchedule,
  OpeningHoursScheduleInput,
} from '@/shared/components/opening-hours'
import { OpeningHoursV2 } from '@/shared/components/opening-hours'
import { Field } from './Field'

export interface FormOpeningHoursProps {
  /** RHF field name for the hours object: { weekly_schedule: Record<day, { open?, close?, is_closed? }> } */
  name?: string
  /** Day keys to display (e.g. ["mon", "tue", "wed"]) */
  days: readonly string[]
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  className?: string
  disabled?: boolean
  defaultOpen?: string
  defaultClose?: string
}

const DEFAULT_NAME = 'hours'

export function FormOpeningHours({
  name = DEFAULT_NAME,
  days,
  label,
  hint,
  requiredMark,
  className,
  disabled,
  defaultOpen = '10:00',
  defaultClose = '21:00',
}: FormOpeningHoursProps) {
  const { watch, setValue } = useFormContext()

  const hours = watch(name) as
    | { weekly_schedule?: OpeningHoursScheduleInput }
    | undefined
  const weeklySchedule = hours?.weekly_schedule ?? {}

  const handleChange = useCallback(
    (weekly_schedule: OpeningHoursSchedule) => {
      setValue(
        name,
        { ...hours, weekly_schedule },
        {
          shouldDirty: true,
          shouldTouch: true,
        }
      )
    },
    [name, hours, setValue]
  )

  return (
    <Field
      name={name}
      label={label}
      hint={hint}
      requiredMark={requiredMark}
      className={className}
    >
      <OpeningHoursV2
        days={days}
        value={weeklySchedule}
        onChange={handleChange}
        disabled={disabled}
        defaultOpen={defaultOpen}
        defaultClose={defaultClose}
      />
    </Field>
  )
}
