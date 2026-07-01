/**
 * Cross-cutting query keys. Feature-local keys live next to their feature
 * (e.g. src/features/users/api/query-keys.ts) so slices stay self-contained.
 */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
} as const
