import { useShallow } from 'zustand/react/shallow'
import { useOrderStore } from './order-store'

export type DashboardMetrics = {
  totalOrders: number
  totalRevenue: number // cents
  uniqueCountries: number
}

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
