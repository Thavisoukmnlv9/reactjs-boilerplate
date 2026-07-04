import { Button } from '@/components/ui/button'

/** TanStack Router `errorComponent` — receives the thrown error as a prop. */
export function RootErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Unexpected error</h1>
        <p className="text-muted-foreground text-sm">{error?.message ?? 'Something went wrong. Please try again.'}</p>
      </div>
      <Button onClick={() => window.location.assign('/')}>Go home</Button>
    </div>
  )
}
