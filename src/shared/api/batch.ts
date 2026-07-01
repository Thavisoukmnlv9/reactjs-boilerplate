import type { BulkResult } from '@/shared/api/run-bulk'

/** Shape returned by the backend `/batch/*` endpoints. */
export type BatchResultPayload = {
  requested: number
  affected: number
}

/**
 * Adapt a single batch-endpoint response into the same `{ total, succeeded,
 * failed }` shape that `runBulk` produces, so `bulkToastMessage` and the bulk
 * UX work identically whether a resource has a real batch endpoint or falls
 * back to fanning out single calls.
 */
export function batchToBulkResult(
  data: BatchResultPayload | { item: BatchResultPayload }
): BulkResult {
  const payload = 'item' in data ? data.item : data
  const total = payload.requested
  const succeeded = payload.affected
  return { total, succeeded, failed: Math.max(0, total - succeeded) }
}
