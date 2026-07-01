// Stub standing in for the portal's notifications module, so the vendored
// NotificationsPopover compiles side-by-side. Wire to a real API to enable it.

export interface PlatformNotification {
  id: string
  created_at: string
  title?: string
  body?: string
  message?: string
  read_at?: string | null
  href?: string
  type?: string
}

export function useNotificationsQuery(_userId?: string) {
  return { data: [] as PlatformNotification[], isLoading: false, isError: false }
}

export function useMarkAllNotificationsReadMutation(_userId?: string) {
  return { mutate: () => {}, isPending: false }
}
