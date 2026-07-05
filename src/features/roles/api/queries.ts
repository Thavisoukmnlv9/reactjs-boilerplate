import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'
import { queryKeys } from '@/core/api/query-keys'
import { toQueryString } from '@/shared/table/table-url-state'

import { type Paginated, type PermissionView, type RolesListParams, roleKeys, type RoleStats, type RoleView } from './types'

export function useRolesQuery(params: RolesListParams = {}) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => apiClient.get<Paginated<RoleView>>(`${endpoints.roles.list}${toQueryString({ ...params })}`),
    placeholderData: keepPreviousData,
  })
}

export function useRoleStatsQuery() {
  return useQuery({
    queryKey: roleKeys.stats,
    queryFn: () => apiClient.get<RoleStats>(endpoints.roles.stats),
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
