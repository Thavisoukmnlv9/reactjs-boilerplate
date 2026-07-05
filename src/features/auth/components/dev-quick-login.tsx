import { Briefcase, Crown, Loader2, ScanLine, ShieldCheck, User } from 'lucide-react'
import type { ComponentType } from 'react'

import { cn } from '@/core/utils/cn'

/**
 * Dev-only quick sign-in. Mirrors the backend seed
 * (`nodejs-boilerplate/scripts/seed/dev/users.ts`): one account per system role,
 * all sharing `DEMO_PASSWORD`. The login page renders this only under
 * `import.meta.env.DEV`, so it is statically dropped from production bundles.
 */
const DEMO_PASSWORD = 'Password123'

interface DemoPersona {
  email: string
  role: string
  hint: string
  Icon: ComponentType<{ className?: string }>
}

const DEMO_PERSONAS: DemoPersona[] = [
  { email: 'owner@demo.test', role: 'Owner', hint: 'Full access · billing & org', Icon: Crown },
  { email: 'admin@demo.test', role: 'Admin', hint: 'Members, roles & settings', Icon: ShieldCheck },
  { email: 'manager@demo.test', role: 'Manager', hint: 'Operate a branch & its staff', Icon: Briefcase },
  { email: 'member@demo.test', role: 'Member', hint: 'Standard staff access', Icon: User },
  { email: 'cashier@demo.test', role: 'Cashier', hint: 'Point-of-sale only', Icon: ScanLine },
]

interface Props {
  onPick: (email: string, password: string) => void
  pendingEmail: string | null
  disabled: boolean
}

export function DevQuickLogin({ onPick, pendingEmail, disabled }: Props) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
          Dev quick sign-in
        </span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <div className="space-y-2">
        {DEMO_PERSONAS.map(({ email, role, hint, Icon }) => {
          const isPending = pendingEmail === email
          return (
            <button
              key={email}
              type="button"
              disabled={disabled}
              onClick={() => onPick(email, DEMO_PASSWORD)}
              aria-label={`Use ${role} demo account (${email})`}
              className={cn(
                'group flex w-full items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-left transition-all',
                'hover:border-primary/40 hover:bg-accent hover:shadow-xs',
                'focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                'disabled:pointer-events-none disabled:opacity-50',
                isPending && 'border-primary/50 bg-accent',
              )}
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                <Icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium leading-tight">{role}</span>
                  {isPending ? (
                    <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" />
                  ) : (
                    <span className="shrink-0 font-mono text-[0.7rem] text-muted-foreground">{email}</span>
                  )}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{hint}</span>
              </span>
            </button>
          )
        })}
      </div>

      <p className="mt-3 text-center text-[0.7rem] text-muted-foreground">
        Seeded accounts · password <span className="font-mono">{DEMO_PASSWORD}</span> · development only
      </p>
    </div>
  )
}
