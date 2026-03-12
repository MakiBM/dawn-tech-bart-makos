import { useDashboardMetrics } from '@/features/dashboard/selectors'
import { formatCurrency } from '@/shared/lib/format'
import { MetricCard } from './MetricCard'

export function DashboardMetrics() {
  const { totalOrders, totalRevenue, uniqueCountries } = useDashboardMetrics()

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
      <MetricCard title="Total Orders" value={String(totalOrders)} bottomLeft="All time" bottomRight="Orders placed" />
      <MetricCard
        title="Total Revenue"
        value={formatCurrency(totalRevenue)}
        bottomLeft="Gross revenue"
        bottomRight="USD"
      />
      <MetricCard title="Countries" value={String(uniqueCountries)} bottomLeft="Unique" bottomRight="Destinations" />
    </div>
  )
}
