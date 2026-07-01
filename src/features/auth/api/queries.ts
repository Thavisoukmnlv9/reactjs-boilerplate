import { useMutation, useQueryClient } from '@tanstack/react-query'

import { queryKeys } from '@/lib/api'
import { useAuthStore } from '@/lib/auth'

import { login } from './auth-api'

export function useLogin() {
  const queryClient = useQueryClient()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setUser(data.user)
      queryClient.setQueryData(queryKeys.auth.me, data.user)
    },
  })
}
