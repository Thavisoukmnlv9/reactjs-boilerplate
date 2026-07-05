import type { I18nFeatureBundle } from '@/lib/i18n/types'

import { en } from './en'
import { lo } from './lo'
import { th } from './th'
import { vi } from './vi'
import { zh } from './zh'

export const rolesI18n = {
  namespace: 'roles',
  resources: { en, lo, th, vi, zh },
} as const satisfies I18nFeatureBundle
