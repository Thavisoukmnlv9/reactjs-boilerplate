import type React from 'react'
import { useFormContext } from 'react-hook-form'
import { Textarea } from '@/shared/components/ui/textarea'
import { Field } from './Field'

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  placeholder?: string
  rows?: number
}

export function FormRichText({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  placeholder,
  rows = 6,
}: Props) {
  const { register } = useFormContext()
  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        {...register(name)}
      />
    </Field>
  )
}
