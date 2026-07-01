import { Check } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'

export type WizardFooterLabels = {
  previous: string
  next: string
  cancel: string
  clearDraft: string
  /** Shown beside the autosave check when draft persistence is on. */
  autosave: string
  submitCreate: string
  submitEdit: string
  saving: string
}

export type WizardFooterProps = {
  mode: 'create' | 'edit'
  isLoading?: boolean
  enableDraftPersistence: boolean
  canGoBack: boolean
  isLastStep: boolean
  /** Disable the final submit (e.g. a required field is still empty). */
  submitDisabled?: boolean
  onPrevious: () => void
  onNext: () => void
  onSubmit: () => void
  onCancel: () => void
  onClearDraft: () => void
  labels: WizardFooterLabels
}

/**
 * Default sticky wizard footer for module wizards: an autosave note, Back/Next
 * navigation, and a primary action that becomes the submit on the last step,
 * plus draft controls. Mirrors the menu wizard footer. Modules with bespoke
 * needs (progress dots, submit-and-add-another) keep their own footer.
 */
export function WizardFooter({
  mode,
  isLoading,
  enableDraftPersistence,
  canGoBack,
  isLastStep,
  submitDisabled,
  onPrevious,
  onNext,
  onSubmit,
  onCancel,
  onClearDraft,
  labels,
}: WizardFooterProps) {
  return (
    <div className="sticky bottom-0 z-10 mt-2 border-t border-border/80 bg-background/85 pb-2 pt-3 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {enableDraftPersistence ? (
        <div className="mb-2 flex min-h-5 items-center gap-1.5 text-xs text-muted-foreground">
          <Check
            className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
          {labels.autosave}
        </div>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="text-muted-foreground"
          >
            {labels.cancel}
          </Button>
          {enableDraftPersistence ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={onClearDraft}
            >
              {labels.clearDraft}
            </Button>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {canGoBack ? (
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={onPrevious}
            >
              {labels.previous}
            </Button>
          ) : null}
          {!isLastStep ? (
            <Button type="button" className="w-full sm:w-auto" onClick={onNext}>
              {labels.next}
            </Button>
          ) : (
            <Button
              type="button"
              disabled={isLoading || submitDisabled}
              className="w-full sm:w-auto"
              onClick={onSubmit}
            >
              {isLoading
                ? labels.saving
                : mode === 'create'
                  ? labels.submitCreate
                  : labels.submitEdit}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
