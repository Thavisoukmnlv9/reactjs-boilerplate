import { create } from 'zustand'

import type { AuthStatus, AuthUser } from './types'

interface AuthState {
  user: AuthUser | null
  status: AuthStatus
  setUser: (user: AuthUser | null) => void
  setStatus: (status: AuthStatus) => void
  reset: () => void
}

/**
 * Ephemeral auth state (never persisted — the token is the source of truth,
 * and the user snapshot is re-fetched from /auth/me on load).
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: 'idle',
  setUser: (user) => set({ user, status: user ? 'authenticated' : 'unauthenticated' }),
  setStatus: (status) => set({ status }),
  reset: () => set({ user: null, status: 'unauthenticated' }),
}))
