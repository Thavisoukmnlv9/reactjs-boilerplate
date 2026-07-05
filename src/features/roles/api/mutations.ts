import { useMutation, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'
import { queryKeys } from '@/core/api/query-keys'
import type { BulkResult } from '@/shared/api/bulk'

import type { BulkRolesInput, RoleView, RoleWriteInput } from './types'

/** Role changes can alter the editor's own effective permissions → also refetch /me. */
function useInvalidateRoles() {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: queryKeys.roles() })
    void qc.invalidateQueries({ queryKey: queryKeys.me() })
  }
}

export function useCreateRole() {
  const invalidate = useInvalidateRoles()
  return useMutation({
    mutationFn: (input: RoleWriteInput) => apiClient.post<RoleView>(endpoints.roles.create, input),
    onSuccess: invalidate,
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()
  const invalidate = useInvalidateRoles()
  return useMutation({
    mutationFn: (vars: { id: string; data: Partial<RoleWriteInput> }) =>
      apiClient.patch<RoleView>(endpoints.roles.update(vars.id), vars.data),
    onSuccess: (_res, vars) => {
      invalidate()
      void qc.invalidateQueries({ queryKey: queryKeys.role(vars.id) })
    },
  })
}

export function useDeleteRole() {
  const invalidate = useInvalidateRoles()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(endpoints.roles.delete(id)),
    onSuccess: invalidate,
  })
}

export function useBulkRoles() {
  const invalidate = useInvalidateRoles()
  return useMutation({
    mutationFn: (input: BulkRolesInput) => apiClient.post<BulkResult>(endpoints.roles.bulk, input),
    onSuccess: invalidate,
  })
}
