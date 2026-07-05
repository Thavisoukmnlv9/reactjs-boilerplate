import { useMutation, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'
import { queryKeys } from '@/core/api/query-keys'
import type { BulkResult } from '@/shared/api/bulk'

import { type BulkPoliciesInput, policyKeys, type PolicyView, type PolicyWriteInput } from './types'

function useInvalidatePolicies() {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: policyKeys.all })
    void qc.invalidateQueries({ queryKey: queryKeys.me() }) // policies ride the /me payload
  }
}

export function useCreatePolicy() {
  const invalidate = useInvalidatePolicies()
  return useMutation({
    mutationFn: (input: PolicyWriteInput) => apiClient.post<PolicyView>(endpoints.policies.create, input),
    onSuccess: invalidate,
  })
}

export function useUpdatePolicy() {
  const qc = useQueryClient()
  const invalidate = useInvalidatePolicies()
  return useMutation({
    mutationFn: (vars: { id: string; data: Partial<PolicyWriteInput> }) =>
      apiClient.patch<PolicyView>(endpoints.policies.update(vars.id), vars.data),
    onSuccess: (_res, vars) => {
      invalidate()
      void qc.invalidateQueries({ queryKey: policyKeys.one(vars.id) })
    },
  })
}

export function useDeletePolicy() {
  const invalidate = useInvalidatePolicies()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(endpoints.policies.delete(id)),
    onSuccess: invalidate,
  })
}

export function useBulkPolicies() {
  const invalidate = useInvalidatePolicies()
  return useMutation({
    mutationFn: (input: BulkPoliciesInput) => apiClient.post<BulkResult>(endpoints.policies.bulk, input),
    onSuccess: invalidate,
  })
}
