import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, Globe, Phone, Receipt } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { useCreateBranch, useUpdateBranch } from '@/features/branches/api/mutations'
import { BRANCH_CURRENCIES, BRANCH_VERTICALS, type BranchView, type BranchWriteInput } from '@/features/branches/api/types'
import { type BranchFormValues, branchFormSchema } from '@/features/branches/schema'
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
  const create = useCreateBranch()
  const update = useUpdateBranch()
  const isPending = create.isPending || update.isPending

  const methods = useForm<BranchFormValues>({
    resolver: zodResolver(branchFormSchema),
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
        toast.success('Branch created')
      } else if (initial) {
        await update.mutateAsync({ id: initial.id, data: payload })
        toast.success('Branch updated')
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
        <FormSectionCard eyebrow="Identity" title="Branch details" icon={<Building2 />} accent="brand">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput name="name" label="Name" requiredMark placeholder="Downtown" />
            <FormInput name="code" label="Code" placeholder="DT-01" className="uppercase" />
            <FormSelect name="vertical" label="Vertical" options={verticalOptions} clearable clearLabel="Unset" placeholder="Select…" />
            <FormInput name="type" label="Type" placeholder="Optional" />
          </div>
        </FormSectionCard>

        <FormSectionCard eyebrow="Contact" title="How to reach it" icon={<Phone />} accent="sky">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput name="phone" label="Phone" />
            <FormInput name="email" label="Email" type="email" />
          </div>
          <FormTextarea name="address" label="Address" rows={2} />
        </FormSectionCard>

        <FormSectionCard
          eyebrow="Commerce"
          title="Localization & pricing"
          description="Currency, timezone and the tax/fee rates applied at this branch."
          icon={<Receipt />}
          accent="emerald"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormInput name="timezone" label="Timezone" requiredMark icon={<Globe />} placeholder="UTC" />
            <FormSelect name="currency_code" label="Currency" requiredMark options={currencyOptions} />
            <FormPercentBps name="tax_rate_bps" label="Tax rate" hint="0–50%" maxPercent={50} />
            <FormPercentBps name="service_fee_bps" label="Service fee" hint="0–50%" maxPercent={50} />
          </div>
          <FormSwitch name="prices_include_tax" label="Prices include tax" hint="Displayed prices already contain tax." />
          {mode === 'edit' ? (
            <FormSwitch name="is_active" label="Active" hint="Archived branches are hidden from day-to-day operations." />
          ) : null}
        </FormSectionCard>
      </div>

      <div className="flex items-center justify-end gap-2 border-t bg-background/95 p-4 supports-[backdrop-filter]:bg-background/80 supports-[backdrop-filter]:backdrop-blur">
        <Button type="button" variant="outline" onClick={onDone} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : mode === 'create' ? 'Create branch' : 'Save changes'}
        </Button>
      </div>
    </FormProvider>
  )
}
