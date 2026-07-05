import type { I18nFeatureBundle } from '@/lib/i18n/types'

import { en } from './en'
import { lo } from './lo'
import { th } from './th'
import { vi } from './vi'
import { zh } from './zh'

export const dashboardI18n = {
  namespace: 'dashboard',
  resources: { en, lo, th, vi, zh },
} as const satisfies I18nFeatureBundle
