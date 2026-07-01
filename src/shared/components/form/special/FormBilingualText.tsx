import type React from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import { Field } from '../fields/Field'

type Props = {
  name: string
  loName?: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  placeholderEn?: string
  placeholderLo?: string
  rows?: number
  multiline?: boolean
  disabled?: boolean
}

export function FormBilingualText({
  name,
  loName,
  label,
  hint,
  requiredMark,
  placeholderEn = 'English',
  placeholderLo = 'ລາວ',
  rows = 3,
  multiline = false,
  disabled,
}: Props) {
  const { register } = useFormContext()
  const resolvedLoName = loName ?? `${name}_lo`

  const sharedProps = {
    autoComplete: 'off' as const,
    disabled,
  }

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div>
          <span className="mb-1 block text-muted-foreground text-xs">EN</span>
          {multiline ? (
            <Textarea
              id={name}
              rows={rows}
              placeholder={placeholderEn}
              {...register(name)}
              {...sharedProps}
            />
          ) : (
            <Input
              id={name}
              placeholder={placeholderEn}
              {...register(name)}
              {...sharedProps}
            />
          )}
        </div>
        <div>
          <span className="mb-1 block text-muted-foreground text-xs">ລາວ</span>
          {multiline ? (
            <Textarea
              id={resolvedLoName}
              rows={rows}
              placeholder={placeholderLo}
              lang="lo"
              {...register(resolvedLoName)}
              {...sharedProps}
            />
          ) : (
            <Input
              id={resolvedLoName}
              placeholder={placeholderLo}
              lang="lo"
              {...register(resolvedLoName)}
              {...sharedProps}
            />
          )}
        </div>
      </div>
    </Field>
  )
}
