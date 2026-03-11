import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useOrderStore } from '../order-store'
import { useDashboardMetrics } from '../selectors'

describe('useDashboardMetrics', () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [], loading: false, error: null })
  })

  it('returns zeros for empty state', () => {
    const { result } = renderHook(() => useDashboardMetrics())
    expect(result.current).toEqual({
      totalOrders: 0,
      totalRevenue: 0,
      uniqueCountries: 0,
    })
  })

  it('computes metrics from orders', () => {
    useOrderStore.setState({
      orders: [
        { id: '1', destinationCountry: 'Germany', shippingDate: '2025-06-15', price: 1500, createdAt: '', updatedAt: '' },
        { id: '2', destinationCountry: 'France', shippingDate: '2025-06-16', price: 2500, createdAt: '', updatedAt: '' },
        { id: '3', destinationCountry: 'Germany', shippingDate: '2025-06-17', price: 1000, createdAt: '', updatedAt: '' },
      ],
    })
    const { result } = renderHook(() => useDashboardMetrics())
    expect(result.current).toEqual({
      totalOrders: 3,
      totalRevenue: 5000,
      uniqueCountries: 2,
    })
  })
})
