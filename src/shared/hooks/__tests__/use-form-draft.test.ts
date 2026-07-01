import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { mergeDraft, useFormDraft } from '../use-form-draft'

const STORAGE_KEY = 'business-sync:test-form-draft'

function makeMockMethods(initialValues: Record<string, unknown>) {
  return {
    getValues: vi.fn(() => initialValues),
    watch: vi.fn(() => ({ unsubscribe: vi.fn() })),
  } as unknown as Parameters<typeof useFormDraft>[0]
}

describe('useFormDraft', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('returns step 0 when no draft is saved', () => {
    const methods = makeMockMethods({ name: '' })
    const { result } = renderHook(() =>
      useFormDraft(methods, { storageKey: STORAGE_KEY, stepCount: 5 })
    )
    expect(result.current.initialActiveStep).toBe(0)
    expect(result.current.initialOrientation).toBe('horizontal')
  })

  it('reads back persisted activeStep on remount', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        values: { name: 'Foo' },
        activeStep: 2,
        stepperOrientation: 'vertical',
        stepCount: 5,
        savedAt: Date.now(),
      })
    )
    const methods = makeMockMethods({ name: 'Foo' })
    const { result } = renderHook(() =>
      useFormDraft(methods, { storageKey: STORAGE_KEY, stepCount: 5 })
    )
    expect(result.current.initialActiveStep).toBe(2)
    expect(result.current.initialOrientation).toBe('vertical')
  })

  it('clamps activeStep to stepCount on read', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        values: {},
        activeStep: 99,
        stepperOrientation: 'horizontal',
        stepCount: 3,
        savedAt: Date.now(),
      })
    )
    const methods = makeMockMethods({})
    const { result } = renderHook(() =>
      useFormDraft(methods, { storageKey: STORAGE_KEY, stepCount: 3 })
    )
    expect(result.current.initialActiveStep).toBe(2) // clamped to stepCount-1
  })

  it('clears the draft from storage', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ values: {}, activeStep: 1 })
    )
    const methods = makeMockMethods({})
    const { result } = renderHook(() =>
      useFormDraft(methods, { storageKey: STORAGE_KEY })
    )
    result.current.clear()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('skips reading when disabled', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        values: {},
        activeStep: 3,
        stepperOrientation: 'vertical',
      })
    )
    const methods = makeMockMethods({})
    const { result } = renderHook(() =>
      useFormDraft(methods, { storageKey: STORAGE_KEY, enabled: false })
    )
    expect(result.current.initialActiveStep).toBe(0)
    expect(result.current.initialOrientation).toBe('horizontal')
  })
})

describe('mergeDraft', () => {
  it('returns defaults when saved is undefined', () => {
    expect(mergeDraft({ a: 1 }, undefined)).toEqual({ a: 1 })
  })

  it('overlays saved keys on top of defaults', () => {
    expect(mergeDraft({ a: 1, b: 2 }, { b: 9 })).toEqual({ a: 1, b: 9 })
  })

  it('ignores non-object saved input', () => {
    expect(mergeDraft({ a: 1 }, null as unknown as { a?: number })).toEqual({
      a: 1,
    })
  })
})
