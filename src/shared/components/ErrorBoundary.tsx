import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback?: ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
  retryCount: number
}

const MAX_RETRIES = 3

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Production: forward to Sentry via Sentry.captureException(error, { extra: info })
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="py-12">
          <h2
            className="font-bold tracking-tight"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}
          >
            Something went wrong
          </h2>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.05em] text-cream-muted">
            {this.state.error?.message}
          </p>
          {this.state.retryCount < MAX_RETRIES ? (
            <button
              className="mt-6 font-mono text-[11px] uppercase tracking-[0.05em] underline underline-offset-4 hover:opacity-70"
              onClick={() => this.setState((s) => ({ hasError: false, error: null, retryCount: s.retryCount + 1 }))}
            >
              Try again
            </button>
          ) : (
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.05em] text-cream-muted">
              Please reload the page.
            </p>
          )}
        </div>
      )
    }
    return this.props.children
  }
}
