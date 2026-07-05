import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/core/access'
import { queryKeys } from '@/core/api/query-keys'
import { makeRegisterSchema, type RegisterFormValues } from '@/features/auth/schema'

export function RegisterPage() {
  const { t } = useTranslation('auth')
  const qc = useQueryClient()
  const navigate = useNavigate()
  const create = useMutation({
    mutationFn: authService.register,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.me() })
      void navigate({ to: '/onboarding/create-organization' })
    },
    onError: (e) => toast.error((e as Error).message),
  })
  const schema = useMemo(() => makeRegisterSchema(t), [t])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit((values) => create.mutate(values))

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t('register.title')}</CardTitle>
        <CardDescription>{t('register.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="display_name">{t('register.name')}</Label>
            <Input id="display_name" autoComplete="name" placeholder={t('register.namePlaceholder')} {...register('display_name')} />
            {errors.display_name ? <p className="text-destructive text-xs">{errors.display_name.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">{t('register.email')}</Label>
            <Input id="email" type="email" autoComplete="email" placeholder={t('register.emailPlaceholder')} {...register('email')} />
            {errors.email ? <p className="text-destructive text-xs">{errors.email.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t('register.password')}</Label>
            <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password ? <p className="text-destructive text-xs">{errors.password.message}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={create.isPending}>
            {create.isPending ? t('register.submitting') : t('register.submit')}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            {t('register.haveAccount')}{' '}
            <Link to="/login" className="text-foreground font-medium hover:underline">
              {t('register.signIn')}
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
