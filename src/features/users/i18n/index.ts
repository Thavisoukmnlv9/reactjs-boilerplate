import type { I18nFeatureBundle } from '@/lib/i18n/types'

import { en } from './en'
import { lo } from './lo'
import { th } from './th'
import { vi } from './vi'
import { zh } from './zh'

export const usersI18n = {
  namespace: 'users',
  resources: { en, lo, th, vi, zh },
} as const satisfies I18nFeatureBundle
