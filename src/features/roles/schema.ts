import type { TFunction } from 'i18next'
import { z } from 'zod'

/**
 * Client mirror of the backend role contract (role.schema.ts): name 1–80,
 * description ≤300, and at least one permission so a custom role always grants
 * something. Danger-zone codes are filtered out by the matrix, not here.
 *
 * Built as a factory so validation messages resolve through the active `roles`
 * i18n namespace; call it with a `t` bound to that namespace (e.g. via `useMemo`).
 */
export const makeRoleSchema = (t: TFunction<'roles'>) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')).max(80, t('validation.nameMax')),
    description: z.string().max(300, t('validation.descriptionMax')),
    permission_codes: z.array(z.string()).min(1, t('validation.permissionRequired')),
  })

export type RoleFormValues = z.infer<ReturnType<typeof makeRoleSchema>>
