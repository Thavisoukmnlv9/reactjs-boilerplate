import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { queryKeys } from '@/core/api/query-keys'
import { branchStore } from '@/core/organization/branch-store'
import type { MeResponse } from '@/core/types/auth'
import { authService } from './auth-service'
import { authStore } from './auth-store'
import { tokenStorage } from './token'

/**
 * Keep the persisted active-branch selection consistent with the branches the
 * member may actually operate. Seeds the member's preferred (default) branch
 * when nothing is selected, and clears/repairs a stale selection (e.g. after an
 * org switch or a branch reassignment) so list filters never point at a branch
 * outside the member's scope.
 */
function syncBranchSelection(me: MeResponse) {
  const allowed = me.branches ?? []
  const current = branchStore.getState().branchId
  const isCurrentValid =
    current != null && allowed.some((b) => b.id === current)
  if (isCurrentValid) return
  const fallback =
    me.default_branch_id ?? (allowed.length === 1 ? allowed[0].id : null)
  if (fallback !== current) branchStore.getState().setBranchId(fallback)
}

/**
 * Fetch ``/me`` and mirror the result into the in-memory ``authStore``
 * so legacy ``authStore.getState().user`` consumers keep working.
 * TanStack Query is the source of truth — the store is a thin
 * read-mirror. Refetches on window focus pick up server-side permission
 * changes within ~30 s.
 */
export function useMe() {
  const query = useQuery({
    queryKey: queryKeys.me(),
    queryFn: authService.fetchMe,
    enabled: !!tokenStorage.getAccessToken(),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    const me = query.data
    if (!me) return
    authStore
      .getState()
      .setAuth(me.user, me.organization, me.permissions, me.entitlements)
    syncBranchSelection(me)
  }, [query.data])

  return query
}

export function useLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authService.login,
    onSuccess: async () => {
      const me = await authService.fetchMe()
      authStore
        .getState()
        .setAuth(me.user, me.organization, me.permissions, me.entitlements)
      syncBranchSelection(me)
      queryClient.setQueryData(queryKeys.me(), me)
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
