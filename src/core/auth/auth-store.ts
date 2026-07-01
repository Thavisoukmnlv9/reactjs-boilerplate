import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Organization, User } from '@/core/types/auth'
import { tokenStorage } from './token'

export interface EntitlementsFeature {
  code: string
  included: boolean
  limit: number | null
  is_addon: boolean
}

export interface Entitlements {
  modules: string[]
  limits: Record<string, number>
  /** Extended fields from the v2 /entitlements/me payload. Older callers (and
   *  the persisted partialize before v2 lands) can leave these unset. */
  features?: EntitlementsFeature[]
  status?: string | null
  plan_slug?: string | null
  plan_name?: string | null
  billing_interval?: string | null
  trial_end?: string | null
  current_period_end?: string | null
  cancel_at_period_end?: boolean
  grace_until?: string | null
}

interface AuthState {
  user: User | null
  organization: Organization | null
  permissions: string[]
  entitlements: Entitlements
  isAuthenticated: boolean
  isLoading: boolean
  setAuth: (
    user: User,
    org: Organization,
    permissions: string[],
    entitlements: AuthState['entitlements']
  ) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      permissions: [],
      entitlements: { modules: [], limits: {} },
      isAuthenticated: false,
      isLoading: true,
      setAuth: (user, organization, permissions, entitlements) =>
        set({
          user,
          organization,
          permissions,
          entitlements,
          isAuthenticated: true,
          isLoading: false,
        }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        tokenStorage.clear()
        set({
          user: null,
          organization: null,
          permissions: [],
          entitlements: { modules: [], limits: {} },
          isAuthenticated: false,
          isLoading: false,
        })
      },
    }),
    {
      name: 'bs-auth',
      /**
       * Audit deliverable (A07): never persist server-issued data into
       * localStorage. The user / organization snapshot used to live in
       * the partialize block and went stale on every permission change
       * (and survived removal from the org). Now the store is purely a
       * mirror of the TanStack Query cache; nothing is written to disk.
       *
       * If we ever want to restore a "guess" state before the first
       * /me roundtrip, restore ``isAuthenticated`` only.
       */
      partialize: () => ({}) as Partial<AuthState>,
    }
  )
)
