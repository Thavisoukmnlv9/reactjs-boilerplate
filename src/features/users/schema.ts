import { z } from 'zod'

export const userFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  role: z.enum(['admin', 'member', 'viewer']),
})

export type UserFormValues = z.infer<typeof userFormSchema>
