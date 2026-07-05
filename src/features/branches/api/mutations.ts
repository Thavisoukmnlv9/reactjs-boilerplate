import { useMutation, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'
import { queryKeys } from '@/core/api/query-keys'
import type { BulkResult } from '@/shared/api/bulk'

import { type BulkBranchesInput, branchKeys, type BranchView, type BranchWriteInput } from './types'

function useInvalidateBranches() {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: branchKeys.all })
    void qc.invalidateQueries({ queryKey: queryKeys.me() }) // branches ride the /me payload
  }
}

export function useCreateBranch() {
  const invalidate = useInvalidateBranches()
  return useMutation({
    mutationFn: (input: BranchWriteInput) => apiClient.post<BranchView>(endpoints.branches.create, input),
    onSuccess: invalidate,
  })
}

export function useUpdateBranch() {
  const qc = useQueryClient()
  const invalidate = useInvalidateBranches()
  return useMutation({
    mutationFn: (vars: { id: string; data: Partial<BranchWriteInput> & { is_main?: boolean } }) =>
      apiClient.patch<BranchView>(endpoints.branches.update(vars.id), vars.data),
    onSuccess: (_res, vars) => {
      invalidate()
      void qc.invalidateQueries({ queryKey: branchKeys.one(vars.id) })
    },
  })
}

export function useDeleteBranch() {
  const invalidate = useInvalidateBranches()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(endpoints.branches.delete(id)),
    onSuccess: invalidate,
  })
}

export function useMakeMainBranch() {
  const invalidate = useInvalidateBranches()
  return useMutation({
    mutationFn: (id: string) => apiClient.patch<BranchView>(endpoints.branches.update(id), { is_main: true }),
    onSuccess: invalidate,
  })
}

export function useBulkBranches() {
  const invalidate = useInvalidateBranches()
  return useMutation({
    mutationFn: (input: BulkBranchesInput) => apiClient.post<BulkResult>(endpoints.branches.bulk, input),
    onSuccess: invalidate,
  })
}
