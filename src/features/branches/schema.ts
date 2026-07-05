import { z } from 'zod'

import { BRANCH_CURRENCIES } from '@/features/branches/api/types'

const CODE_RE = /^[A-Za-z0-9-]{2,12}$/
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/**
 * Client mirror of the backend branch contract (branch.schema.ts): name required,
 * a 2–12 char alphanumeric code, well-formed email, and tax/service rates stored as
 * basis points (0–5000 = 0–50%). Empty strings are allowed for optional text and
 * normalised to null on submit.
 */
export const branchFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120, 'Keep the name under 120 characters'),
  code: z.string().refine((v) => v === '' || CODE_RE.test(v), 'Code must be 2–12 characters: A–Z, 0–9, hyphen'),
  vertical: z.string(),
  type: z.string().max(60, 'Keep the type under 60 characters'),
  phone: z.string().max(40, 'Keep the phone under 40 characters'),
  email: z.string().refine((v) => v === '' || EMAIL_RE.test(v), 'Enter a valid email address'),
  address: z.string().max(300, 'Keep the address under 300 characters'),
  timezone: z.string().min(1, 'Timezone is required'),
  currency_code: z.enum(BRANCH_CURRENCIES),
  locale: z.string().max(10),
  tax_rate_bps: z.number().int().min(0).max(5000),
  service_fee_bps: z.number().int().min(0).max(5000),
  prices_include_tax: z.boolean(),
  is_active: z.boolean(),
})

export type BranchFormValues = z.infer<typeof branchFormSchema>
