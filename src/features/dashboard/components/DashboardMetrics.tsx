import { Package, DollarSign, Globe } from 'lucide-react'
import { useDashboardMetrics } from '@/store/selectors'
import { formatCurrency } from '@/shared/lib/format'
import { MetricCard } from './MetricCard'

export function DashboardMetrics() {
  const { totalOrders, totalRevenue, uniqueCountries } = useDashboardMetrics()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard title="Total Orders" value={String(totalOrders)} icon={Package} />
      <MetricCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={DollarSign} />
      <MetricCard title="Countries" value={String(uniqueCountries)} icon={Globe} />
    </div>
  )
}
