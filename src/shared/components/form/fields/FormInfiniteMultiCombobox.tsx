import type { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { cn } from '@/core/utils/cn'
import { Field } from '@/shared/components/form/fields/Field'
import { InfiniteMultiCombobox } from '@/shared/components/ui/infinite-multi-combobox'

type FormInfiniteMultiComboboxProps<T> = {
  name: string
  label?: ReactNode
  hint?: ReactNode
  icon?: ReactNode
  requiredMark?: boolean
  queryKey: Array<string>
  queryFn: (params: {
    search: string
    pageParam: number
  }) => Promise<{ items: Array<T>; nextPage: number | null }>
  preloadQueryFn: (ids: string[]) => Promise<Array<T>>
  getLabel: (item: T) => string
  getValue: (item: T) => string
  placeholder?: string
  className?: string
  clearable?: boolean
}

export function FormInfiniteMultiCombobox<T>({
  name,
  label,
  hint,
  icon,
  requiredMark,
  queryKey,
  queryFn,
  preloadQueryFn,
  getLabel,
  getValue,
  placeholder,
  className,
  clearable,
}: FormInfiniteMultiComboboxProps<T>) {
  const { control } = useFormContext()

  const comboboxEl = (
    <Controller
      control={control}
      name={name as never}
      render={({ field }) => (
        <InfiniteMultiCombobox<T>
          queryKey={queryKey}
          queryFn={queryFn}
          preloadQueryFn={preloadQueryFn}
          getLabel={getLabel}
          getValue={getValue}
          values={(field.value as string[]) ?? []}
          onValuesChange={field.onChange}
          placeholder={placeholder}
          className={className}
          clearable={clearable}
        />
      )}
    />
  )

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      {icon ? (
        <div className="relative w-full">
          <span className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {icon}
          </span>
          <div className={cn(icon && 'pl-9')}>{comboboxEl}</div>
        </div>
      ) : (
        comboboxEl
      )}
    </Field>
  )
}
