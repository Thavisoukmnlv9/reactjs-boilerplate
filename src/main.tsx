import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { env } from '@/config/env'
import { initMonitoring } from '@/lib/monitoring/sentry'

import { App } from './App'
import '@/styles/globals.css'

initMonitoring()

/**
 * Serve the app from MSW handlers in dev so it runs with no backend. The
 * `import.meta.env.DEV` guard is statically false in prod builds, so the MSW
 * worker is tree-shaken out of the production bundle entirely.
 */
async function enableMocking(): Promise<void> {
  if (import.meta.env.DEV && env.enableMocks) {
    const { worker } = await import('@/test/msw/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }
}

void enableMocking().then(() => {
  const rootEl = document.getElementById('root')
  if (!rootEl) throw new Error('Root element #root not found')
  createRoot(rootEl).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
