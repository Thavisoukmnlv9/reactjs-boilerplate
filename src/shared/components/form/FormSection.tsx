/**
 * `<FormSection>` — opinionated grouping primitive for create/edit forms.
 *
 * Replaces ad-hoc `<Card><CardHeader>…<CardContent>…</CardContent></Card>` patterns
 * scattered through the codebase. Provides title + optional description + optional icon
 * + actions slot. Body content goes in `children`.
 *
 * Typical usage in a form:
 *
 *   <FormSection title="Identity" description="How this supplier appears across the app.">
 *     <FormInput name="name" label="Display name" required />
 *     <FormInput name="legal_name" label="Legal name" />
 *   </FormSection>
 */

import type React from 'react'
import { cn } from '@/core/utils/cn'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

export type FormSectionProps = {
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  actions?: React.ReactNode
  dense?: boolean
  className?: string
  bodyClassName?: string
  children: React.ReactNode
}

export function FormSection({
  title,
  description,
  icon,
  actions,
  dense,
  className,
  bodyClassName,
  children,
}: FormSectionProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0 pb-4">
        <div className="flex min-w-0 items-start gap-3">
          {icon ? (
            <span
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-4"
              aria-hidden
            >
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <CardTitle className="truncate font-medium text-base">
              {title}
            </CardTitle>
            {description ? (
              <p className="mt-1 text-muted-foreground text-sm">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </CardHeader>
      <CardContent
        className={cn(
          dense ? 'flex flex-col gap-4' : 'grid gap-4 sm:grid-cols-2',
          bodyClassName
        )}
      >
        {children}
      </CardContent>
    </Card>
  )
}
