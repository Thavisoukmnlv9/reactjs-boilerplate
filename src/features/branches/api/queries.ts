import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'

import { branchKeys, type BranchView, type Paginated } from './types'

export function useBranchesQuery() {
  return useQuery({
    queryKey: branchKeys.all,
    queryFn: () => apiClient.get<Paginated<BranchView>>(`${endpoints.branches.list}?limit=100`),
  })
}

export function useBranchQuery(id: string | undefined) {
  return useQuery({
    queryKey: branchKeys.one(id ?? ''),
    queryFn: () => apiClient.get<BranchView>(endpoints.branches.get(id ?? '')),
    enabled: !!id,
  })
}
