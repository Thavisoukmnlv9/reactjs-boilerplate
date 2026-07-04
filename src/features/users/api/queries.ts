import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'

import { userKeys, type MemberView, type Paginated } from './types'

export function useUsersQuery() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => apiClient.get<Paginated<MemberView>>(`${endpoints.users.list}?limit=100`),
  })
}

export function useUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: userKeys.one(id ?? ''),
    queryFn: () => apiClient.get<MemberView>(endpoints.users.get(id ?? '')),
    enabled: !!id,
  })
}
