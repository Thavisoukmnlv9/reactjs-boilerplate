import type * as React from 'react'
import { useTranslation } from 'react-i18next'

import { OverflowTooltip } from '@/shared/components/ui/overflow-tooltip'

export type WizardSummaryRow = { label: string; value: React.ReactNode }

export type WizardLiveSummaryProps = {
  /** Eyebrow title above the card. Defaults to t('wizard.preview'). */
  title?: string
  /** Optional media/tile block at the top (e.g. an image for visual entities). */
  media?: React.ReactNode
  /** Optional header block (name/status/price) rendered above the spec rows. */
  header?: React.ReactNode
  /** Label/value spec rows summarizing the form as it's filled in. */
  rows: WizardSummaryRow[]
}

/**
 * Sticky right-column live summary — a card that updates as the wizard is filled
 * in. Generalized from the product form's `ProductLivePreview`: feed it a media
 * tile + header for visual entities (menus, combos), or just `rows` for a
 * key-field summary on everything else. Read values via `useWatch()` in the
 * module's own summary component and pass them down.
 */
export function WizardLiveSummary({
  title,
  media,
  header,
  rows,
}: WizardLiveSummaryProps) {
  const { t } = useTranslation()
  return (
    <aside className="space-y-3 lg:sticky lg:top-4">
      <p className="text-eyebrow">{title ?? t('wizard.preview')}</p>
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        {media}
        <div className="space-y-3 p-4">
          {header}
          {rows.length > 0 ? (
            <dl className="space-y-0 text-xs">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 border-b border-border/60 py-1.5 last:border-0"
                >
                  <dt className="shrink-0 text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="min-w-0 text-right font-medium text-foreground">
                    <OverflowTooltip className="text-right">
                      {row.value}
                    </OverflowTooltip>
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
