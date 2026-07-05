import { z } from 'zod'

import { POLICY_ACTIONS, POLICY_EFFECTS, POLICY_SUBJECTS } from '@/features/policies/api/types'

/**
 * Client mirror of the backend policy contract (policy.schema.ts). `conditions`
 * is produced by the guided builder (an object) or left null; the builder itself
 * guarantees the shape the ABAC evaluator understands.
 */
export const policyFormSchema = z.object({
  effect: z.enum(POLICY_EFFECTS),
  action: z.enum(POLICY_ACTIONS),
  subject: z.enum(POLICY_SUBJECTS),
  role_id: z.string(),
  description: z.string().max(300, 'Keep the description under 300 characters'),
  conditions: z.record(z.string(), z.unknown()).nullable(),
})

export type PolicyFormValues = z.infer<typeof policyFormSchema>
