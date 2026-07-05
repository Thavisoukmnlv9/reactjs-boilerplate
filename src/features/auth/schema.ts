import type { TFunction } from 'i18next'
import { z } from 'zod'

// Schema factories: each takes the namespaced `t` so validation messages localize
// and re-resolve when the language changes (react-i18next hands back a new `t`).

const password8 = (t: TFunction<'auth'>) =>
  z
    .string()
    .min(8, t('validation.passwordMin'))
    .refine((v) => /[A-Za-z]/.test(v) && /\d/.test(v), t('validation.passwordComplexity'))

export const makeLoginSchema = (t: TFunction<'auth'>) =>
  z.object({
    email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
    password: z.string().min(1, t('validation.passwordRequired')),
  })
export type LoginFormValues = z.infer<ReturnType<typeof makeLoginSchema>>

export const makeRegisterSchema = (t: TFunction<'auth'>) =>
  z.object({
    display_name: z.string().min(1, t('validation.nameRequired')).max(80),
    email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
    password: password8(t),
  })
export type RegisterFormValues = z.infer<ReturnType<typeof makeRegisterSchema>>

export const makeForgotSchema = (t: TFunction<'auth'>) =>
  z.object({
    email: z.string().min(1, t('validation.emailRequired')).email(t('validation.emailInvalid')),
  })
export type ForgotFormValues = z.infer<ReturnType<typeof makeForgotSchema>>

export const makeResetSchema = (t: TFunction<'auth'>) =>
  z.object({
    new_password: password8(t),
  })
export type ResetFormValues = z.infer<ReturnType<typeof makeResetSchema>>

export const makeAcceptInviteSchema = (t: TFunction<'auth'>) =>
  z.object({
    password: password8(t),
  })
export type AcceptInviteFormValues = z.infer<ReturnType<typeof makeAcceptInviteSchema>>
