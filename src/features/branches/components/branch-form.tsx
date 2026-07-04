import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Switch } from '@/shared/components/ui/switch'
import type { BranchView, BranchWriteInput } from '@/features/branches/api/types'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY']
const VERTICALS = ['GENERAL', 'RETAIL', 'SERVICE']

interface Props {
  mode: 'create' | 'edit'
  initial?: BranchView
  onSubmit: (values: BranchWriteInput) => void
  onCancel?: () => void
  isPending?: boolean
}

export function BranchForm({ mode, initial, onSubmit, onCancel, isPending }: Props) {
  const [f, setF] = useState({
    name: initial?.name ?? '',
    code: initial?.code ?? '',
    vertical: initial?.vertical ?? '',
    type: initial?.type ?? '',
    phone: initial?.phone ?? '',
    email: initial?.email ?? '',
    address: initial?.address ?? '',
    timezone: initial?.timezone ?? 'UTC',
    currency_code: initial?.currency_code ?? 'USD',
    locale: initial?.locale ?? 'en-US',
    tax_pct: (initial?.tax_rate_bps ?? 0) / 100,
    service_pct: (initial?.service_fee_bps ?? 0) / 100,
    prices_include_tax: initial?.prices_include_tax ?? true,
    is_active: initial?.is_active ?? true,
  })
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) => setF((p) => ({ ...p, [k]: v }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({
      name: f.name.trim(),
      code: f.code.trim() ? f.code.trim().toUpperCase() : null,
      vertical: f.vertical || null,
      type: f.type.trim() || null,
      phone: f.phone.trim() || null,
      email: f.email.trim() || null,
      address: f.address.trim() || null,
      timezone: f.timezone,
      currency_code: f.currency_code,
      locale: f.locale,
      tax_rate_bps: Math.round(f.tax_pct * 100),
      service_fee_bps: Math.round(f.service_pct * 100),
      prices_include_tax: f.prices_include_tax,
      ...(mode === 'edit' ? { is_active: f.is_active } : {}),
    })
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identity</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="b-name">Name</Label>
            <Input id="b-name" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Downtown" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-code">Code</Label>
            <Input id="b-code" value={f.code} onChange={(e) => set('code', e.target.value.toUpperCase())} placeholder="DT-01" />
          </div>
          <div className="space-y-1.5">
            <Label>Vertical</Label>
            <Select value={f.vertical} onValueChange={(v) => set('vertical', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {VERTICALS.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-type">Type</Label>
            <Input id="b-type" value={f.type} onChange={(e) => set('type', e.target.value)} placeholder="Optional" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="b-phone">Phone</Label>
            <Input id="b-phone" value={f.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-email">Email</Label>
            <Input id="b-email" type="email" value={f.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="b-address">Address</Label>
            <Input id="b-address" value={f.address} onChange={(e) => set('address', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Localization &amp; commerce</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="b-tz">Timezone</Label>
            <Input id="b-tz" value={f.timezone} onChange={(e) => set('timezone', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Select value={f.currency_code} onValueChange={(v) => set('currency_code', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-tax">Tax rate (%)</Label>
            <Input id="b-tax" type="number" step="0.01" min="0" max="50" value={f.tax_pct} onChange={(e) => set('tax_pct', Number(e.target.value))} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="b-fee">Service fee (%)</Label>
            <Input id="b-fee" type="number" step="0.01" min="0" max="50" value={f.service_pct} onChange={(e) => set('service_pct', Number(e.target.value))} />
          </div>
          <div className="flex items-center justify-between sm:col-span-2">
            <Label htmlFor="b-incl">Prices include tax</Label>
            <Switch id="b-incl" checked={f.prices_include_tax} onCheckedChange={(v) => set('prices_include_tax', v)} />
          </div>
          {mode === 'edit' ? (
            <div className="flex items-center justify-between sm:col-span-2">
              <Label htmlFor="b-active">Active</Label>
              <Switch id="b-active" checked={f.is_active} onCheckedChange={(v) => set('is_active', v)} />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending || !f.name.trim()}>
          {isPending ? 'Saving…' : mode === 'create' ? 'Create branch' : 'Save changes'}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}
