import { Link } from '@tanstack/react-router'
import { MODULES } from '@/core/constants/modules'
import { useHasModule } from '@/core/entitlements/entitlement-hooks'

export function ModuleSwitcher() {
  return (
    <div className="flex flex-wrap gap-2">
      {MODULES.map((m) => {
        const hasModule = useHasModule(m.code)
        if (!hasModule) return null
        return (
          <Link
            key={m.code}
            // biome-ignore lint/suspicious/noExplicitAny: module paths may not all be wired up yet
            to={m.path as any}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent transition-colors"
          >
            {m.label}
          </Link>
        )
      })}
    </div>
  )
}
