import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'
import { queryKeys } from '@/core/api/query-keys'

import type { Paginated, PermissionView, RoleView } from './types'

export function useRolesQuery() {
  return useQuery({
    queryKey: queryKeys.roles(),
    queryFn: () => apiClient.get<Paginated<RoleView>>(`${endpoints.roles.list}?limit=100`),
  })
}

export function useRoleQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.role(id ?? ''),
    queryFn: () => apiClient.get<RoleView>(endpoints.roles.get(id ?? '')),
    enabled: !!id,
  })
}

export function usePermissionsQuery() {
  return useQuery({
    queryKey: queryKeys.permissions(),
    queryFn: () => apiClient.get<PermissionView[]>('/roles/permissions'),
    staleTime: 5 * 60_000,
  })
}
