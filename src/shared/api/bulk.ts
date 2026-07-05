/**
 * Shared client shape for the bulk-action endpoints. Each `POST /{resource}/bulk`
 * returns per-id outcomes so the table's selection bar can show an honest
 * partial-success toast ("3 removed · 1 skipped: owner") instead of pretending
 * everything worked.
 */
export interface BulkResult {
  succeeded: string[]
  failed: { id: string; reason: string }[]
}

/** Turn a BulkResult into a toast: `ok` picks success vs error styling. */
export function summarizeBulk(result: BulkResult, verb: string): { ok: boolean; message: string } {
  const done = result.succeeded.length
  const skipped = result.failed.length
  const reason = result.failed[0]?.reason
  if (skipped === 0) return { ok: true, message: `${done} ${verb}` }
  if (done === 0) return { ok: false, message: `Nothing ${verb} — ${skipped} skipped${reason ? `: ${reason}` : ''}` }
  return { ok: true, message: `${done} ${verb} · ${skipped} skipped${reason ? ` (${reason})` : ''}` }
}
