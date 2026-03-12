import { useShallow } from 'zustand/react/shallow'
import { useOrderStore } from '@/store'

/** @public */
export type DashboardMetrics = {
  totalOrders: number
  totalRevenue: number // cents
  uniqueCountries: number
}

// Derives dashboard metrics from the orders array on every read.
// useShallow does a shallow equality check on the returned object so the
// subscribing component only re-renders when a metric value actually changes.
export function useDashboardMetrics(): DashboardMetrics {
  return useOrderStore(
    useShallow((s) => {
      const orders = s.orders
      return {
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, o) => sum + o.price, 0),
        uniqueCountries: new Set(orders.map((o) => o.destinationCountry)).size,
      }
    }),
  )
}
