/**
 * Single source of truth for the languages the app ships.
 *
 * - `code`  — the i18next language and the `?lang=` URL value.
 * - `tag`   — the BCP-47 form persisted in server preferences (`/me/preferences`).
 * - `label` — the native-script name shown in the language switcher.
 * - `dir`   — writing direction; future-proofs `<html dir>` (none are RTL today).
 *
 * Adding a language is a one-line change here plus a locale file per bundle.
 */
export const LANGUAGE_CODES = ['en', 'lo', 'th', 'vi', 'zh'] as const

export type SupportedLocale = (typeof LANGUAGE_CODES)[number]

export const DEFAULT_LOCALE: SupportedLocale = 'en'

export interface LanguageDef {
  code: SupportedLocale
  tag: string
  label: string
  dir: 'ltr' | 'rtl'
}

export const LANGUAGES: readonly LanguageDef[] = [
  { code: 'en', tag: 'en-US', label: 'English', dir: 'ltr' },
  { code: 'lo', tag: 'lo-LA', label: 'ລາວ', dir: 'ltr' },
  { code: 'th', tag: 'th-TH', label: 'ไทย', dir: 'ltr' },
  { code: 'vi', tag: 'vi-VN', label: 'Tiếng Việt', dir: 'ltr' },
  { code: 'zh', tag: 'zh-CN', label: '简体中文', dir: 'ltr' },
]

/** Look up a language definition by its short code. */
export function languageOf(code: string): LanguageDef | undefined {
  return LANGUAGES.find((l) => l.code === code)
}

/** Map a stored BCP-47 tag (e.g. `'en-US'`) to a supported short code. */
export function tagToCode(tag: string): SupportedLocale {
  const base = tag.split('-')[0]
  return LANGUAGES.find((l) => l.tag === tag || l.code === base)?.code ?? DEFAULT_LOCALE
}

/** Map a short code back to its canonical BCP-47 tag for server preferences. */
export function codeToTag(code: string): string {
  return languageOf(code)?.tag ?? 'en-US'
}

/** Narrow an arbitrary value (URL param, navigator language) to a supported code. */
export function toSupportedLocale(value: string | undefined | null): SupportedLocale | undefined {
  if (!value) return undefined
  const base = value.split('-')[0]
  return LANGUAGE_CODES.find((c) => c === base)
}
