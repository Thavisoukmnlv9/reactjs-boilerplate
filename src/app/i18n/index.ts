
import { authI18n } from '@/features/auth/i18n'
import { branchesI18n } from '@/features/branches/i18n'
import { dashboardI18n } from '@/features/dashboard/i18n'
import { onboardingI18n } from '@/features/onboarding/i18n'
import { policiesI18n } from '@/features/policies/i18n'
import { rolesI18n } from '@/features/roles/i18n'
import { usersI18n } from '@/features/users/i18n'
import { initI18n } from '@/lib/i18n'
import { initFontPreloader } from '@/lib/i18n/font-preloader'
import { commonBundle } from '@/lib/i18n/locales'

/**
 * Composition root for i18n. The app layer is the one place allowed to import
 * every feature bundle; it composes them and initializes the shared i18next
 * instance once, synchronously, at module load. Feature bundles are appended
 * here as each feature is migrated.
 */
export const featureBundles = [
  commonBundle,
  authI18n,
  branchesI18n,
  dashboardI18n,
  onboardingI18n,
  policiesI18n,
  rolesI18n,
  usersI18n,
] as const

export const i18n = initI18n(featureBundles)

// Warm per-script fonts and keep <html lang>/<dir> in sync with the language.
initFontPreloader()

export default i18n
