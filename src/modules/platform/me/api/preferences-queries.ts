// Stub standing in for the portal's "me preferences" module, so the vendored
// LanguageSwitcher compiles side-by-side. Wire to a real API to persist prefs.

export interface MePreferences {
  locale: string
  language?: string
  theme?: string
}

export function useMePreferencesQuery() {
  return { data: undefined as MePreferences | undefined, isLoading: false }
}

export function useUpdateMePreferencesMutation() {
  return { mutate: (_input: Partial<MePreferences>) => {}, isPending: false }
}
