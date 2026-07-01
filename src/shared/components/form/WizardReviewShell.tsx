import { ChevronRight } from 'lucide-react'
import type * as React from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

export type WizardReviewSectionProps = {
  icon?: React.ReactNode
  title: string
  /** Jump back to the step that owns this section's fields. */
  onEdit?: () => void
  /** Localized label for the edit affordance, e.g. `t('…review.edit')`. */
  editLabel?: string
  children: React.ReactNode
}

/**
 * A read-only summary card for a wizard's final Review step: an uppercase
 * section header with an optional "Edit" jump, wrapping read-only content.
 * Generalizes the menu wizard's review-section pattern so complex module
 * wizards can compose a Review step without re-implementing the chrome.
 */
export function WizardReviewSection({
  icon,
  title,
  onEdit,
  editLabel,
  children,
}: WizardReviewSectionProps) {
  return (
    <Card className="overflow-hidden border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {icon}
          {title}
        </CardTitle>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-0.5 text-xs text-primary hover:underline"
          >
            {editLabel ?? 'Edit'}
            <ChevronRight className="h-3 w-3" aria-hidden />
          </button>
        ) : null}
      </CardHeader>
      <CardContent className="pt-0 pb-4">{children}</CardContent>
    </Card>
  )
}

export type WizardReviewRowProps = {
  label: string
  value: React.ReactNode
}

/** A label/value row for read-only review content. */
export function WizardReviewRow({ label, value }: WizardReviewRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  )
}
