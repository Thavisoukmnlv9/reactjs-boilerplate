import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface BranchState {
  branchId: string | null
  setBranchId: (id: string | null) => void
}

export const branchStore = create<BranchState>()(
  persist(
    (set) => ({
      branchId: null,
      setBranchId: (branchId) => set({ branchId }),
    }),
    { name: 'bs-branch' }
  )
)
