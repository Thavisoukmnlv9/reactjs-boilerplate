import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Globe, Phone, Receipt } from 'lucide-react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { useCreateBranch, useUpdateBranch } from '@/features/branches/api/mutations'
import { BRANCH_CURRENCIES, BRANCH_VERTICALS, type BranchView, type BranchWriteInput } from '@/features/branches/api/types'
import { type BranchFormValues, makeBranchSchema } from '@/features/branches/schema'
import { FormProvider } from '@/shared/components/form/core/FormRoot'
import { FormInput } from '@/shared/components/form/fields/FormInput'
import { FormPercentBps } from '@/shared/components/form/fields/FormPercentBps'
import { FormSelect } from '@/shared/components/form/fields/FormSelect'
import { FormSwitch } from '@/shared/components/form/fields/FormSwitch'
import { FormTextarea } from '@/shared/components/form/fields/FormTextarea'
import { FormSectionCard } from '@/shared/components/form/FormSectionCard'
import { Button } from '@/shared/components/ui/button'

interface Props {
  mode: 'create' | 'edit'
  initial?: BranchView
  onDone: () => void
}

function defaultsFor(initial?: BranchView): BranchFormValues {
  return {
    name: initial?.name ?? '',
    code: initial?.code ?? '',
    vertical: initial?.vertical ?? '',
    type: initial?.type ?? '',
    phone: initial?.phone ?? '',
    email: initial?.email ?? '',
    address: initial?.address ?? '',
    timezone: initial?.timezone ?? 'UTC',
    currency_code: (initial?.currency_code as BranchFormValues['currency_code']) ?? 'USD',
    locale: initial?.locale ?? 'en-US',
    tax_rate_bps: initial?.tax_rate_bps ?? 0,
    service_fee_bps: initial?.service_fee_bps ?? 0,
    prices_include_tax: initial?.prices_include_tax ?? true,
    is_active: initial?.is_active ?? true,
  }
}

export function BranchForm({ mode, initial, onDone }: Props) {
  const { t } = useTranslation(['branches', 'common'])
  const create = useCreateBranch()
  const update = useUpdateBranch()
  const isPending = create.isPending || update.isPending

  const schema = useMemo(() => makeBranchSchema(t), [t])
  const methods = useForm<BranchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultsFor(initial),
    mode: 'onBlur',
  })

  async function onSubmit(values: BranchFormValues) {
    const payload: BranchWriteInput = {
      name: values.name.trim(),
      code: values.code.trim() ? values.code.trim().toUpperCase() : null,
      vertical: values.vertical || null,
      type: values.type.trim() || null,
      phone: values.phone.trim() || null,
      email: values.email.trim() || null,
      address: values.address.trim() || null,
      timezone: values.timezone,
      currency_code: values.currency_code,
      locale: values.locale,
      tax_rate_bps: values.tax_rate_bps,
      service_fee_bps: values.service_fee_bps,
      prices_include_tax: values.prices_include_tax,
      ...(mode === 'edit' ? { is_active: values.is_active } : {}),
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

  const verticalOptions = BRANCH_VERTICALS.map((v) => ({ value: v, label: v.charAt(0) + v.slice(1).toLowerCase() }))
  const currencyOptions = BRANCH_CURRENCIES.map((c) => ({ value: c, label: c }))

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
        <FormSectionCard eyebrow={t('form.identityEyebrow')} title={t('form.identityTitle')} icon={<Building2 />} accent="brand">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput name="name" label={t('form.name')} requiredMark placeholder={t('form.namePlaceholder')} />
            <FormInput name="code" label={t('form.code')} placeholder={t('form.codePlaceholder')} className="uppercase" />
            <FormSelect name="vertical" label={t('form.vertical')} options={verticalOptions} clearable clearLabel={t('form.verticalUnset')} placeholder={t('form.verticalPlaceholder')} />
            <FormInput name="type" label={t('form.type')} placeholder={t('form.typePlaceholder')} />
          </div>
        </FormSectionCard>

        <FormSectionCard eyebrow={t('form.contactEyebrow')} title={t('form.contactTitle')} icon={<Phone />} accent="sky">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput name="phone" label={t('form.phone')} />
            <FormInput name="email" label={t('form.email')} type="email" />
          </div>
          <FormTextarea name="address" label={t('form.address')} rows={2} />
        </FormSectionCard>

        <FormSectionCard
          eyebrow={t('form.commerceEyebrow')}
          title={t('form.commerceTitle')}
          description={t('form.commerceDescription')}
          icon={<Receipt />}
          accent="emerald"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput name="timezone" label={t('form.timezone')} requiredMark icon={<Globe />} placeholder={t('form.timezonePlaceholder')} />
            <FormSelect name="currency_code" label={t('form.currency')} requiredMark options={currencyOptions} />
            <FormPercentBps name="tax_rate_bps" label={t('form.taxRate')} hint={t('form.taxRateHint')} maxPercent={50} />
            <FormPercentBps name="service_fee_bps" label={t('form.serviceFee')} hint={t('form.serviceFeeHint')} maxPercent={50} />
          </div>
          <FormSwitch name="prices_include_tax" label={t('form.pricesIncludeTax')} hint={t('form.pricesIncludeTaxHint')} />
          {mode === 'edit' ? (
            <FormSwitch name="is_active" label={t('form.active')} hint={t('form.activeHint')} />
          ) : null}
        </FormSectionCard>
      </div>

      <div className="flex items-center justify-end gap-2 border-t bg-background/95 p-4 supports-[backdrop-filter]:bg-background/80 supports-[backdrop-filter]:backdrop-blur">
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          {t('common:actions.cancel')}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? t('common:states.loading') : mode === 'create' ? t('form.submitCreate') : t('form.submitEdit')}
        </Button>
      </div>
    </FormProvider>
  )
}
