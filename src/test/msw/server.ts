import { setupServer } from 'msw/node'

import { handlers } from './handlers'

/** MSW server for the Vitest (Node) environment. */
export const server = setupServer(...handlers)
