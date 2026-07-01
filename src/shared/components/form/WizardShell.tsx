import type * as React from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

import { cn } from '@/core/utils/cn'

import { FormProvider } from './core/FormRoot'

export type WizardShellProps<T extends FieldValues> = {
  methods: UseFormReturn<T>
  onSubmit: (values: T) => void | Promise<void>
  /** Left sticky step rail (e.g. `<WizardStepRail>`). Omit for single-step forms. */
  rail?: React.ReactNode
  /** Optional right sticky live-summary column (e.g. `<WizardLiveSummary>`). */
  summary?: React.ReactNode
  /** Sticky bottom action bar (e.g. `<WizardProgressFooter>`). */
  footer: React.ReactNode
  /** Active step content — the section cards. */
  children: React.ReactNode
}

/**
 * The products-style 3-column wizard layout: sticky step rail · active-step
 * cards · optional sticky live summary, with a sticky footer below. Native form
 * submit is disabled (`allowFormSubmit={false}`) — submit happens via the
 * footer's explicit handler so Enter never skips a step. Omit `summary` to get a
 * 2-column (rail + content) layout.
 */
export function WizardShell<T extends FieldValues>({
  methods,
  onSubmit,
  rail,
  summary,
  footer,
  children,
}: WizardShellProps<T>) {
  return (
    <FormProvider
      methods={methods}
      onSubmit={onSubmit}
      allowFormSubmit={false}
      className="min-w-0"
    >
      <div
        className={cn(
          'grid gap-6',
          rail
            ? summary
              ? 'lg:grid-cols-[210px_minmax(0,1fr)_300px]'
              : 'lg:grid-cols-[210px_minmax(0,1fr)]'
            : summary
              ? 'lg:grid-cols-[minmax(0,1fr)_300px]'
              : ''
        )}
      >
        {rail}
        <div className="min-w-0 space-y-6">{children}</div>
        {summary}
      </div>
      {footer}
    </FormProvider>
  )
}
