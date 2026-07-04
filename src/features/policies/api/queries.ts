import { useQuery } from '@tanstack/react-query'

import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'

import { policyKeys, type Paginated, type PolicyView } from './types'

export function usePoliciesQuery() {
  return useQuery({
    queryKey: policyKeys.all,
    queryFn: () => apiClient.get<Paginated<PolicyView>>(`${endpoints.policies.list}?limit=100`),
  })
}

export function usePolicyQuery(id: string | undefined) {
  return useQuery({
    queryKey: policyKeys.one(id ?? ''),
    queryFn: () => apiClient.get<PolicyView>(endpoints.policies.get(id ?? '')),
    enabled: !!id,
  })
}
