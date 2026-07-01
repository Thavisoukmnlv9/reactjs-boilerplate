/**
 * `useFormDraft` — persist an in-progress form to localStorage so users can
 * resume after refresh or navigating away.
 *
 * Extracted from `pos/shop/products/api/shop-product-draft-storage.ts` (still in
 * place for product-specific value migration). Anything that doesn't need custom
 * field reshaping should use this hook directly.
 *
 * Usage:
 *
 *   const methods = useForm<FormValues>({ defaultValues, resolver })
 *   const draft = useFormDraft(methods, {
 *     storageKey: 'business-sync:shop-supplier-create',
 *     debounceMs: 600,
 *     stepCount: STEPS.length,
 *     enabled: mode === 'create',
 *   })
 *
 *   const [activeStep, setActiveStep] = useState(draft.initialActiveStep)
 *   useEffect(() => { draft.setActiveStep(activeStep) }, [activeStep, draft])
 *
 *   // Clear after a successful submit:
 *   onSuccess: () => draft.clear()
 */
import * as React from 'react'
import type { FieldValues, UseFormReturn } from 'react-hook-form'

export type FormDraftOrientation = 'horizontal' | 'vertical'

export type PersistedDraft<TValues> = {
  values: Partial<TValues>
  activeStep: number
  stepperOrientation: FormDraftOrientation
  stepCount: number
  savedAt: number
}

export type UseFormDraftOptions = {
  /** Required. localStorage key — namespace per resource to avoid collision. */
  storageKey: string
  /** Total step count for clamping. Defaults to 1 (no clamping). */
  stepCount?: number
  /** Debounce write to localStorage. Defaults to 600 ms. */
  debounceMs?: number
  /** Disable persistence entirely (e.g. edit mode). Defaults to true. */
  enabled?: boolean
  /** Stepper orientation default if no draft. Defaults to 'horizontal'. */
  defaultOrientation?: FormDraftOrientation
  /**
   * Transform values right before persisting — e.g. `stripFilesDeep` to drop
   * `File` instances that can't be JSON-serialized. Defaults to identity, so
   * existing primitive-only consumers are unaffected.
   */
  serialize?: (values: unknown) => unknown
}

export type FormDraftHandle = {
  /** Active step recovered from storage (clamped); 0 if none. */
  initialActiveStep: number
  /** Stepper orientation recovered from storage; default if none. */
  initialOrientation: FormDraftOrientation
  /** Update the persisted active step. */
  setActiveStep: (step: number) => void
  /** Update the persisted stepper orientation. */
  setOrientation: (orientation: FormDraftOrientation) => void
  /** Clear the draft from storage. */
  clear: () => void
  /** Persist current values + active step immediately (e.g. a manual "Save draft"). */
  save: () => void
  /** Returns the raw persisted blob (e.g. to inspect or migrate). */
  read: () => PersistedDraft<unknown> | null
}

function readDraft<T>(storageKey: string): PersistedDraft<T> | null {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedDraft<T>
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function writeDraft<T>(storageKey: string, draft: PersistedDraft<T>): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(draft))
  } catch {
    // ignore quota/permission errors
  }
}

function clearDraft(storageKey: string): void {
  try {
    localStorage.removeItem(storageKey)
  } catch {
    // ignore
  }
}

export function useFormDraft<TValues extends FieldValues>(
  methods: UseFormReturn<TValues>,
  options: UseFormDraftOptions
): FormDraftHandle {
  const {
    storageKey,
    stepCount = 1,
    debounceMs = 600,
    enabled = true,
    defaultOrientation = 'horizontal',
    serialize = (v) => v,
  } = options

  // Read once on mount. Re-reading on every render risks stale data overwriting in-progress edits.
  const initialRef = React.useRef<PersistedDraft<TValues> | null>(
    enabled ? readDraft<TValues>(storageKey) : null
  )

  const initial = initialRef.current
  const initialActiveStep =
    initial && typeof initial.activeStep === 'number'
      ? Math.max(0, Math.min(initial.activeStep, Math.max(0, stepCount - 1)))
      : 0
  const initialOrientation = initial?.stepperOrientation ?? defaultOrientation

  const stepRef = React.useRef(initialActiveStep)
  const orientationRef = React.useRef<FormDraftOrientation>(initialOrientation)

  const persist = React.useCallback(() => {
    if (!enabled) return
    writeDraft<TValues>(storageKey, {
      values: serialize(methods.getValues()) as Partial<TValues>,
      activeStep: stepRef.current,
      stepperOrientation: orientationRef.current,
      stepCount,
      savedAt: Date.now(),
    })
  }, [enabled, storageKey, methods, stepCount, serialize])

  // Debounced write on every form change.
  React.useEffect(() => {
    if (!enabled) return
    let t: ReturnType<typeof setTimeout> | undefined
    const sub = methods.watch(() => {
      if (t) clearTimeout(t)
      t = setTimeout(persist, debounceMs)
    })
    return () => {
      if (t) clearTimeout(t)
      sub.unsubscribe()
    }
  }, [enabled, methods, persist, debounceMs])

  const setActiveStep = React.useCallback(
    (step: number) => {
      stepRef.current = step
      persist()
    },
    [persist]
  )

  const setOrientation = React.useCallback(
    (orientation: FormDraftOrientation) => {
      orientationRef.current = orientation
      persist()
    },
    [persist]
  )

  const clear = React.useCallback(() => clearDraft(storageKey), [storageKey])

  const read = React.useCallback(
    () => readDraft<unknown>(storageKey),
    [storageKey]
  )

  return {
    initialActiveStep,
    initialOrientation,
    setActiveStep,
    setOrientation,
    clear,
    save: persist,
    read,
  }
}

/**
 * Shallow-merge a saved partial draft into a fresh defaults object. Use for
 * primitives-only forms; if your form has nested arrays or special types (Files,
 * Dates, etc.) write a feature-specific merge function instead.
 */
export function mergeDraft<TValues extends FieldValues>(
  defaults: TValues,
  saved: Partial<TValues> | undefined
): TValues {
  if (!saved || typeof saved !== 'object') return defaults
  return { ...defaults, ...saved }
}

/**
 * Read the persisted draft for `storageKey` outside of React — use this to seed
 * `defaultValues` before `useForm` is created (the value-restore half of the
 * draft flow; `useFormDraft` itself only restores active step + orientation).
 */
export function readFormDraft<T = unknown>(
  storageKey: string
): PersistedDraft<T> | null {
  return readDraft<T>(storageKey)
}

/** Remove the persisted draft for `storageKey` — call after a successful submit. */
export function clearFormDraft(storageKey: string): void {
  clearDraft(storageKey)
}

/**
 * Deep-strip `File` instances so a form's values are JSON-safe to persist.
 * Pass as `serialize` for any wizard whose steps include image/file uploads.
 */
export function stripFilesDeep(value: unknown): unknown {
  if (value instanceof File) return undefined
  if (Array.isArray(value)) return value.map(stripFilesDeep)
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const next = stripFilesDeep(v)
      if (next !== undefined) out[k] = next
    }
    return out
  }
  return value
}
