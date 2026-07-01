/**
 * Runs a per-id mutation across a selection and reports how many succeeded.
 *
 * Used as the fallback for resources without a dedicated `/batch/*` endpoint:
 * bulk actions fan the existing single-entity calls out concurrently and
 * tolerate partial failure — one rejected id never aborts the rest. Resources
 * that DO have a batch endpoint use it via `batchToBulkResult` instead.
 */
export type BulkResult = {
  total: number
  succeeded: number
  failed: number
}

export async function runBulk<T>(
  ids: readonly T[],
  fn: (id: T) => Promise<unknown>
): Promise<BulkResult> {
  const results = await Promise.allSettled(ids.map((id) => fn(id)))
  const failed = results.filter((r) => r.status === 'rejected').length
  return {
    total: ids.length,
    failed,
    succeeded: ids.length - failed,
  }
}

/** Standard toast copy for a finished bulk run. */
export function bulkToastMessage(
  res: BulkResult,
  noun: { one: string; other: string },
  verb: string
): string {
  const okWord = res.succeeded === 1 ? noun.one : noun.other
  if (res.failed === 0) return `${res.succeeded} ${okWord} ${verb}`
  return `${res.succeeded} ${okWord} ${verb}, ${res.failed} failed`
}
