import { zodResolver } from '@hookform/resolvers/zod'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { useFormWizard, type WizardStep } from '../use-form-wizard'

const schema = z.object({
  name: z.string().min(1, 'Name required'),
  email: z.union([z.string().email(), z.literal('')]),
  qty: z.number().min(1, 'Min 1'),
})
type Values = z.infer<typeof schema>

const STEPS: ReadonlyArray<WizardStep<Values>> = [
  { id: 'details', title: 'Details', fields: ['name', 'email'] },
  { id: 'qty', title: 'Quantity', fields: ['qty'] },
]

function renderWizard(opts?: {
  onSubmit?: (values: Values) => void
  draft?: { enabled: boolean; storageKey: string }
}) {
  const onSubmit = opts?.onSubmit ?? vi.fn()
  const view = renderHook(() => {
    const methods = useForm<Values>({
      resolver: zodResolver(schema),
      defaultValues: { name: '', email: '', qty: 0 },
    })
    const wizard = useFormWizard(methods, {
      steps: STEPS,
      onSubmit,
      makeDefaults: () => ({ name: '', email: '', qty: 0 }),
      draft: opts?.draft,
    })
    return { methods, wizard }
  })
  return { ...view, onSubmit }
}

describe('useFormWizard', () => {
  it('starts on the first step', () => {
    const { result } = renderWizard()
    expect(result.current.wizard.activeStep).toBe(0)
    expect(result.current.wizard.lastIndex).toBe(1)
    expect(result.current.wizard.canGoBack).toBe(false)
    expect(result.current.wizard.isLastStep).toBe(false)
    expect(result.current.wizard.stepperSteps).toHaveLength(2)
  })

  it('blocks advancing while the current step is invalid', async () => {
    const { result } = renderWizard()
    await act(async () => {
      await result.current.wizard.handleNext()
    })
    expect(result.current.wizard.activeStep).toBe(0)
  })

  it('advances when the current step is valid, ignoring later steps', async () => {
    const { result } = renderWizard()
    act(() => {
      result.current.methods.setValue('name', 'Latte')
    })
    // qty is still 0 (invalid) but it belongs to a later step, so Next proceeds.
    await act(async () => {
      await result.current.wizard.handleNext()
    })
    expect(result.current.wizard.activeStep).toBe(1)
    expect(result.current.wizard.isLastStep).toBe(true)
  })

  it('jumps to the first invalid step on submit and skips onSubmit', async () => {
    const { result, onSubmit } = renderWizard()
    act(() => {
      result.current.wizard.goToStep(1)
      result.current.methods.setValue('qty', 5)
    })
    await act(async () => {
      result.current.wizard.submitForm()
    })
    // name is still empty -> step 0 is the first invalid step.
    await waitFor(() => expect(result.current.wizard.activeStep).toBe(0))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits when every step is valid', async () => {
    const { result, onSubmit } = renderWizard()
    act(() => {
      result.current.methods.setValue('name', 'Latte')
      result.current.methods.setValue('qty', 2)
    })
    await act(async () => {
      result.current.wizard.submitForm()
    })
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
    expect(
      (onSubmit as ReturnType<typeof vi.fn>).mock.calls[0][0]
    ).toMatchObject({ name: 'Latte', qty: 2 })
  })

  it('flags a step with errored fields as error in stepperSteps', async () => {
    const { result } = renderWizard()
    await act(async () => {
      await result.current.methods.trigger('name')
    })
    expect(result.current.wizard.stepperSteps[0]?.state).toBe('error')
  })
})

describe('useFormWizard draft persistence', () => {
  const KEY = 'business-sync:test-wizard-draft'

  beforeEach(() => {
    localStorage.clear()
  })

  it('restores the persisted active step', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        values: { name: 'Saved' },
        activeStep: 1,
        stepperOrientation: 'horizontal',
        stepCount: 2,
        savedAt: 1,
      })
    )
    const { result } = renderWizard({
      draft: { enabled: true, storageKey: KEY },
    })
    expect(result.current.wizard.activeStep).toBe(1)
  })

  it('clears the draft and resets to the first step', () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ values: { name: 'Saved' }, activeStep: 1, stepCount: 2 })
    )
    const { result } = renderWizard({
      draft: { enabled: true, storageKey: KEY },
    })
    act(() => {
      result.current.wizard.handleClearDraft()
    })
    expect(localStorage.getItem(KEY)).toBeNull()
    expect(result.current.wizard.activeStep).toBe(0)
  })
})
