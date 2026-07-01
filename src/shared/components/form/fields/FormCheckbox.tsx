import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Field } from './Field'

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  requiredMark?: boolean
}

export function FormCheckbox({ name, label, hint, icon, requiredMark }: Props) {
  const { control } = useFormContext()
  return (
    <Field name={name} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name as any}
        render={({ field }) => (
          <label
            htmlFor={name}
            className="flex cursor-pointer items-center gap-2"
          >
            <Checkbox
              id={name}
              checked={!!field.value}
              onCheckedChange={(v: boolean) => field.onChange(v)}
            />
            {icon ? (
              <span className="flex shrink-0 text-muted-foreground [&_svg]:size-4">
                {icon}
              </span>
            ) : null}
            <span className="select-none text-sm">{label}</span>
          </label>
        )}
      />
    </Field>
  )
}
