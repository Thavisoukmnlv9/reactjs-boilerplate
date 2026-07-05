import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'
import { toQueryString } from '@/shared/table/table-url-state'

import { type BranchesListParams, type BranchStats, type BranchView, branchKeys, type Paginated } from './types'

export function useBranchesQuery(params: BranchesListParams = {}) {
  return useQuery({
    queryKey: branchKeys.list(params),
    queryFn: () =>
      apiClient.get<Paginated<BranchView>>(`${endpoints.branches.list}${toQueryString({ ...params })}`),
    placeholderData: keepPreviousData,
  })
}

export function useBranchStatsQuery() {
  return useQuery({
    queryKey: branchKeys.stats,
    queryFn: () => apiClient.get<BranchStats>(endpoints.branches.stats),
  })
}

export function useBranchQuery(id: string | undefined) {
  return useQuery({
    queryKey: branchKeys.one(id ?? ''),
    queryFn: () => apiClient.get<BranchView>(endpoints.branches.get(id ?? '')),
    enabled: !!id,
  })
}
