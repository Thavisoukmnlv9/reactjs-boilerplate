import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Field } from './Field'

export type RadioOption = {
  label: React.ReactNode
  value: string
  disabled?: boolean
}

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  requiredMark?: boolean
  options: RadioOption[]
  className?: string
}

export function FormRadio({
  name,
  label,
  hint,
  icon,
  requiredMark,
  options,
  className,
}: Props) {
  const { control } = useFormContext()
  return (
    <Field
      name={name}
      label={label}
      hint={hint}
      requiredMark={requiredMark}
      className={className}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-start gap-2">
            {icon ? (
              <span className="mt-0.5 flex shrink-0 text-muted-foreground [&_svg]:size-4">
                {icon}
              </span>
            ) : null}
            <RadioGroup
              value={field.value ?? ''}
              onValueChange={field.onChange}
              className="flex-1"
            >
              <div className="grid gap-2">
                {options.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-2"
                    htmlFor={`${name}-${opt.value}`}
                  >
                    <RadioGroupItem
                      value={opt.value}
                      id={`${name}-${opt.value}`}
                      disabled={opt.disabled}
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </RadioGroup>
          </div>
        )}
      />
    </Field>
  )
}
