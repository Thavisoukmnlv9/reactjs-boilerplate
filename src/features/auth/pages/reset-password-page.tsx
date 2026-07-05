import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/core/access'
import { makeResetSchema, type ResetFormValues } from '@/features/auth/schema'

export function ResetPasswordPage() {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const { token } = useSearch({ strict: false }) as { token?: string }
  const reset = useMutation({
    mutationFn: (v: ResetFormValues) => authService.resetPassword(token ?? '', v.new_password),
    onSuccess: () => {
      toast.success(t('reset.updatedToast'))
      void navigate({ to: '/login' })
    },
    onError: (e) => toast.error((e as Error).message),
  })
  const schema = useMemo(() => makeResetSchema(t), [t])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({ resolver: zodResolver(schema) })

  if (!token) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('reset.invalidTitle')}</CardTitle>
          <CardDescription>{t('reset.invalidSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild variant="outline">
            <Link to="/forgot-password">{t('reset.requestNewLink')}</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t('reset.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((v) => reset.mutate(v))} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="new_password">{t('reset.newPassword')}</Label>
            <Input id="new_password" type="password" autoComplete="new-password" {...register('new_password')} />
            {errors.new_password ? <p className="text-destructive text-xs">{errors.new_password.message}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={reset.isPending}>
            {reset.isPending ? t('reset.submitting') : t('reset.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
