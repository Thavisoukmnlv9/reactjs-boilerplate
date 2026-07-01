export type StaticComboboxOption = { value: string; label: string }

/**
 * Adapts an in-memory option list to the `FormInfiniteCombobox` data contract.
 *
 * Use this when the choices are already loaded (or are a small static set) but
 * you still want the searchable single-select combobox UX. Search filters
 * client-side by label and everything returns as one page (no server
 * pagination, no lazy loading).
 *
 * Spread the result into `<FormInfiniteCombobox>` and supply `name` + `queryKey`.
 * Include a readiness token (e.g. `String(options.length)`) in `queryKey` so the
 * selected-value label re-resolves once async options arrive — otherwise the
 * preload caches a `null` (infinite stale time) before the data lands.
 *
 * @example
 * const source = useMemo(() => staticComboboxSource(options), [options])
 * <FormInfiniteCombobox
 *   name="category_id"
 *   queryKey={['category-picker', String(options.length)]}
 *   {...source}
 * />
 */
export function staticComboboxSource(options: StaticComboboxOption[]) {
  return {
    queryFn: async ({ search }: { search: string; pageParam: number }) => {
      const q = search.trim().toLowerCase()
      const items = q
        ? options.filter((o) => o.label.toLowerCase().includes(q))
        : options
      return { items, nextPage: null as number | null }
    },
    preloadQueryFn: async (id: string) =>
      options.find((o) => o.value === id) ?? null,
    getLabel: (o: StaticComboboxOption) => o.label,
    getValue: (o: StaticComboboxOption) => o.value,
  }
}
