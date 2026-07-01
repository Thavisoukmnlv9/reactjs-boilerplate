import type { UsersQuery } from '../types'

/** Hierarchical, invalidation-friendly query keys for the users feature. */
export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (query: UsersQuery) => [...usersKeys.lists(), query] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
}
