import { useMutation, useQueryClient } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'

import { userKeys, type InviteInput, type InviteIssued, type MemberView, type UpdateInput } from './types'

function useInvalidateUsers() {
  const qc = useQueryClient()
  return () => void qc.invalidateQueries({ queryKey: userKeys.all })
}

export function useInviteUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: (input: InviteInput) => apiClient.post<InviteIssued>(endpoints.users.create, input),
    onSuccess: invalidate,
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: (vars: { id: string; data: UpdateInput }) =>
      apiClient.patch<MemberView>(endpoints.users.update(vars.id), vars.data),
    onSuccess: (_res, vars) => {
      invalidate()
      void qc.invalidateQueries({ queryKey: userKeys.one(vars.id) })
    },
  })
}

export function useRemoveUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: (id: string) => apiClient.delete<void>(endpoints.users.delete(id)),
    onSuccess: invalidate,
  })
}

export function useResendInvite() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: (id: string) => apiClient.post<InviteIssued>(endpoints.users.resendInvite(id)),
    onSuccess: invalidate,
  })
}
