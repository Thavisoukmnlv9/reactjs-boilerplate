import { Paperclip, X } from 'lucide-react'
import type React from 'react'
import { useRef } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button } from '@/shared/components/ui/button'
import { useFieldError } from '../core/useFieldError'
import { Field } from './Field'

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  requiredMark?: boolean
  disabled?: boolean
  accept?: string
  maxSizeMb?: number
  buttonLabel?: string
}

export function FormFileUpload({
  name,
  label,
  hint,
  requiredMark,
  disabled,
  accept,
  maxSizeMb,
  buttonLabel = 'Choose file',
}: Props) {
  const { control } = useFormContext()
  const error = useFieldError(name)
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => {
          const file = field.value as File | undefined | null
          const showLimitHint =
            maxSizeMb !== undefined &&
            (!file || file.size <= maxSizeMb * 1024 * 1024)
          return (
            <div>
              <input
                ref={inputRef}
                id={name}
                type="file"
                accept={accept}
                disabled={disabled}
                aria-invalid={Boolean(error)}
                className="hidden"
                onChange={(e) => {
                  const next = e.target.files?.[0]
                  if (
                    next &&
                    maxSizeMb !== undefined &&
                    next.size > maxSizeMb * 1024 * 1024
                  ) {
                    return
                  }
                  field.onChange(next ?? null)
                }}
              />
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  onClick={() => inputRef.current?.click()}
                >
                  <Paperclip className="mr-2 h-4 w-4" />
                  {buttonLabel}
                </Button>
                {file ? (
                  <div className="flex min-w-0 items-center gap-2 text-sm">
                    <span className="truncate" title={file.name}>
                      {file.name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        field.onChange(null)
                        if (inputRef.current) inputRef.current.value = ''
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
              {showLimitHint && !error ? (
                <p className="mt-1 text-muted-foreground text-xs">
                  Max {maxSizeMb}MB
                </p>
              ) : null}
            </div>
          )
        }}
      />
    </Field>
  )
}
