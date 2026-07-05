import { z } from 'zod'

/**
 * Client mirror of the backend role contract (role.schema.ts): name 1–80,
 * description ≤300, and at least one permission so a custom role always grants
 * something. Danger-zone codes are filtered out by the matrix, not here.
 */
export const roleFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80, 'Keep the name under 80 characters'),
  description: z.string().max(300, 'Keep the description under 300 characters'),
  permission_codes: z.array(z.string()).min(1, 'Grant at least one permission'),
})

export type RoleFormValues = z.infer<typeof roleFormSchema>
