import { describe, expect, it, vi } from 'vitest'

describe('secureStorage', () => {
  it('returns null when localStorage is unavailable', () => {
    vi.resetModules()
    const original = globalThis.localStorage
    delete (globalThis as any).localStorage
    return import('@/core/security/secure-storage').then(
      ({ secureStorage }) => {
        expect(secureStorage.getString('k')).toBeNull()
        globalThis.localStorage = original
      }
    )
  })

  it('falls back to localStorage when secure-ls throws', async () => {
    vi.resetModules()
    vi.doMock('secure-ls', () => {
      return {
        default: class SecureLSMock {
          get() {
            throw new Error('boom')
          }
          set() {
            throw new Error('boom')
          }
          remove() {
            throw new Error('boom')
          }
        },
      }
    })

    const getItem = vi.fn(() => 'raw')
    const setItem = vi.fn()
    const removeItem = vi.fn()

    globalThis.localStorage = { getItem, setItem, removeItem } as any

    const { secureStorage } = await import('@/core/security/secure-storage')
    expect(secureStorage.getString('k')).toBe('raw')
    secureStorage.setString('k', 'v')
    secureStorage.remove('k')

    expect(getItem).toHaveBeenCalled()
    expect(setItem).toHaveBeenCalled()
    expect(removeItem).toHaveBeenCalled()
  })
})
