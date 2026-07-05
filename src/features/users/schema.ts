import type { TFunction } from 'i18next'
import { z } from 'zod'

/**
 * Client-side mirror of the backend invite/update contract (users.schema.ts):
 * email required + well-formed, name ≤120, staff note ≤500, a role is mandatory,
 * and the default branch must be one of the selected branches. Powers inline
 * validation so errors surface at the field instead of only as a toast on submit.
 *
 * A factory over the namespaced `t` so validation messages localize and
 * re-resolve when the language changes (react-i18next hands back a new `t`).
 */
export const makeUserSchema = (t: TFunction<'users'>) =>
  z
    .object({
      email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
      name: z.string().max(120, t('validation.nameMax')),
      role_id: z.string().min(1, t('validation.roleRequired')),
      branch_ids: z.array(z.string()),
      default_branch_id: z.string(),
      staff_title: z.string().max(120, t('validation.titleMax')),
      staff_note: z.string().max(500, t('validation.notesMax')),
    })
    .refine((v) => !v.default_branch_id || v.branch_ids.includes(v.default_branch_id), {
      message: t('validation.defaultBranchInvalid'),
      path: ['default_branch_id'],
    })

export type UserFormValues = z.infer<ReturnType<typeof makeUserSchema>>
