/**
 * `useFormOptions(resource)` — fetches dropdown choices + validation constraints from
 * `GET /api/v1/pos-shop/<resource>/form-options`. Replaces hardcoded enum arrays in
 * the admin UI.
 *
 * Usage:
 *   const { data: opts, isLoading } = useFormOptions('suppliers')
 *   const statusOptions = opts?.fields.status.options ?? []
 *   const nameMaxLength = opts?.constraints.name?.max_length ?? 120
 */

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/core/api/api-client'
import type { ApiResponse } from '@/core/types/api'

export type FormOption = {
  value: string
  label: string
  description?: string | null
  disabled?: boolean
}

export type FormOptionGroup = {
  options: FormOption[]
  default?: string | null
}

export type FormOptionsPayload = {
  fields: Record<string, FormOptionGroup>
  constraints: Record<string, Record<string, unknown>>
}

export const formOptionsKeys = {
  all: ['shop-form-options'] as const,
  resource: (resource: string) => [...formOptionsKeys.all, resource] as const,
}

export type ShopResource =
  | 'suppliers'
  | 'customers'
  | 'products'
  | 'variants'
  | 'categories'
  | 'branches'
  | 'promotions'
  | 'purchase-orders'
  | 'customer-purchase-orders'
  | 'stock-transfers'
  | 'returns'
  | 'barcodes'
  | 'bill-config'
  | 'tax'
  | 'settings'
  | 'inventories'
  | 'audit'
  | 'orders'

const EMPTY: FormOptionsPayload = { fields: {}, constraints: {} }

export function useFormOptions(resource: ShopResource) {
  return useQuery({
    queryKey: formOptionsKeys.resource(resource),
    queryFn: async (): Promise<FormOptionsPayload> => {
      try {
        const res = (await apiClient.get(
          `/pos-shop/${resource}/form-options`
        )) as ApiResponse<FormOptionsPayload>
        const d = res?.data
        if (d && typeof d === 'object' && 'fields' in d) {
          return d as FormOptionsPayload
        }
        return EMPTY
      } catch {
        return EMPTY
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes — options rarely change
  })
}

/**
 * Convenience selector — pulls a single field's options out of the payload,
 * with optional fallback for when the request is still in flight.
 */
export function selectFieldOptions(
  payload: FormOptionsPayload | undefined,
  field: string,
  fallback: FormOption[] = []
): FormOption[] {
  return payload?.fields[field]?.options ?? fallback
}

export function selectFieldDefault(
  payload: FormOptionsPayload | undefined,
  field: string
): string | undefined {
  return payload?.fields[field]?.default ?? undefined
}

export function selectConstraint<T = unknown>(
  payload: FormOptionsPayload | undefined,
  field: string,
  key: string
): T | undefined {
  return payload?.constraints[field]?.[key] as T | undefined
}
