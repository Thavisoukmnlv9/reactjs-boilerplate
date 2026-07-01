import { z } from 'zod'

/**
 * Runtime-validated environment. Import `env` anywhere instead of touching
 * `import.meta.env` directly — this gives you typed, parsed, fail-fast config.
 */
const optionalBool = z
  .enum(['true', 'false'])
  .optional()
  .transform((v) => (v === undefined ? undefined : v === 'true'))

const schema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:8080/api/v1'),
  VITE_APP_NAME: z.string().min(1).default('React Boilerplate'),
  VITE_SENTRY_DSN: z.string().optional().default(''),
  VITE_ENABLE_SENTRY: optionalBool,
  VITE_ENABLE_PWA: optionalBool,
  VITE_ENABLE_MOCKS: optionalBool,
})

const parsed = schema.safeParse(import.meta.env)

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors)
  throw new Error('Invalid environment variables — see console output above.')
}

export const env = {
  apiBaseUrl: parsed.data.VITE_API_BASE_URL,
  appName: parsed.data.VITE_APP_NAME,
  sentryDsn: parsed.data.VITE_SENTRY_DSN,
  enableSentry: parsed.data.VITE_ENABLE_SENTRY ?? false,
  enablePwa: parsed.data.VITE_ENABLE_PWA ?? false,
  // Mocks default ON in dev so the app runs end-to-end with no backend.
  enableMocks: parsed.data.VITE_ENABLE_MOCKS ?? import.meta.env.DEV,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const
