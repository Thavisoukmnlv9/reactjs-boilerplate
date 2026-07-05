import { z } from 'zod'

/**
 * Client-side mirror of the backend invite/update contract (users.schema.ts):
 * email required + well-formed, name ≤120, staff note ≤500, a role is mandatory,
 * and the default branch must be one of the selected branches. Powers inline
 * validation so errors surface at the field instead of only as a toast on submit.
 */
export const userFormSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    name: z.string().max(120, 'Keep the name under 120 characters'),
    role_id: z.string().min(1, 'Select a role'),
    branch_ids: z.array(z.string()),
    default_branch_id: z.string(),
    staff_title: z.string().max(120, 'Keep the title under 120 characters'),
    staff_note: z.string().max(500, 'Keep notes under 500 characters'),
  })
  .refine((v) => !v.default_branch_id || v.branch_ids.includes(v.default_branch_id), {
    message: 'The default branch must be one of the selected branches',
    path: ['default_branch_id'],
  })

export type UserFormValues = z.infer<typeof userFormSchema>
