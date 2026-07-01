import type { ReactNode } from 'react'

interface TimelineItem {
  id: string
  title: string
  description?: string
  timestamp: string
  icon?: ReactNode
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative border-l border-muted">
      {items.map((item) => (
        <li key={item.id} className="mb-6 ml-4">
          <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-muted" />
          <p className="text-sm font-semibold">{item.title}</p>
          {item.description && (
            <p className="text-xs text-muted-foreground">{item.description}</p>
          )}
          <time className="text-xs text-muted-foreground">
            {item.timestamp}
          </time>
        </li>
      ))}
    </ol>
  )
}
