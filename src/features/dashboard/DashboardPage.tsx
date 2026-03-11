import { AppHeader } from '@/shared/components/layout/AppHeader'
import { DashboardMetrics } from './components/DashboardMetrics'

export function DashboardPage() {
  return (
    <section className="flex min-h-screen flex-col bg-dark-bg text-dark-fg">
      <AppHeader variant="dark" />
      <div className="flex-1 px-4 py-8 sm:px-8 md:px-12 md:py-12">
        <h1 className="sr-only">Dashboard</h1>
        <div
          className="mb-12 font-bold leading-[0.9] tracking-tight text-dark-fg"
          style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', letterSpacing: '-0.03em' }}
        >
          Order<br />Management
        </div>
        <DashboardMetrics />
      </div>
    </section>
  )
}
