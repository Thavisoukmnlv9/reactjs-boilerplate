import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import type { UserFormValues } from '../schema'
import type { UsersQuery } from '../types'

import { usersKeys } from './query-keys'
import { createUser, deleteUser, getUser, listUsers, updateUser } from './users-api'

export function useUsers(query: UsersQuery = {}) {
  return useQuery({
    queryKey: usersKeys.list(query),
    queryFn: () => listUsers(query),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => getUser(id),
    enabled: Boolean(id),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UserFormValues) => createUser(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      toast.success('User created')
    },
  })
}

export function useUpdateUser(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UserFormValues) => updateUser(id, input),
    onSuccess: (user) => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      queryClient.setQueryData(usersKeys.detail(id), user)
      toast.success('User updated')
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      toast.success('User deleted')
    },
  })
}
