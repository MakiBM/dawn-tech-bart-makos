import { useRouteError, Link } from 'react-router'

export function RouteErrorFallback() {
  // TODO: Production — forward to Sentry via Sentry.captureException()
  const error = useRouteError() as Error

  return (
    <div className="flex min-h-screen flex-col items-start justify-center bg-cream-bg px-12 text-cream-fg">
      <h2
        className="font-bold tracking-tight"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}
      >
        Page Error
      </h2>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.05em] text-cream-muted">
        {error?.message ?? 'An unexpected error occurred'}
      </p>
      <div className="mt-6 flex gap-6">
        <button
          onClick={() => window.location.reload()}
          className="font-mono text-[11px] uppercase tracking-[0.05em] text-cream-fg underline underline-offset-4 hover:opacity-70"
        >
          Reload
        </button>
        <Link
          to="/"
          className="font-mono text-[11px] uppercase tracking-[0.05em] text-cream-fg underline underline-offset-4 hover:opacity-70"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}
