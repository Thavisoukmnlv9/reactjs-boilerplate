import i18n from 'i18next'

import { en } from './en'
import { lo } from './lo'
import { th } from './th'
import { vi } from './vi'
import { zh } from './zh'

const BUNDLES = { en, lo, th, zh, vi } as const

for (const [lng, bundle] of Object.entries(BUNDLES)) {
  i18n.addResourceBundle(lng, 'translation', bundle, true, true)
}
