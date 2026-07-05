import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'
import { toQueryString } from '@/shared/table/table-url-state'

import { userKeys, type MemberView, type Paginated, type UsersListParams, type UserStats } from './types'

export function useUsersQuery(params: UsersListParams = {}) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () =>
      apiClient.get<Paginated<MemberView>>(`${endpoints.users.list}${toQueryString({ ...params })}`),
    placeholderData: keepPreviousData,
  })
}

export function useUserStatsQuery() {
  return useQuery({
    queryKey: userKeys.stats,
    queryFn: () => apiClient.get<UserStats>(endpoints.users.stats),
  })
}

export function useUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.one(id ?? ''),
    queryFn: () => apiClient.get<MemberView>(endpoints.users.get(id ?? '')),
    enabled: !!id,
  })
}
