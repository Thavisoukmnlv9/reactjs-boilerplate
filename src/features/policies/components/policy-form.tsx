import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import { useRolesQuery } from '@/features/roles/api/queries'
import {
  POLICY_ACTIONS,
  POLICY_EFFECTS,
  POLICY_SUBJECTS,
  type PolicyView,
  type PolicyWriteInput,
} from '@/features/policies/api/types'

const ALL = '__all__'

interface Props {
  mode: 'create' | 'edit'
  initial?: PolicyView
  onSubmit: (values: PolicyWriteInput) => void
  onCancel?: () => void
  isPending?: boolean
}

export function PolicyForm({ mode, initial, onSubmit, onCancel, isPending }: Props) {
  const { data: rolesData } = useRolesQuery()
  const roles = rolesData?.items ?? []
  const [effect, setEffect] = useState<'ALLOW' | 'DENY'>(initial?.effect ?? 'ALLOW')
  const [action, setAction] = useState(initial?.action ?? 'read')
  const [subject, setSubject] = useState(initial?.subject ?? 'Branch')
  const [roleId, setRoleId] = useState(initial?.role_id ?? ALL)
  const [conditionsText, setConditionsText] = useState(
    initial?.conditions ? JSON.stringify(initial.conditions, null, 2) : ''
  )
  const [description, setDescription] = useState(initial?.description ?? '')
  const [jsonError, setJsonError] = useState<string | null>(null)

  const roleName = useMemo(
    () => (roleId === ALL ? 'everyone' : roles.find((r) => r.id === roleId)?.name ?? 'the selected role'),
    [roleId, roles]
  )

  function submit(e: React.FormEvent) {
    e.preventDefault()
    let conditions: unknown = null
    if (conditionsText.trim()) {
      try {
        conditions = JSON.parse(conditionsText)
      } catch {
        setJsonError('Conditions must be valid JSON')
        return
      }
    }
    setJsonError(null)
    onSubmit({
      effect,
      action,
      subject,
      role_id: roleId === ALL ? null : roleId,
      conditions,
      description: description.trim() || null,
    })
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rule</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label>Effect</Label>
            <Select value={effect} onValueChange={(v) => setEffect(v as 'ALLOW' | 'DENY')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POLICY_EFFECTS.map((e) => (
                  <SelectItem key={e} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Action</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POLICY_ACTIONS.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {POLICY_SUBJECTS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-3">
            <Label>Applies to</Label>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Everyone in the org</SelectItem>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    Members with the {r.name} role
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conditions (optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Textarea
            rows={4}
            value={conditionsText}
            onChange={(e) => setConditionsText(e.target.value)}
            placeholder={'{ "resource.is_main": true }'}
            className="font-mono text-xs"
          />
          <p className="text-muted-foreground text-xs">
            JSON matcher over <code>resource.*</code> and <code>principal.*</code>. Empty = unconditional.
          </p>
          {jsonError ? <p className="text-destructive text-xs">{jsonError}</p> : null}
        </CardContent>
      </Card>

      <div className="space-y-1.5">
        <Label htmlFor="p-desc">Description</Label>
        <Input id="p-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Why this rule exists" />
      </div>

      <div
        className={`rounded-md border p-3 text-sm ${effect === 'DENY' ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/30 bg-green-500/5'}`}
      >
        This policy will <span className="font-semibold">{effect}</span> <span className="font-medium">{action}</span> on{' '}
        <span className="font-medium">{subject}</span> for <span className="font-medium">{roleName}</span>
        {conditionsText.trim() ? ' when the conditions match' : ''}. DENY always wins.
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving…' : mode === 'create' ? 'Create policy' : 'Save changes'}
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
