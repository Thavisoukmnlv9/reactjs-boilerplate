import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/core/utils/cn'
import { Button } from '@/shared/components/ui/button'

export type WizardProgressFooterProps = {
  activeStep: number
  totalSteps: number
  isLoading?: boolean
  enableDraftPersistence: boolean
  /** Final-step submit label, e.g. "Create table" / "Save changes" (module-localized). */
  submitLabel: string
  /** Disable the final submit (e.g. a required field is still empty). */
  submitDisabled?: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  onCancel: () => void
  onSaveDraft: () => void
  onClearDraft: () => void
  /** Optional extra action beside the submit on the last step (e.g. "Save & add another"). */
  secondaryAction?: { label: string; onClick: () => void }
}

/**
 * Sticky wizard action bar: Back · Cancel | "Step N of M" + progress dots |
 * Save-draft + primary ("Continue" until the last step, then the submit label).
 * Generalized from the product form's `ProductWizardFooter`; generic chrome is
 * read from the shared `wizard.*` i18n namespace.
 */
export function WizardProgressFooter({
  activeStep,
  totalSteps,
  isLoading,
  enableDraftPersistence,
  submitLabel,
  submitDisabled,
  onPrevious,
  onNext,
  onSubmit,
  onCancel,
  onSaveDraft,
  onClearDraft,
  secondaryAction,
}: WizardProgressFooterProps) {
  const { t } = useTranslation()
  const isLastStep = activeStep >= totalSteps - 1
  const canGoBack = activeStep > 0

  return (
    <div className="sticky bottom-0 z-10 mt-2 border-t border-border/80 bg-background/85 pb-2 pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-2 flex items-center gap-1 sm:order-1">
          {canGoBack ? (
            <Button type="button" variant="outline" onClick={onPrevious}>
              {t('wizard.back')}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-muted-foreground"
          >
            {t('wizard.cancel')}
          </Button>
        </div>

        {totalSteps > 1 ? (
          <div className="order-1 flex flex-col items-center gap-1.5 sm:order-2">
            <span className="text-xs font-medium text-muted-foreground">
              {t('wizard.stepOf', {
                current: activeStep + 1,
                total: totalSteps,
              })}
            </span>
            <div className="flex items-center gap-1.5" aria-hidden>
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: decorative fixed-length progress dots
                  key={`wizard-dot-${i}`}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    i === activeStep
                      ? 'w-5 bg-primary'
                      : i < activeStep
                        ? 'w-1.5 bg-primary/40'
                        : 'w-1.5 bg-muted-foreground/20'
                  )}
                />
              ))}
            </div>
          </div>
        ) : null}

        <div className="order-3 flex items-center justify-end gap-2">
          {enableDraftPersistence ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={onSaveDraft}
            >
              {t('wizard.saveDraft')}
            </Button>
          ) : null}
          {!isLastStep ? (
            <Button type="button" onClick={onNext}>
              {t('wizard.continue')}
            </Button>
          ) : (
            <>
              {secondaryAction ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={secondaryAction.onClick}
                  disabled={isLoading}
                >
                  {secondaryAction.label}
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={onSubmit}
                disabled={isLoading || submitDisabled}
              >
                {isLoading ? (
                  t('wizard.saving')
                ) : (
                  <>
                    <Check className="mr-1.5 size-4" aria-hidden />
                    {submitLabel}
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {enableDraftPersistence ? (
        <div className="mt-1.5 flex justify-end">
          <button
            type="button"
            onClick={onClearDraft}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-destructive hover:underline"
          >
            {t('wizard.clearDraft')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
