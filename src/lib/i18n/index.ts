import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { appConfig } from '@/config/app-config'

import { en } from './locales/en'
import { lo } from './locales/lo'

export const defaultNS = 'common'
export const namespaces = ['common', 'auth', 'users', 'dashboard'] as const

export const resources = { en, lo } as const

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: appConfig.defaultLocale,
    supportedLngs: appConfig.supportedLocales as unknown as string[],
    defaultNS,
    ns: namespaces as unknown as string[],
    interpolation: { escapeValue: false },
    detection: { order: ['localStorage', 'navigator'], caches: ['localStorage'] },
  })

export default i18n
