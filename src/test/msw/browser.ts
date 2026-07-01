import { setupWorker } from 'msw/browser'

import { handlers } from './handlers'

/** MSW worker for the browser (dev mock mode). Started from src/main.tsx. */
export const worker = setupWorker(...handlers)
