import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/core/access'
import { makeForgotSchema, type ForgotFormValues } from '@/features/auth/schema'

export function ForgotPasswordPage() {
  const { t } = useTranslation('auth')
  const forgot = useMutation({ mutationFn: (v: ForgotFormValues) => authService.forgotPassword(v.email) })
  const schema = useMemo(() => makeForgotSchema(t), [t])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({ resolver: zodResolver(schema) })

  if (forgot.isSuccess) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('forgot.sentTitle')}</CardTitle>
          <CardDescription>{t('forgot.sentSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild variant="outline">
            <Link to="/login">{t('forgot.backToSignIn')}</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t('forgot.title')}</CardTitle>
        <CardDescription>{t('forgot.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((v) => forgot.mutate(v))} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('forgot.email')}</Label>
            <Input id="email" type="email" autoComplete="email" placeholder={t('forgot.emailPlaceholder')} {...register('email')} />
            {errors.email ? <p className="text-destructive text-xs">{errors.email.message}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={forgot.isPending}>
            {forgot.isPending ? t('forgot.submitting') : t('forgot.submit')}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            <Link to="/login" className="hover:underline">
              {t('forgot.backToSignIn')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
