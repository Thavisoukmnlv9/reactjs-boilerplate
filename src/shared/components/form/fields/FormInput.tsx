import type React from 'react'
import { useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { Input } from '@/shared/components/ui/input'
import { Field } from './Field'

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  placeholder?: string
  requiredMark?: boolean
}

export function FormInput({
  name,
  label,
  hint,
  icon,
  placeholder,
  requiredMark,
  className,
  ...rest
}: Props) {
  const { register } = useFormContext()
  const inputEl = (
    <Input
      id={name}
      className={cn(icon && 'pl-9', className)}
      placeholder={placeholder}
      {...register(name)}
      {...rest}
    />
  )
  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      {icon ? (
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
          {inputEl}
        </div>
      ) : (
        inputEl
      )}
    </Field>
  )
}
