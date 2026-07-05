import type { TFunction } from 'i18next'
import { z } from 'zod'

import { BRANCH_CURRENCIES } from '@/features/branches/api/types'

const CODE_RE = /^[A-Za-z0-9-]{2,12}$/
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/**
 * Client mirror of the backend branch contract (branch.schema.ts): name required,
 * a 2–12 char alphanumeric code, well-formed email, and tax/service rates stored as
 * basis points (0–5000 = 0–50%). Empty strings are allowed for optional text and
 * normalised to null on submit.
 *
 * Schema factory: takes the namespaced `t` so validation messages localize and
 * re-resolve when the language changes (react-i18next hands back a new `t`).
 */
export const makeBranchSchema = (t: TFunction<'branches'>) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')).max(120, t('validation.nameMax')),
    code: z.string().refine((v) => v === '' || CODE_RE.test(v), t('validation.code')),
    vertical: z.string(),
    type: z.string().max(60, t('validation.typeMax')),
    phone: z.string().max(40, t('validation.phoneMax')),
    email: z.string().refine((v) => v === '' || EMAIL_RE.test(v), t('validation.email')),
    address: z.string().max(300, t('validation.addressMax')),
    timezone: z.string().min(1, t('validation.timezoneRequired')),
    currency_code: z.enum(BRANCH_CURRENCIES),
    locale: z.string().max(10),
    tax_rate_bps: z.number().int().min(0).max(5000),
    service_fee_bps: z.number().int().min(0).max(5000),
    prices_include_tax: z.boolean(),
    is_active: z.boolean(),
  })

export type BranchFormValues = z.infer<ReturnType<typeof makeBranchSchema>>
