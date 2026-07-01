import { api } from '@/lib/api'

import type { UserFormValues } from '../schema'
import type { User, UsersQuery } from '../types'

export function listUsers(query: UsersQuery = {}): Promise<User[]> {
  const params = new URLSearchParams()
  if (query.search) params.set('search', query.search)
  const qs = params.toString()
  return api.get<User[]>(`/users${qs ? `?${qs}` : ''}`)
}

export function getUser(id: string): Promise<User> {
  return api.get<User>(`/users/${id}`)
}

export function createUser(input: UserFormValues): Promise<User> {
  return api.post<User>('/users', input)
}

export function updateUser(id: string, input: UserFormValues): Promise<User> {
  return api.put<User>(`/users/${id}`, input)
}

export function deleteUser(id: string): Promise<void> {
  return api.delete<void>(`/users/${id}`)
}
