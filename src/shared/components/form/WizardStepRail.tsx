import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/core/utils/cn'
import { Badge } from '@/shared/components/ui/badge'

import type { FormStepperStep } from './form-stepper'

export type WizardStepRailProps = {
  steps: readonly FormStepperStep[]
  activeIndex: number
  onStepChange: (index: number) => void
  ariaLabel?: string
  /** Label for the "Optional" badge on optional steps. Defaults to t('wizard.optional'). */
  optionalLabel?: string
  /** Optional helper card rendered below the step list. */
  helper?: { title: string; hint?: string }
}

/**
 * Sticky left-column step rail — a vertical, clickable list of wizard steps with
 * number/check/error indicators, plus an optional helper card. Generalized from
 * the product form's `ProductStepRail` so it slots into the shared `WizardShell`
 * grid alongside the form cards and the live summary.
 */
export function WizardStepRail({
  steps,
  activeIndex,
  onStepChange,
  ariaLabel,
  optionalLabel,
  helper,
}: WizardStepRailProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-4 lg:sticky lg:top-4">
      <nav
        aria-label={ariaLabel ?? t('wizard.steps')}
        className="space-y-1 rounded-xl border border-border/80 bg-muted/20 p-2"
      >
        {steps.map((step, index) => (
          <RailStep
            key={step.id}
            step={step}
            index={index}
            isActive={index === activeIndex}
            optionalLabel={optionalLabel ?? t('wizard.optional')}
            onSelect={() => onStepChange(index)}
          />
        ))}
      </nav>

      {helper ? (
        <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
          <p className="text-sm font-medium text-foreground">{helper.title}</p>
          {helper.hint ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {helper.hint}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function RailStep({
  step,
  index,
  isActive,
  optionalLabel,
  onSelect,
}: {
  step: FormStepperStep
  index: number
  isActive: boolean
  optionalLabel: string
  onSelect: () => void
}) {
  const isError = step.state === 'error'
  const isComplete = step.state === 'complete'
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive ? 'step' : undefined}
      aria-invalid={isError || undefined}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
        isActive
          ? 'bg-background font-medium text-foreground shadow-sm ring-1 ring-border'
          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
        isComplete && !isActive && 'text-foreground/80',
        isError && !isActive && 'text-destructive'
      )}
    >
      <span
        className={cn(
          'flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
          isError && 'bg-destructive text-destructive-foreground',
          !isError && isActive && 'bg-primary text-primary-foreground',
          !isError &&
            !isActive &&
            isComplete &&
            'bg-emerald-600 text-white dark:bg-emerald-500',
          !isError &&
            !isActive &&
            !isComplete &&
            'bg-muted-foreground/15 text-muted-foreground'
        )}
        aria-hidden
      >
        {isComplete && !isError ? <Check className="size-3.5" /> : index + 1}
      </span>
      <span className="min-w-0 flex-1 truncate">{step.title}</span>
      {step.optional ? (
        <Badge variant="muted" size="sm" className="shrink-0 font-normal">
          {optionalLabel}
        </Badge>
      ) : null}
    </button>
  )
}
