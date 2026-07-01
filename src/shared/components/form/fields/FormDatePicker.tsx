import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import type React from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { Button } from '@/shared/components/ui/button'
import { Calendar } from '@/shared/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'
import { Field } from './Field'

type Props = {
  name: string
  label?: React.ReactNode
  hint?: React.ReactNode
  icon?: React.ReactNode
  requiredMark?: boolean
  placeholder?: string
  disabled?: boolean
  className?: string
  captionLayout?:
    | 'label'
    | 'dropdown'
    | 'dropdown-months'
    | 'dropdown-years'
    | undefined
  fromYear?: number
  toYear?: number
}

export function FormDatePicker({
  name,
  label,
  hint,
  icon,
  requiredMark,
  placeholder = 'Pick a date',
  disabled = false,
  className,
  captionLayout,
  fromYear,
  toYear,
}: Props) {
  const { control } = useFormContext()

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      <Controller
        control={control}
        name={name as any}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id={name}
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !field.value && 'text-muted-foreground',
                  icon && 'pl-9',
                  className
                )}
                disabled={disabled}
              >
                {icon ? (
                  <span className="pointer-events-none mr-2 flex shrink-0 text-muted-foreground [&_svg]:size-4">
                    {icon}
                  </span>
                ) : (
                  <CalendarIcon className="mr-2 h-4 w-4" />
                )}
                {field.value ? (
                  format(field.value, 'PPP')
                ) : (
                  <span>{placeholder}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                autoFocus
                captionLayout={captionLayout}
                startMonth={fromYear ? new Date(fromYear, 0, 1) : undefined}
                endMonth={toYear ? new Date(toYear, 11, 31) : undefined}
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </Field>
  )
}
