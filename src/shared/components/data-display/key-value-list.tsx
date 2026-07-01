interface KeyValueListProps {
  items: Array<{ label: string; value: string | number | null | undefined }>
}

export function KeyValueList({ items }: KeyValueListProps) {
  return (
    <dl className="divide-y">
      {items.map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between py-3">
          <dt className="text-sm text-muted-foreground">{label}</dt>
          <dd className="text-sm font-medium">{value ?? '—'}</dd>
        </div>
      ))}
    </dl>
  )
}
