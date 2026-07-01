import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'
import { queryKeys } from '@/core/api/query-keys'
import { authStore } from '@/core/auth/auth-store'

export function useCurrentOrganization() {
  return useQuery({
    queryKey: queryKeys.organizations(),
    queryFn: () => apiClient.get(endpoints.organizations.current),
  })
}

export function useCurrentOrgId() {
  return authStore((s) => s.organization?.id)
}
