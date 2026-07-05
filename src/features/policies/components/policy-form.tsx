import { zodResolver } from '@hookform/resolvers/zod'
import { Filter, ScrollText, SlidersHorizontal } from 'lucide-react'
import { useMemo } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { cn } from '@/core/utils/cn'
import { useCreatePolicy, useUpdatePolicy } from '@/features/policies/api/mutations'
import { usePolicyConditionSchemaQuery } from '@/features/policies/api/queries'
import { POLICY_ACTIONS, POLICY_EFFECTS, POLICY_SUBJECTS, type PolicyView, type PolicyWriteInput } from '@/features/policies/api/types'
import { PolicyConditionBuilder } from '@/features/policies/components/policy-condition-builder'
import { PolicyEffectBadge } from '@/features/policies/components/policy-effect-badge'
import { makePolicySchema, type PolicyFormValues } from '@/features/policies/schema'
import { useRolesQuery } from '@/features/roles/api/queries'
import { FormProvider } from '@/shared/components/form/core/FormRoot'
import { FormInput } from '@/shared/components/form/fields/FormInput'
import { FormSelect } from '@/shared/components/form/fields/FormSelect'
import { FormSectionCard } from '@/shared/components/form/FormSectionCard'
import { Button } from '@/shared/components/ui/button'

interface Props {
  mode: 'create' | 'edit'
  initial?: PolicyView
  onDone: () => void
}

export function PolicyForm({ mode, initial, onDone }: Props) {
  const { t } = useTranslation(['policies', 'common'])
  const { data: rolesData } = useRolesQuery({ limit: 100 })
  const roles = rolesData?.items ?? []
  const { data: schema } = usePolicyConditionSchemaQuery()

  const create = useCreatePolicy()
  const update = useUpdatePolicy()
  const isPending = create.isPending || update.isPending

  const formSchema = useMemo(() => makePolicySchema(t), [t])

  const methods = useForm<PolicyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      effect: initial?.effect ?? 'ALLOW',
      action: (initial?.action as PolicyFormValues['action']) ?? 'read',
      subject: (initial?.subject as PolicyFormValues['subject']) ?? 'Branch',
      role_id: initial?.role_id ?? '',
      description: initial?.description ?? '',
      conditions: (initial?.conditions as Record<string, unknown> | null) ?? null,
    },
    mode: 'onBlur',
  })

  const [effect, action, subject, roleId, conditions] = useWatch({
    control: methods.control,
    name: ['effect', 'action', 'subject', 'role_id', 'conditions'],
  })

  const conditionFields = [...(schema?.principal ?? []), ...(schema?.subjects?.[subject] ?? [])]
  const roleName = roleId
    ? roles.find((r) => r.id === roleId)?.name ?? t('form.summaryRoleSelected')
    : t('form.summaryRoleEveryone')
  const hasConditions = conditions && typeof conditions === 'object' && Object.keys(conditions).length > 0

  async function onSubmit(values: PolicyFormValues) {
    const payload: PolicyWriteInput = {
      effect: values.effect,
      action: values.action,
      subject: values.subject,
      role_id: values.role_id || null,
      conditions: values.conditions ?? null,
      description: values.description.trim() || null,
    }
    try {
      if (mode === 'create') {
        await create.mutateAsync(payload)
        toast.success(t('toasts.created'))
      } else if (initial) {
        await update.mutateAsync({ id: initial.id, data: payload })
        toast.success(t('toasts.updated'))
      }
      onDone()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const roleOptions = roles.map((r) => ({ value: r.id, label: t('form.roleOption', { role: r.name }) }))

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <FormSectionCard eyebrow={t('form.ruleEyebrow')} title={t('form.ruleTitle')} icon={<SlidersHorizontal />} accent="brand">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormSelect name="effect" label={t('form.effect')} options={POLICY_EFFECTS.map((e) => ({ value: e, label: e }))} />
            <FormSelect name="action" label={t('form.action')} options={POLICY_ACTIONS.map((a) => ({ value: a, label: a }))} />
            <FormSelect name="subject" label={t('form.subject')} options={POLICY_SUBJECTS.map((s) => ({ value: s, label: s }))} />
          </div>
          <FormSelect
            name="role_id"
            label={t('form.appliesTo')}
            options={roleOptions}
            clearable
            clearLabel={t('form.appliesToEveryone')}
            placeholder={t('form.appliesToEveryone')}
          />
        </FormSectionCard>

        <FormSectionCard
          eyebrow={t('form.conditionsEyebrow')}
          title={t('form.conditionsTitle')}
          description={t('form.conditionsDescription')}
          icon={<Filter />}
          accent="violet"
        >
          <Controller
            name="conditions"
            render={({ field }) => (
              <PolicyConditionBuilder
                value={(field.value as Record<string, unknown> | null) ?? null}
                onChange={field.onChange}
                fields={conditionFields}
                operators={schema?.operators ?? []}
              />
            )}
          />
        </FormSectionCard>

        <FormSectionCard eyebrow={t('form.notesEyebrow')} title={t('form.notesTitle')} icon={<ScrollText />} accent="sky">
          <FormInput name="description" label={t('form.description')} placeholder={t('form.descriptionPlaceholder')} />
        </FormSectionCard>

        <div className={cn('rounded-lg border p-3 text-sm', effect === 'DENY' ? 'border-destructive/30 bg-destructive/5' : 'border-success/30 bg-success/5')}>
          <div className="mb-1 flex items-center gap-2">
            <PolicyEffectBadge effect={effect} />
            <span className="font-medium">{t('form.summary')}</span>
          </div>
          {t('form.summarySentence', {
            effect,
            action,
            subject,
            role: roleName,
            conditions: hasConditions ? t('form.summaryWhenConditions') : '',
          })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t bg-background/95 p-4 supports-[backdrop-filter]:bg-background/80 supports-[backdrop-filter]:backdrop-blur">
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          {t('common:actions.cancel')}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? t('form.saving') : mode === 'create' ? t('form.submitCreate') : t('form.submitEdit')}
        </Button>
      </div>
    </FormProvider>
  )
}
