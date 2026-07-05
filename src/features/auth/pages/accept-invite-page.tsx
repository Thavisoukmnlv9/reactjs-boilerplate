import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { queryKeys } from '@/core/api/query-keys'
import { makeAcceptInviteSchema, type AcceptInviteFormValues } from '@/features/auth/schema'

export function AcceptInvitePage() {
  const { t } = useTranslation('auth')
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { token } = useSearch({ strict: false }) as { token?: string }
  const accept = useMutation({
    mutationFn: (v: AcceptInviteFormValues) => authService.acceptInvite({ token: token ?? '', password: v.password }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.me() })
      void navigate({ to: '/dashboard' })
    },
    onError: (e) => toast.error((e as Error).message),
  })
  const schema = useMemo(() => makeAcceptInviteSchema(t), [t])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteFormValues>({ resolver: zodResolver(schema) })

  if (!token) {
    return (
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{t('acceptInvite.invalidTitle')}</CardTitle>
          <CardDescription>{t('acceptInvite.invalidSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild variant="outline">
            <Link to="/login">{t('acceptInvite.goToSignIn')}</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t('acceptInvite.title')}</CardTitle>
        <CardDescription>{t('acceptInvite.subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((v) => accept.mutate(v))} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="password">{t('acceptInvite.password')}</Label>
            <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
            {errors.password ? <p className="text-destructive text-xs">{errors.password.message}</p> : null}
          </div>
          <Button type="submit" className="w-full" disabled={accept.isPending}>
            {accept.isPending ? t('acceptInvite.submitting') : t('acceptInvite.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
