import { Braces, ListTree, Plus, X } from 'lucide-react'
import { useMemo, useState } from 'react'

import type { ConditionField } from '@/features/policies/api/types'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'

type Conditions = Record<string, unknown> | null
interface Row {
  id: string
  path: string
  op: string
  value: string
}

const DEFAULT_OPS: Record<string, string[]> = {
  boolean: ['eq', 'ne'],
  enum: ['eq', 'ne'],
  number: ['eq', 'ne', 'lt', 'lte', 'gt', 'gte'],
  string: ['eq', 'ne', 'contains'],
  'string[]': ['contains'],
}

const uid = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `r${Date.now()}${Math.round(Math.random() * 1e6)}`)

function stringifyOperand(v: unknown): string {
  if (Array.isArray(v)) return v.join(', ')
  if (v === null || v === undefined) return ''
  return String(v)
}

function conditionsToRows(value: Conditions): Row[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return []
  return Object.entries(value).map(([path, matcher]) => {
    if (matcher && typeof matcher === 'object' && !Array.isArray(matcher)) {
      const entries = Object.entries(matcher as Record<string, unknown>)
      if (entries.length === 1) return { id: uid(), path, op: entries[0][0], value: stringifyOperand(entries[0][1]) }
    }
    return { id: uid(), path, op: 'eq', value: stringifyOperand(matcher) }
  })
}

function coerce(value: string, type?: string): unknown {
  if (type === 'boolean') return value === 'true'
  if (type === 'number') {
    const n = Number(value)
    return Number.isFinite(n) ? n : value
  }
  return value
}

function rowsToConditions(rows: Row[], byPath: Map<string, ConditionField>): Conditions {
  const out: Record<string, unknown> = {}
  for (const r of rows) {
    if (!r.path) continue
    const type = byPath.get(r.path)?.type
    const operand = r.op === 'in' || r.op === 'nin' ? r.value.split(',').map((s) => coerce(s.trim(), type)) : coerce(r.value, type)
    out[r.path] = r.op === 'eq' ? operand : { [r.op]: operand }
  }
  return Object.keys(out).length ? out : null
}

interface Props {
  value: Conditions
  onChange: (next: Conditions) => void
  /** Fields available for the current subject (principal + resource attributes). */
  fields: ConditionField[]
  operators: { value: string; label: string }[]
}

export function PolicyConditionBuilder({ value, onChange, fields, operators }: Props) {
  const [rows, setRows] = useState<Row[]>(() => conditionsToRows(value))
  const [raw, setRaw] = useState(false)
  const [rawText, setRawText] = useState(() => (value ? JSON.stringify(value, null, 2) : ''))
  const [rawError, setRawError] = useState<string | null>(null)

  const byPath = useMemo(() => new Map(fields.map((f) => [f.path, f])), [fields])
  const opLabel = useMemo(() => new Map(operators.map((o) => [o.value, o.label])), [operators])

  function commit(next: Row[]) {
    setRows(next)
    onChange(rowsToConditions(next, byPath))
  }

  const addRow = () => commit([...rows, { id: uid(), path: fields[0]?.path ?? '', op: 'eq', value: '' }])
  const removeRow = (id: string) => commit(rows.filter((r) => r.id !== id))
  const updateRow = (id: string, patch: Partial<Row>) => commit(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))

  function enterRaw() {
    setRawText(value ? JSON.stringify(value, null, 2) : '')
    setRawError(null)
    setRaw(true)
  }
  function applyRaw(text: string) {
    setRawText(text)
    if (!text.trim()) {
      setRawError(null)
      onChange(null)
      setRows([])
      return
    }
    try {
      const parsed = JSON.parse(text)
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('Must be a JSON object')
      setRawError(null)
      onChange(parsed)
      setRows(conditionsToRows(parsed))
    } catch (e) {
      setRawError((e as Error).message)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          Rows are combined with AND. Empty means the policy always applies.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={() => (raw ? setRaw(false) : enterRaw())}
        >
          {raw ? <ListTree className="size-3.5" /> : <Braces className="size-3.5" />}
          {raw ? 'Guided' : 'Raw JSON'}
        </Button>
      </div>

      {raw ? (
        <div className="space-y-1.5">
          <Textarea
            rows={5}
            value={rawText}
            onChange={(e) => applyRaw(e.target.value)}
            placeholder={'{ "resource.is_main": true }'}
            className="font-mono text-xs"
            aria-invalid={Boolean(rawError)}
          />
          {rawError ? <p className="text-destructive text-xs">{rawError}</p> : null}
        </div>
      ) : (
        <div className="space-y-2">
          {rows.length === 0 ? (
            <p className="rounded-lg border border-dashed px-3 py-4 text-center text-muted-foreground text-sm">
              No conditions — this policy is unconditional.
            </p>
          ) : (
            rows.map((row) => {
              const field = byPath.get(row.path)
              const ops = field ? field.operators ?? DEFAULT_OPS[field.type] ?? ['eq'] : ['eq', 'ne']
              const pathOptions = field ? fields : [...fields, { path: row.path, label: row.path, type: 'string' as const }]
              return (
                <div key={row.id} className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/20 p-2">
                  <Select value={row.path} onValueChange={(v) => updateRow(row.id, { path: v })}>
                    <SelectTrigger className="h-8 w-[190px] text-xs">
                      <SelectValue placeholder="Attribute" />
                    </SelectTrigger>
                    <SelectContent>
                      {pathOptions.map((f) => (
                        <SelectItem key={f.path} value={f.path} className="text-xs">
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={row.op} onValueChange={(v) => updateRow(row.id, { op: v })}>
                    <SelectTrigger className="h-8 w-[120px] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ops.map((op) => (
                        <SelectItem key={op} value={op} className="text-xs">
                          {opLabel.get(op) ?? op}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ConditionValueInput field={field} value={row.value} onChange={(v) => updateRow(row.id, { value: v })} />
                  <Button type="button" variant="ghost" size="icon" className="size-8 shrink-0" aria-label="Remove condition" onClick={() => removeRow(row.id)}>
                    <X className="size-4" />
                  </Button>
                </div>
              )
            })
          )}
          {fields.length > 0 ? (
            <Button type="button" variant="outline" size="sm" className="gap-1.5" onClick={addRow}>
              <Plus className="size-3.5" /> Add condition
            </Button>
          ) : (
            <p className="text-muted-foreground text-xs">No attributes available for this subject.</p>
          )}
        </div>
      )}
    </div>
  )
}

function ConditionValueInput({
  field,
  value,
  onChange,
}: {
  field?: ConditionField
  value: string
  onChange: (v: string) => void
}) {
  if (field?.type === 'boolean') {
    return (
      <Select value={value || 'true'} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true" className="text-xs">true</SelectItem>
          <SelectItem value="false" className="text-xs">false</SelectItem>
        </SelectContent>
      </Select>
    )
  }
  if (field?.type === 'enum' && field.options) {
    return (
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-8 w-[150px] text-xs">
          <SelectValue placeholder="Value" />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((o) => (
            <SelectItem key={o} value={o} className="text-xs">
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={field?.type === 'number' ? 'number' : 'text'}
      placeholder="Value"
      className="h-8 w-[150px] text-xs"
    />
  )
}
