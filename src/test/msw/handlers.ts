import type { RequestHandler } from 'msw'

/**
 * MSW is disabled by default (VITE_ENABLE_MOCKS=false) — the app runs against the
 * real Node backend on :8080. Add handlers here only if you want to develop the UI
 * without a backend.
 */
export const handlers: RequestHandler[] = []
