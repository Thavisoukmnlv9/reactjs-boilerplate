import type { authI18n } from '@/features/auth/i18n'
import type { branchesI18n } from '@/features/branches/i18n'
import type { dashboardI18n } from '@/features/dashboard/i18n'
import type { onboardingI18n } from '@/features/onboarding/i18n'
import type { policiesI18n } from '@/features/policies/i18n'
import type { rolesI18n } from '@/features/roles/i18n'
import type { usersI18n } from '@/features/users/i18n'
import type { commonBundle } from '@/lib/i18n/locales'

/**
 * Type-safe i18n. `t('key')` calls, namespace names, and `{{interpolation}}`
 * params are checked at compile time against the English source of each bundle,
 * so a typo or a key missing from a namespace is a build error.
 *
 * Add one line to `resources` for each feature as its bundle is registered in
 * `@/app/i18n` — the types are derived from the bundle descriptors, so extending
 * a feature's `en.ts` updates the keys here automatically.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common'
    resources: {
      common: (typeof commonBundle)['resources']['en']
      auth: (typeof authI18n)['resources']['en']
      branches: (typeof branchesI18n)['resources']['en']
      dashboard: (typeof dashboardI18n)['resources']['en']
      onboarding: (typeof onboardingI18n)['resources']['en']
      policies: (typeof policiesI18n)['resources']['en']
      roles: (typeof rolesI18n)['resources']['en']
      users: (typeof usersI18n)['resources']['en']
    }
  }
}
