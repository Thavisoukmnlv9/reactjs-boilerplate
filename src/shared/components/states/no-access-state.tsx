import { Lock } from 'lucide-react'

export function NoAccessState({
  message = "You don't have permission to access this.",
}: {
  message?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Lock className="mb-4 h-10 w-10 text-muted-foreground" />
      <h3 className="text-lg font-semibold">Access Denied</h3>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
