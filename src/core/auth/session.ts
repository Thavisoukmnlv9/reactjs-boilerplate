import { apiClient } from '@/core/api/api-client'
import { endpoints } from '@/core/api/endpoints'

export const sessionService = {
  listSessions: () => apiClient.get(endpoints.auth.sessions),
  revokeSession: (id: string) =>
    apiClient.delete(`${endpoints.auth.sessions}/${id}`),
}
