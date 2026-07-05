import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import type { TFunction } from 'i18next'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/core/access'
import { queryKeys } from '@/core/api/query-keys'

// Schema factory: takes the namespaced `t` so validation messages localize and
// re-resolve when the language changes (react-i18next hands back a new `t`).
const makeSchema = (t: TFunction<'onboarding'>) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')).max(120),
    first_branch_name: z.string().max(120).optional(),
  })
type Values = z.infer<ReturnType<typeof makeSchema>>

function slugPreview(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'your-org'
  )
}

export function CreateOrganizationPage() {
  const { t } = useTranslation('onboarding')
  const qc = useQueryClient()
  const navigate = useNavigate()
  const create = useMutation({
    mutationFn: authService.createOrganization,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: queryKeys.me() })
      void navigate({ to: '/dashboard' })
    },
    onError: (e) => toast.error((e as Error).message),
  })
  const schema = useMemo(() => makeSchema(t), [t])
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { first_branch_name: 'Main Branch' },
  })
  const name = watch('name') ?? ''

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{t('title')}</CardTitle>
        <CardDescription>{t('subtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit((v) => create.mutate(v))} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="name">{t('form.name')}</Label>
            <Input id="name" placeholder={t('form.namePlaceholder')} {...register('name')} />
            <p className="text-muted-foreground text-xs">
              {t('form.urlLabel')} <span className="font-mono">/{slugPreview(name)}</span>
            </p>
            {errors.name ? <p className="text-destructive text-xs">{errors.name.message}</p> : null}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="first_branch_name">{t('form.firstBranch')}</Label>
            <Input
              id="first_branch_name"
              placeholder={t('form.firstBranchPlaceholder')}
              {...register('first_branch_name')}
            />
            <p className="text-muted-foreground text-xs">{t('form.defaultsHint')}</p>
          </div>
          <Button type="submit" className="w-full" disabled={create.isPending}>
            {create.isPending ? t('submitting') : t('submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
