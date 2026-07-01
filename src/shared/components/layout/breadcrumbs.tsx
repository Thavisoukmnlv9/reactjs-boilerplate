import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  path?: string
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          {i > 0 && <ChevronRight className="h-3 w-3 mx-1" />}
          {item.path ? (
            <Link
              to={item.path}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
