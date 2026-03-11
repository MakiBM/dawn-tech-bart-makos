import { useRouteError, Link } from 'react-router'
import { Button } from '@/shared/components/ui/button'

export function RouteErrorFallback() {
  const error = useRouteError() as Error

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-semibold">Page Error</h2>
      <p className="text-sm text-muted-foreground">{error?.message ?? 'An unexpected error occurred'}</p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reload
        </Button>
        <Button asChild>
          <Link to="/">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
