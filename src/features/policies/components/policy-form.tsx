import { zodResolver } from '@hookform/resolvers/zod'
import { Filter, ScrollText, SlidersHorizontal } from 'lucide-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/core/utils/cn'
import { useCreatePolicy, useUpdatePolicy } from '@/features/policies/api/mutations'
import { usePolicyConditionSchemaQuery } from '@/features/policies/api/queries'
import { POLICY_ACTIONS, POLICY_EFFECTS, POLICY_SUBJECTS, type PolicyView, type PolicyWriteInput } from '@/features/policies/api/types'
import { PolicyConditionBuilder } from '@/features/policies/components/policy-condition-builder'
import { PolicyEffectBadge } from '@/features/policies/components/policy-effect-badge'
import { type PolicyFormValues, policyFormSchema } from '@/features/policies/schema'
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
  const { data: rolesData } = useRolesQuery({ limit: 100 })
  const roles = rolesData?.items ?? []
  const { data: schema } = usePolicyConditionSchemaQuery()

  const create = useCreatePolicy()
  const update = useUpdatePolicy()
  const isPending = create.isPending || update.isPending

  const methods = useForm<PolicyFormValues>({
    resolver: zodResolver(policyFormSchema),
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
  const roleName = roleId ? roles.find((r) => r.id === roleId)?.name ?? 'the selected role' : 'everyone'
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
        toast.success('Policy created')
      } else if (initial) {
        await update.mutateAsync({ id: initial.id, data: payload })
        toast.success('Policy updated')
      }
      onDone()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const roleOptions = roles.map((r) => ({ value: r.id, label: `Members with the ${r.name} role` }))

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <FormSectionCard eyebrow="Rule" title="What the policy governs" icon={<SlidersHorizontal />} accent="brand">
          <div className="grid gap-4 sm:grid-cols-3">
            <FormSelect name="effect" label="Effect" options={POLICY_EFFECTS.map((e) => ({ value: e, label: e }))} />
            <FormSelect name="action" label="Action" options={POLICY_ACTIONS.map((a) => ({ value: a, label: a }))} />
            <FormSelect name="subject" label="Subject" options={POLICY_SUBJECTS.map((s) => ({ value: s, label: s }))} />
          </div>
          <FormSelect
            name="role_id"
            label="Applies to"
            options={roleOptions}
            clearable
            clearLabel="Everyone in the org"
            placeholder="Everyone in the org"
          />
        </FormSectionCard>

        <FormSectionCard
          eyebrow="Conditions"
          title="When it applies"
          description="Optional attribute matcher over the acting user and the resource."
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

        <FormSectionCard eyebrow="Notes" title="Description" icon={<ScrollText />} accent="sky">
          <FormInput name="description" label="Description" placeholder="Why this rule exists" />
        </FormSectionCard>

        <div className={cn('rounded-lg border p-3 text-sm', effect === 'DENY' ? 'border-destructive/30 bg-destructive/5' : 'border-success/30 bg-success/5')}>
          <div className="mb-1 flex items-center gap-2">
            <PolicyEffectBadge effect={effect} />
            <span className="font-medium">Summary</span>
          </div>
          This policy will <span className="font-semibold">{effect}</span> <span className="font-medium">{action}</span> on{' '}
          <span className="font-medium">{subject}</span> for <span className="font-medium">{roleName}</span>
          {hasConditions ? ' when the conditions match' : ''}. DENY always wins.
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 border-t bg-background/95 p-4 supports-[backdrop-filter]:bg-background/80 supports-[backdrop-filter]:backdrop-blur">
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : mode === 'create' ? 'Create policy' : 'Save changes'}
        </Button>
      </div>
    </FormProvider>
  )
}
