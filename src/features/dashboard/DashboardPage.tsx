import { PageHeader } from '@/shared/components/layout/PageHeader'
import { DashboardMetrics } from './components/DashboardMetrics'

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Overview of your order metrics" />
      <DashboardMetrics />
    </div>
  )
}
