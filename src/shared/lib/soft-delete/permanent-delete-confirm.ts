import { apiClient } from '@/core/api/api-client'

export interface VerifyManagerPinResponse {
  token: string
  expires_at: string
}

/**
 * Calls POST /api/v1/security/manager-pin/verify with the PIN and returns the
 * short-lived elevation token to send as X-Manager-Authorization on the
 * subsequent permanent-delete request.
 */
export async function verifyManagerPin(
  pin: string
): Promise<VerifyManagerPinResponse> {
  return apiClient.post<VerifyManagerPinResponse>(
    '/security/manager-pin/verify',
    { pin }
  )
}

export interface PermanentDeleteParams {
  managerPin: string
  /** Calls the backend permanent-delete endpoint with the elevation token. */
  onConfirm: (managerToken: string) => Promise<void>
}

/**
 * Verify the manager PIN, then call the caller's permanent-delete with the
 * resulting elevation token. The caller is responsible for sending the token
 * as the X-Manager-Authorization header.
 */
export async function permanentDeleteWithPin({
  managerPin,
  onConfirm,
}: PermanentDeleteParams): Promise<void> {
  const { token } = await verifyManagerPin(managerPin)
  await onConfirm(token)
}
