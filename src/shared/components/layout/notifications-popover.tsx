import { Link } from '@tanstack/react-router'
import { Bell, CheckCheck } from 'lucide-react'
import { useMemo } from 'react'
import { authStore } from '@/core/auth/auth-store'
import {
  type PlatformNotification,
  useMarkAllNotificationsReadMutation,
  useNotificationsQuery,
} from '@/modules/notifications/api/queries'
import { Button } from '@/shared/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover'

const MAX_PREVIEW = 8

export function NotificationsPopover() {
  const userId = authStore((s) => s.user?.id)
  const query = useNotificationsQuery(userId)
  const markAll = useMarkAllNotificationsReadMutation(userId)

  const items = query.data ?? []
  const unread = useMemo(() => items.filter((n) => !n.read_at).length, [items])
  const previewItems = items.slice(0, MAX_PREVIEW)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={
            unread > 0 ? `Notifications (${unread} unread)` : 'Notifications'
          }
          className="relative"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 ? (
            <span
              aria-hidden
              className="-right-0.5 -top-0.5 absolute flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 font-semibold text-[10px] text-primary-foreground tabular-nums"
            >
              {unread > 99 ? '99+' : unread}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 p-0"
        aria-label="Notifications"
      >
        <header className="flex items-center justify-between gap-2 border-b px-4 py-2">
          <h2 className="font-semibold text-sm">Notifications</h2>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => markAll.mutate()}
            disabled={markAll.isPending || unread === 0}
            className="h-8 gap-1.5 px-2 text-xs"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        </header>

        <div role="list" className="max-h-96 overflow-y-auto py-1">
          {query.isLoading ? (
            <Empty label="Loading…" />
          ) : query.isError ? (
            <Empty label="Couldn't load notifications" />
          ) : previewItems.length === 0 ? (
            <Empty label="You're all caught up." />
          ) : (
            previewItems.map((n) => <Row key={n.id} item={n} />)
          )}
        </div>

        <footer className="border-t px-3 py-2 text-center">
          <Button
            asChild
            variant="link"
            size="sm"
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            <Link to="/notifications">View all</Link>
          </Button>
        </footer>
      </PopoverContent>
    </Popover>
  )
}

function Row({ item }: { item: PlatformNotification }) {
  const isUnread = !item.read_at
  return (
    <div
      role="listitem"
      className="flex items-start gap-2 px-3 py-2 hover:bg-accent"
    >
      <span
        aria-hidden
        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
          isUnread ? 'bg-primary' : 'bg-transparent'
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-sm">{item.title}</p>
        {item.body ? (
          <p className="line-clamp-2 text-muted-foreground text-xs">
            {item.body}
          </p>
        ) : null}
        <time
          className="mt-1 block text-muted-foreground text-[10px]"
          dateTime={item.created_at}
        >
          {formatRelative(item.created_at)}
        </time>
      </div>
    </div>
  )
}

function Empty({ label }: { label: string }) {
  return (
    <p className="py-6 text-center text-muted-foreground text-sm">{label}</p>
  )
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diff = Date.now() - then
  const min = Math.round(diff / 60_000)
  if (min < 1) return 'Just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.round(hr / 24)
  if (day < 7) return `${day}d ago`
  return new Date(iso).toLocaleDateString()
}
