export function toErrorMessage(err: unknown) {
  if (!err) return ''
  if (typeof err === 'string') return err
  if (typeof err === 'object' && err && 'message' in (err as any))
    return String((err as any).message)
  return String(err)
}
