import i18n from 'i18next'

import { en } from './en'
import { lo } from './lo'
import { th } from './th'
import { vi } from './vi'
import { zh } from './zh'

/**
 * Merge the shared wizard-chrome keys (`wizard.*`) into the global `translation`
 * namespace at startup, so the products-style wizard shell components can read
 * generic controls without every module re-declaring them. Imported by the i18n
 * provider AFTER `core/i18n/index` so `init()` has already run.
 */
const BUNDLES = { en, lo, th, zh, vi } as const

for (const [lng, bundle] of Object.entries(BUNDLES)) {
  i18n.addResourceBundle(lng, 'translation', bundle, true, true)
}
