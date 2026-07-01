import * as React from 'react'
import {
  type FieldErrors,
  type FieldValues,
  type UseFormReturn,
  useFormState,
} from 'react-hook-form'

import { stripFilesDeep, useFormDraft } from '@/shared/hooks/use-form-draft'

import type { FormStepperStep, FormStepperStepState } from './form-stepper'

/**
 * A single wizard step. `title` is already localized by the caller, and
 * `fields` lists the top-level form fields this step owns — driving per-step
 * validation (`trigger`) and the reactive `complete`/`error` badge.
 */
export type WizardStep<TValues extends FieldValues> = {
  id: string
  title: string
  optional?: boolean
  fields: ReadonlyArray<keyof TValues>
}

export type UseFormWizardOptions<TValues extends FieldValues> = {
  /** Ordered steps, each owning its field set. */
  steps: ReadonlyArray<WizardStep<TValues>>
  /** Called with the validated values on a successful final submit. */
  onSubmit: (values: TValues) => void | Promise<void>
  /** Fresh blank form state — used to reset the form when a draft is cleared. */
  makeDefaults?: () => TValues
  /** Create-mode draft autosave. Omit (or set `enabled: false`) to disable. */
  draft?: {
    enabled: boolean
    storageKey: string
    /** Transform before persisting. Defaults to `stripFilesDeep` (File-safe). */
    serialize?: (values: unknown) => unknown
    debounceMs?: number
  }
}

export type FormWizardHandle = {
  activeStep: number
  lastIndex: number
  isLastStep: boolean
  canGoBack: boolean
  enableDraftPersistence: boolean
  /** Steps decorated with reactive `complete`/`error` state for `<FormStepper>`. */
  stepperSteps: FormStepperStep[]
  goToStep: (index: number) => void
  /** Validate the current step's fields, then advance if they pass. */
  handleNext: () => Promise<void>
  handlePrevious: () => void
  /** Validate the whole form; jump to the first invalid step, else submit. */
  submitForm: () => void
  /** Clear the saved draft and reset to a blank first step. */
  handleClearDraft: () => void
  /** Persist current values + step immediately (manual "Save draft"). */
  saveDraft: () => void
}

/**
 * Drives a multi-step form: active-step state, per-step `trigger()` gating
 * before advancing, reactive step badges, jump-to-first-invalid-step on a
 * failed submit, and create-mode draft autosave (via `useFormDraft`).
 *
 * The caller owns `useForm` and seeds `defaultValues` (including any restored
 * draft values via `readFormDraft`); this hook never writes field values except
 * to reset them on `handleClearDraft`. Generalizes the per-feature wizard hooks
 * (`useMenuFormWizard`, `useProductFormWizard`, `useInventoryForm`).
 */
export function useFormWizard<TValues extends FieldValues>(
  methods: UseFormReturn<TValues>,
  { steps, onSubmit, makeDefaults, draft }: UseFormWizardOptions<TValues>
): FormWizardHandle {
  const enableDraftPersistence = draft?.enabled ?? false
  const lastIndex = Math.max(0, steps.length - 1)

  const draftHandle = useFormDraft(methods, {
    storageKey: draft?.storageKey ?? '__form_wizard_disabled__',
    stepCount: steps.length,
    enabled: enableDraftPersistence,
    debounceMs: draft?.debounceMs,
    serialize: draft?.serialize ?? stripFilesDeep,
  })

  const [activeStep, setActiveStep] = React.useState(
    () => draftHandle.initialActiveStep
  )

  const goToStep = React.useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(lastIndex, index))
      setActiveStep(clamped)
      draftHandle.setActiveStep(clamped)
    },
    [lastIndex, draftHandle]
  )

  const handlePrevious = React.useCallback(
    () => goToStep(activeStep - 1),
    [goToStep, activeStep]
  )

  // Validate the current step before advancing so errors surface next to the
  // field instead of in a wall at the end.
  const handleNext = React.useCallback(async () => {
    const fields = steps[activeStep]?.fields ?? []
    const valid =
      fields.length === 0
        ? true
        : await methods.trigger(fields as Parameters<typeof methods.trigger>[0])
    if (valid) goToStep(activeStep + 1)
  }, [steps, activeStep, methods, goToStep])

  // On a failed submit, jump to the first step that owns an errored field.
  const handleInvalidSubmit = React.useCallback(
    (formErrors: FieldErrors<TValues>) => {
      const firstBadStep = steps.findIndex((step) =>
        step.fields.some((field) => Boolean(formErrors[field]))
      )
      if (firstBadStep >= 0) goToStep(firstBadStep)
    },
    [steps, goToStep]
  )

  const submitForm = React.useCallback(() => {
    void methods.handleSubmit(
      (values) => onSubmit(values),
      handleInvalidSubmit
    )()
  }, [methods, onSubmit, handleInvalidSubmit])

  const handleClearDraft = React.useCallback(() => {
    if (makeDefaults) methods.reset(makeDefaults())
    setActiveStep(0)
    // Sync the draft's internal step ref to 0, then remove the key last so no
    // subsequent synchronous persist resurrects it.
    draftHandle.setActiveStep(0)
    draftHandle.clear()
  }, [draftHandle, makeDefaults, methods])

  const saveDraft = React.useCallback(() => draftHandle.save(), [draftHandle])

  const stepperSteps = useWizardStepperSteps(methods, steps, activeStep)

  return {
    activeStep,
    lastIndex,
    isLastStep: activeStep >= lastIndex,
    canGoBack: activeStep > 0,
    enableDraftPersistence,
    stepperSteps,
    goToStep,
    handleNext,
    handlePrevious,
    submitForm,
    handleClearDraft,
    saveDraft,
  }
}

/** Reactive per-step `complete`/`error` state for `<FormStepper>`. */
function useWizardStepperSteps<TValues extends FieldValues>(
  methods: UseFormReturn<TValues>,
  steps: ReadonlyArray<WizardStep<TValues>>,
  activeStep: number
): FormStepperStep[] {
  const { errors } = useFormState({ control: methods.control })
  return steps.map((step, index) => {
    const hasError = step.fields.some((field) => Boolean(errors[field]))
    const state: FormStepperStepState | undefined = hasError
      ? 'error'
      : index < activeStep
        ? 'complete'
        : undefined
    return { id: step.id, title: step.title, optional: step.optional, state }
  })
}
