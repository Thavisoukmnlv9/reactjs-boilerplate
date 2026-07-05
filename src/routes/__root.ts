// Compatibility shim: the vendored src/shared + src/core reference this type
// from the portal's route root. The canonical definition now lives in the
// single language source of truth (`@/config/languages`).
export type { SupportedLocale as SupportedLang } from '@/config/languages'
