import type { FieldErrors, FieldValues } from 'react-hook-form'

function walk(errors: unknown, out: string[]) {
  if (!errors || typeof errors !== 'object') return
  const obj = errors as Record<string, unknown>
  const msg = obj.message
  if (typeof msg === 'string' && msg.trim()) {
    out.push(msg)
    return
  }
  for (const v of Object.values(obj)) {
    if (Array.isArray(v)) {
      for (const item of v) walk(item, out)
    } else {
      walk(v, out)
    }
  }
}

export function flattenFieldErrors<T extends FieldValues>(
  errors: FieldErrors<T>
): string[] {
  const out: string[] = []
  walk(errors, out)
  return out
}
