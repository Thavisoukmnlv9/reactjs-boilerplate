import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'
import { toQueryString } from '@/shared/table/table-url-state'

import {
  type Paginated,
  type PoliciesListParams,
  type PolicyConditionSchema,
  policyKeys,
  type PolicyStats,
  type PolicyView,
} from './types'

export function usePoliciesQuery(params: PoliciesListParams = {}) {
  return useQuery({
    queryKey: policyKeys.list(params),
    queryFn: () => apiClient.get<Paginated<PolicyView>>(`${endpoints.policies.list}${toQueryString({ ...params })}`),
    placeholderData: keepPreviousData,
  })
}

export function usePolicyStatsQuery() {
  return useQuery({
    queryKey: policyKeys.stats,
    queryFn: () => apiClient.get<PolicyStats>(endpoints.policies.stats),
  })
}

export function usePolicyConditionSchemaQuery() {
  return useQuery({
    queryKey: policyKeys.conditionSchema,
    queryFn: () => apiClient.get<PolicyConditionSchema>(endpoints.policies.conditionSchema),
    staleTime: 10 * 60_000,
  })
}

export function usePolicyQuery(id: string | undefined) {
  return useQuery({
    queryKey: policyKeys.one(id ?? ''),
    queryFn: () => apiClient.get<PolicyView>(endpoints.policies.get(id ?? '')),
    enabled: !!id,
  })
}
