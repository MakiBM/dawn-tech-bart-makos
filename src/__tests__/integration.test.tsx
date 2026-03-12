import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { useOrderStore } from '@/store'
import { RootLayout } from '@/app/layouts/RootLayout'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { OrdersPage } from '@/features/orders/OrdersPage'

vi.mock('@/services/order-service', () => {
  let idCounter = 0
  return {
    createOrder: vi.fn(async (input) => ({
      id: `order-${++idCounter}`,
      ...input,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })),
    updateOrder: vi.fn(async (order, input) => ({
      ...order,
      ...input,
      updatedAt: new Date().toISOString(),
    })),
    deleteOrder: vi.fn(async () => {}),
  }
})

vi.mock('@/dev/dev-config', () => ({
  getDevConfig: vi.fn(() => ({
    failNextCreate: false,
    failNextUpdate: false,
    failNextDelete: false,
    simulateSlowNetwork: false,
  })),
  setDevConfig: vi.fn(),
  simulateNetworkDelay: vi.fn(),
  simulateNetworkFailure: vi.fn(),
}))

function renderWithRouter(initialPath: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'orders', element: <OrdersPage /> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  )
  return render(<RouterProvider router={router} />)
}

describe('Integration: CRUD cycle with dashboard sync', () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [], error: null, pendingIds: [] })
  })

  it('shows empty dashboard metrics initially', () => {
    renderWithRouter('/')
    expect(screen.getByText('Total Orders')).toBeInTheDocument()
    expect(screen.getByText('$0.00')).toBeInTheDocument()
  })

  it('shows empty state on orders page', () => {
    renderWithRouter('/orders')
    expect(screen.getByText('No orders yet')).toBeInTheDocument()
  })

  it('creates an order and updates store', async () => {
    const user = userEvent.setup()
    renderWithRouter('/orders')

    await user.click(screen.getByRole('button', { name: /new order/i }))
    expect(screen.getByText('New Order', { selector: 'h2' })).toBeInTheDocument()

    // Select country
    await user.click(screen.getByRole('combobox'))
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'Germany' })).toBeInTheDocument()
    })
    await user.click(screen.getByRole('option', { name: 'Germany' }))

    // Fill date
    const dateInput = screen.getByLabelText('Shipping Date')
    await user.clear(dateInput)
    await user.type(dateInput, '2025-06-15')

    // Fill price (dollars — converted to cents on submit)
    const priceInput = screen.getByLabelText('Price (USD)')
    await user.clear(priceInput)
    await user.type(priceInput, '15')

    await user.click(screen.getByRole('button', { name: 'Create Order' }))

    await waitFor(() => {
      expect(useOrderStore.getState().orders).toHaveLength(1)
    })
    expect(useOrderStore.getState().orders[0].price).toBe(1500)
    expect(useOrderStore.getState().orders[0].destinationCountry).toBe('Germany')
  })

  it('deletes an order and updates store', async () => {
    const user = userEvent.setup()

    useOrderStore.setState({
      orders: [
        {
          id: 'order-1',
          destinationCountry: 'Germany',
          shippingDate: '2025-06-15',
          price: 1500,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })

    renderWithRouter('/orders')
    expect(screen.getByText('Germany')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByText(/are you sure/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Delete' }))

    await waitFor(() => {
      expect(useOrderStore.getState().orders).toHaveLength(0)
    })
  })

  it('navigates between pages', async () => {
    const user = userEvent.setup()
    renderWithRouter('/')

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /orders/i }))
    await waitFor(() => {
      expect(screen.getByText('No orders yet')).toBeInTheDocument()
    })
  })
})
