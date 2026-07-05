import type React from 'react'
import { cn } from '@/core/utils/cn'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'

/**
 * The canonical "who/what is this row" cell shared across every admin table
 * (users, roles, branches, policies). A leading avatar or icon tile, a primary
 * line, and a muted monospace secondary line (email, code, id) so identifiers stay
 * scannable and align. Keeping one component means the four tables read as one
 * system rather than four bespoke layouts.
 */

function initialsOf(text: string): string {
  const letters = text
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
  return letters.toUpperCase() || '?'
}

type Props = {
  primary: React.ReactNode
  secondary?: React.ReactNode
  /** Avatar image (falls back to initials of `avatarText`/`primary`). */
  avatarUrl?: string | null
  avatarText?: string
  /** Use an icon tile instead of an avatar (e.g. a branch or policy glyph). */
  icon?: React.ReactNode
  className?: string
}

export function IdentityCell({ primary, secondary, avatarUrl, avatarText, icon, className }: Props) {
  const seed = avatarText ?? (typeof primary === 'string' ? primary : '?')
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      {icon ? (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-4">
          {icon}
        </span>
      ) : (
        <Avatar className="size-8 shrink-0">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
          <AvatarFallback className="text-xs">{initialsOf(seed)}</AvatarFallback>
        </Avatar>
      )}
      <div className="min-w-0">
        <div className="truncate font-medium leading-tight">{primary}</div>
        {secondary != null && secondary !== '' ? (
          <div className="truncate font-mono text-muted-foreground text-xs leading-tight">{secondary}</div>
        ) : null}
      </div>
    </div>
  )
}
