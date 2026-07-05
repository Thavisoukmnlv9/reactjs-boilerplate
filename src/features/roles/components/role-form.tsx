import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { Lock, ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useCreateRole, useUpdateRole } from '@/features/roles/api/mutations'
import type { RoleView } from '@/features/roles/api/types'
import { PermissionMatrix } from '@/features/roles/components/permission-matrix'
import { moduleOf } from '@/features/roles/lib/permission-catalog'
import { makeRoleSchema, type RoleFormValues } from '@/features/roles/schema'
import { FormProvider } from '@/shared/components/form/core/FormRoot'
import { useFieldError } from '@/shared/components/form/core/useFieldError'
import { FormInput } from '@/shared/components/form/fields/FormInput'
import { FormTextarea } from '@/shared/components/form/fields/FormTextarea'
import { FormSectionCard } from '@/shared/components/form/FormSectionCard'
import { Button } from '@/shared/components/ui/button'

interface Props {
  mode: 'create' | 'edit'
  initial?: RoleView
  /** System roles are read-only. */
  readOnly?: boolean
}

function PermissionsField({ readOnly }: { readOnly?: boolean }) {
  const { t } = useTranslation(['roles', 'common'])
  const err = useFieldError('permission_codes')
  return (
    <Controller
      name="permission_codes"
      render={({ field }) => (
        <div className="space-y-2">
          <PermissionMatrix value={field.value ?? []} onChange={field.onChange} disabled={readOnly} />
          {err ? <p className="text-destructive text-xs">{t('validation.permissionRequired')}</p> : null}
        </div>
      )}
    />
  )
}

export function RoleForm({ mode, initial, readOnly }: Props) {
  const { t } = useTranslation(['roles', 'common'])
  const navigate = useNavigate()
  const create = useCreateRole()
  const update = useUpdateRole()
  const isPending = create.isPending || update.isPending

  const schema = useMemo(() => makeRoleSchema(t), [t])

  const methods = useForm<RoleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? '',
      description: initial?.description ?? '',
      permission_codes: initial?.permission_codes ?? [],
    },
    mode: 'onBlur',
  })

  const codes = useWatch({ control: methods.control, name: 'permission_codes' }) ?? []
  const moduleCount = new Set(codes.map(moduleOf)).size

  async function onSubmit(values: RoleFormValues) {
    try {
      if (mode === 'create') {
        await create.mutateAsync({ name: values.name.trim(), description: values.description.trim() || null, permission_codes: values.permission_codes })
        toast.success(t('toasts.created'))
      } else if (initial) {
        await update.mutateAsync({
          id: initial.id,
          data: { name: values.name.trim(), description: values.description.trim() || null, permission_codes: values.permission_codes },
        })
        toast.success(t('toasts.updated'))
      }
      void navigate({ to: '/roles' })
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} className="space-y-6 pb-24">
      {readOnly ? (
        <div className="flex items-center gap-2 rounded-lg border border-border/80 bg-muted/40 px-4 py-3 text-muted-foreground text-sm">
          <Lock className="size-4" /> {t('form.readOnlyNotice')}
        </div>
      ) : null}

      <FormSectionCard eyebrow={t('form.detailsEyebrow')} title={t('form.detailsTitle')} icon={<ShieldCheck />} accent="brand">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput name="name" label={t('form.nameLabel')} requiredMark disabled={readOnly} placeholder={t('form.namePlaceholder')} />
        </div>
        <FormTextarea name="description" label={t('form.descriptionLabel')} rows={2} disabled={readOnly} placeholder={t('form.descriptionPlaceholder')} />
      </FormSectionCard>

      <FormSectionCard
        eyebrow={t('form.permissionsEyebrow')}
        title={t('form.permissionsTitle')}
        description={t('form.permissionsSummary', {
          count: codes.length,
          modules: moduleCount,
          modulesSuffix: moduleCount === 1 ? '' : 's',
        })}
        icon={<ShieldCheck />}
        accent="violet"
      >
        <PermissionsField readOnly={readOnly} />
      </FormSectionCard>

      {!readOnly ? (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/95 py-3 supports-[backdrop-filter]:bg-background/80 supports-[backdrop-filter]:backdrop-blur lg:pl-[var(--sidebar-width,0)]">
          <div className="mx-auto flex max-w-5xl items-center justify-end gap-2 px-4">
            <Button type="button" variant="outline" onClick={() => void navigate({ to: '/roles' })} disabled={isPending}>
              {t('common:actions.cancel')}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? t('common:states.loading') : mode === 'create' ? t('form.createSubmit') : t('form.saveSubmit')}
            </Button>
          </div>
        </div>
      ) : null}
    </FormProvider>
  )
}
