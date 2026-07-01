import { Component, type ErrorInfo, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { logger } from '@/lib/monitoring/logger'
import { captureException } from '@/lib/monitoring/sentry'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

/** App-level error boundary — catches render crashes and reports them. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('Render error', info.componentStack)
    captureException(error)
  }

  render(): ReactNode {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="text-muted-foreground text-sm">{this.state.error.message}</p>
          </div>
          <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
      )
    }
    return this.props.children
  }
}
