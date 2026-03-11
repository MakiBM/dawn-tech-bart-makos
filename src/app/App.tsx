import { RouterProvider } from 'react-router'
import { router } from './router'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { DevToolbar } from '@/dev/DevToolbar'

export function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      {import.meta.env.DEV && <DevToolbar />}
    </ErrorBoundary>
  )
}
