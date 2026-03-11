import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useOrderStore } from '@/store/order-store'
import { DashboardMetrics } from '../components/DashboardMetrics'

describe('DashboardMetrics', () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [], loading: false, error: null })
  })

  it('renders zero metrics when no orders', () => {
    render(<DashboardMetrics />)
    expect(screen.getByText('Total Orders')).toBeInTheDocument()
    expect(screen.getByText('Total Revenue')).toBeInTheDocument()
    expect(screen.getByText('Countries')).toBeInTheDocument()
    expect(screen.getByText('$0.00')).toBeInTheDocument()
    expect(screen.getAllByText('0')).toHaveLength(2)
  })

  it('renders computed metrics', () => {
    useOrderStore.setState({
      orders: [
        { id: '1', destinationCountry: 'Germany', shippingDate: '2025-06-15', price: 1050, createdAt: '', updatedAt: '' },
        { id: '2', destinationCountry: 'France', shippingDate: '2025-06-16', price: 2000, createdAt: '', updatedAt: '' },
      ],
    })
    render(<DashboardMetrics />)
    // totalOrders=2 and uniqueCountries=2 both render "2"
    expect(screen.getAllByText('2')).toHaveLength(2)
    expect(screen.getByText('$30.50')).toBeInTheDocument()
  })
})
