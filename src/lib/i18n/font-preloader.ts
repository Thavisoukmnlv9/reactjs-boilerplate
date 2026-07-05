import i18next from 'i18next'
import type { SupportedLang } from '@/routes/__root'

/**
 * Maps each language to the font files its script needs. Vietnamese and English
 * share the Latin face (already preloaded via index.html), so they have no
 * extra fonts to warm up here. `unicode-range` in fonts.css guarantees the
 * file *will* eventually load when a glyph appears — this preloader just
 * skips the FOIT window when the user actively switches language.
 */
const FONTS_BY_LANG: Record<SupportedLang, readonly string[]> = {
  en: [],
  vi: [],
  lo: [
    '/fonts/noto-sans-lao-regular.woff2',
    '/fonts/noto-sans-lao-medium.woff2',
    '/fonts/noto-sans-lao-bold.woff2',
  ],
  th: [
    '/fonts/noto-sans-thai-regular.woff2',
    '/fonts/noto-sans-thai-medium.woff2',
    '/fonts/noto-sans-thai-bold.woff2',
  ],
  zh: [
    '/fonts/noto-sans-sc-regular.woff2',
    '/fonts/noto-sans-sc-medium.woff2',
    '/fonts/noto-sans-sc-bold.woff2',
  ],
}

const preloaded = new Set<string>()

function preloadFont(href: string): void {
  if (preloaded.has(href)) return
  preloaded.add(href)
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'font'
  link.type = 'font/woff2'
  link.href = href
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)
}

function isSupportedLang(value: string): value is SupportedLang {
  return value in FONTS_BY_LANG
}

function applyLang(lang: string): void {
  const code = lang.split('-')[0]
  if (!isSupportedLang(code)) return
  document.documentElement.lang = code
  for (const href of FONTS_BY_LANG[code]) preloadFont(href)
}

let initialized = false

export function initFontPreloader(): void {
  if (initialized) return
  initialized = true
  applyLang(i18next.language ?? 'en')
  i18next.on('languageChanged', applyLang)
}
