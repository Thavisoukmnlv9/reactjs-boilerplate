import { Lock, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useCanCheck } from '@/core/access'
import { usePermissionsQuery } from '@/features/roles/api/queries'
import {
  applyModule,
  computeModuleStats,
  filterGrantablePerms,
  filterGroupsByQuery,
  isDangerCode,
  toggleCode,
} from '@/features/roles/components/permission-tree'
import {
  actionTone,
  DANGER_ZONE_CODES,
  groupByModule,
  labelForCode,
  moduleLabel,
} from '@/features/roles/lib/permission-catalog'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { Progress } from '@/shared/components/ui/progress'

const toneClass: Record<string, string> = {
  neutral: 'bg-muted text-muted-foreground',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  warn: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  danger: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

interface Props {
  value: string[]
  onChange: (codes: string[]) => void
  disabled?: boolean
}

export function PermissionMatrix({ value, onChange, disabled }: Props) {
  const { data: perms = [], isLoading } = usePermissionsQuery()
  const canGrant = useCanCheck()
  const [query, setQuery] = useState('')
  const selected = useMemo(() => new Set(value), [value])
  // Only surface permissions the current user can actually grant; the server
  // 422s on the rest (privilege-escalation guard). Selected codes are kept so
  // editing a role never hides one of its existing grants.
  const groups = useMemo(
    () => groupByModule(filterGrantablePerms(perms, canGrant, selected)),
    [perms, canGrant, selected]
  )
  const q = query.trim().toLowerCase()

  const visible = filterGroupsByQuery(groups, q)

  const isDanger = (code: string) => isDangerCode(code, DANGER_ZONE_CODES)

  function toggle(code: string) {
    if (disabled || isDanger(code)) return
    onChange(toggleCode(value, code, DANGER_ZONE_CODES))
  }

  function setModule(codes: string[], on: boolean) {
    if (disabled) return
    onChange(applyModule(value, codes, on, DANGER_ZONE_CODES))
  }

  if (isLoading) return <div className="text-muted-foreground text-sm">Loading permissions…</div>

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search permissions…"
          className="pl-8"
        />
      </div>
      <Accordion type="multiple" className="rounded-md border">
        {visible.map((g) => {
          const { grantable, granted, pct, checkedState } = computeModuleStats(
            g.perms,
            selected,
            DANGER_ZONE_CODES
          )
          return (
            <AccordionItem key={g.module} value={g.module} className="px-3">
              <div className="flex items-center gap-3 py-1">
                <Checkbox
                  checked={checkedState}
                  disabled={disabled}
                  onCheckedChange={(c) => setModule(grantable, c === true)}
                  aria-label={`Grant all ${g.module}`}
                />
                <AccordionTrigger className="flex-1">
                  <span className="flex flex-1 items-center justify-between gap-3 pr-2">
                    <span className="font-medium">{moduleLabel(g.module)}</span>
                    <span className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        {granted}/{grantable.length}
                      </span>
                      <Progress value={pct} className="h-1.5 w-16" />
                    </span>
                  </span>
                </AccordionTrigger>
              </div>
              <AccordionContent>
                <div className="space-y-0.5 pb-2">
                  {g.perms.map((p) => {
                    const danger = isDanger(p.code)
                    return (
                      <label
                        key={p.code}
                        className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 rounded px-2 py-1.5 text-sm"
                      >
                        <Checkbox
                          checked={selected.has(p.code)}
                          disabled={disabled || danger}
                          onCheckedChange={() => toggle(p.code)}
                        />
                        <span className="flex-1 capitalize">{labelForCode(p.code)}</span>
                        {danger ? (
                          <Badge variant="outline" className="gap-1 text-xs">
                            <Lock className="size-3" /> Owner only
                          </Badge>
                        ) : (
                          <span className={`rounded px-1.5 py-0.5 text-[10px] ${toneClass[actionTone(p.code)]}`}>
                            {p.code.split('.').pop()}
                          </span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
