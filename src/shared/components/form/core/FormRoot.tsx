import type React from 'react'
import {
  type FieldValues,
  FormProvider as FormProviderReactHookForm,
  type UseFormReturn,
} from 'react-hook-form'
import { cx } from '../utils/cx'

type Props<T extends FieldValues> = {
  methods: UseFormReturn<T>
  onSubmit: (values: T) => void | Promise<void>
  className?: string
  children: React.ReactNode
  /**
   * When false, the form element ignores submit events (e.g. Enter in inputs or implicit submit buttons).
   * Call `methods.handleSubmit(onSubmit)()` from a `type="button"` click for explicit submits (e.g. "skip to submit" in a wizard).
   */
  allowFormSubmit?: boolean
}

export function FormProvider<T extends FieldValues>({
  methods,
  onSubmit,
  className,
  children,
  allowFormSubmit = true,
}: Props<T>) {
  return (
    <FormProviderReactHookForm {...methods}>
      <form
        onSubmit={(e) => {
          if (!allowFormSubmit) {
            e.preventDefault()
            return
          }
          void methods.handleSubmit(onSubmit)(e)
        }}
        className={cx('space-y-6', className)}
        noValidate
      >
        {children}
      </form>
    </FormProviderReactHookForm>
  )
}
