import { Check } from 'lucide-react'
import type * as React from 'react'

import { cn } from '@/core/utils/cn'

/** Visual status for a step beyond active/upcoming. Opt-in; omit for default numbering. */
export type FormStepperStepState = 'complete' | 'error'

export type FormStepperStep = {
  id: string
  title: string
  /** Renders an "Optional" sublabel and softens the required affordance. */
  optional?: boolean
  /** Drives the indicator: green check when complete, destructive ring on error. */
  state?: FormStepperStepState
}

type FormStepperProps = {
  orientation: 'horizontal' | 'vertical'
  steps: readonly FormStepperStep[]
  activeIndex: number
  onStepChange: (index: number) => void
  children: React.ReactNode
}

/** Step indicator badge — shared between orientations so states stay consistent. */
function StepIndicator({
  index,
  isActive,
  state,
  size = 'md',
}: {
  index: number
  isActive: boolean
  state?: FormStepperStepState
  size?: 'sm' | 'md'
}) {
  const isError = state === 'error'
  const isComplete = state === 'complete'
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold transition-colors',
        size === 'md' ? 'h-6 w-6 text-xs' : 'h-5 w-5 text-[10px]',
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
    >
      {isComplete && !isError ? (
        <Check
          className={size === 'md' ? 'h-3.5 w-3.5' : 'h-3 w-3'}
          aria-hidden
        />
      ) : (
        index + 1
      )}
    </span>
  )
}

export function FormStepper({
  orientation,
  steps,
  activeIndex,
  onStepChange,
  children,
}: FormStepperProps) {
  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-10">
        <nav
          aria-label="Form steps"
          className="w-full shrink-0 space-y-1 rounded-xl border border-border/80 bg-muted/20 p-2 lg:w-56"
        >
          {steps.map((step, index) => {
            const isActive = index === activeIndex
            const isError = step.state === 'error'
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onStepChange(index)}
                aria-current={isActive ? 'step' : undefined}
                aria-invalid={isError || undefined}
                className={cn(
                  'flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                  isActive
                    ? 'bg-background font-medium text-foreground shadow-sm ring-1 ring-border'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                  step.state === 'complete' &&
                    !isActive &&
                    'text-foreground/80',
                  isError && !isActive && 'text-destructive'
                )}
              >
                <StepIndicator
                  index={index}
                  isActive={isActive}
                  state={step.state}
                />
                <span className="min-w-0 leading-snug">
                  <span className="block">{step.title}</span>
                  {step.optional ? (
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                      Optional
                    </span>
                  ) : null}
                </span>
              </button>
            )
          })}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <nav
        aria-label="Form steps"
        className="flex flex-wrap gap-2 overflow-x-auto border-b border-border/80 pb-4"
      >
        {steps.map((step, index) => {
          const isActive = index === activeIndex
          const isError = step.state === 'error'
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepChange(index)}
              aria-current={isActive ? 'step' : undefined}
              aria-invalid={isError || undefined}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors',
                isActive
                  ? 'border-primary bg-primary/10 font-medium text-primary'
                  : 'border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
                step.state === 'complete' &&
                  !isActive &&
                  'border-emerald-500/30 bg-emerald-500/5 text-emerald-800 dark:text-emerald-300',
                isError &&
                  !isActive &&
                  'border-destructive/40 bg-destructive/5 text-destructive'
              )}
            >
              <StepIndicator
                index={index}
                isActive={isActive}
                state={step.state}
                size="sm"
              />
              {step.title}
            </button>
          )
        })}
      </nav>
      {children}
    </div>
  )
}
