import type { ReactNode } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Field } from '@/shared/components/form/fields/Field'
import { InfiniteCombobox } from '@/shared/components/ui/infinite-combobox'

type FormInfiniteComboboxProps<T> = {
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
  preloadQueryFn: (id: string) => Promise<T | null>
  getLabel: (item: T) => string
  getValue: (item: T) => string
  getDisabled?: (item: T) => boolean
  /** Fires with the chosen item on select (null on clear) — for syncing a dependent field. */
  onSelectItem?: (item: T | null) => void
  placeholder?: string
  className?: string
  clearable?: boolean
  disabled?: boolean
}

export function FormInfiniteCombobox<T>({
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
  getDisabled,
  onSelectItem,
  placeholder,
  className,
  clearable,
  disabled,
}: FormInfiniteComboboxProps<T>) {
  const { control } = useFormContext()

  const comboboxEl = (
    <Controller
      control={control}
      name={name as never}
      render={({ field }) => (
        <InfiniteCombobox<T>
          queryKey={queryKey}
          queryFn={queryFn}
          preloadQueryFn={preloadQueryFn}
          getLabel={getLabel}
          getValue={getValue}
          getDisabled={getDisabled}
          value={(field.value as string) ?? ''}
          onValueChange={field.onChange}
          onSelectItem={onSelectItem}
          placeholder={placeholder}
          className={className}
          clearable={clearable}
          disabled={disabled}
          icon={icon}
        />
      )}
    />
  )

  return (
    <Field name={name} label={label} hint={hint} requiredMark={requiredMark}>
      {comboboxEl}
    </Field>
  )
}
