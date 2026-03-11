import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useOrderStore } from '../order-store'

vi.mock('@/services/order-service', () => ({
  createOrder: vi.fn(async (input) => ({
    id: 'test-id-1',
    ...input,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  })),
  updateOrder: vi.fn(async (order, input) => ({
    ...order,
    ...input,
    updatedAt: '2025-01-02T00:00:00.000Z',
  })),
  deleteOrder: vi.fn(async () => {}),
}))

describe('orderStore', () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [], loading: false, error: null })
  })

  it('starts with empty orders', () => {
    expect(useOrderStore.getState().orders).toEqual([])
  })

  it('adds an order', async () => {
    await useOrderStore.getState().addOrder({
      destinationCountry: 'Germany',
      shippingDate: '2025-06-15',
      price: 1500,
    })
    const { orders } = useOrderStore.getState()
    expect(orders).toHaveLength(1)
    expect(orders[0].destinationCountry).toBe('Germany')
  })

  it('edits an order', async () => {
    useOrderStore.setState({
      orders: [{
        id: 'test-id-1',
        destinationCountry: 'Germany',
        shippingDate: '2025-06-15',
        price: 1500,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      }],
    })
    await useOrderStore.getState().editOrder('test-id-1', { price: 2000 })
    expect(useOrderStore.getState().orders[0].price).toBe(2000)
  })

  it('removes an order', async () => {
    useOrderStore.setState({
      orders: [{
        id: 'test-id-1',
        destinationCountry: 'Germany',
        shippingDate: '2025-06-15',
        price: 1500,
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
      }],
    })
    await useOrderStore.getState().removeOrder('test-id-1')
    expect(useOrderStore.getState().orders).toHaveLength(0)
  })

  it('clears error', async () => {
    useOrderStore.setState({ error: 'some error' })
    useOrderStore.getState().clearError()
    expect(useOrderStore.getState().error).toBeNull()
  })

  it('sets error on failed edit for missing order', async () => {
    await expect(
      useOrderStore.getState().editOrder('nonexistent', { price: 100 }),
    ).rejects.toThrow('Order not found')
    expect(useOrderStore.getState().error).toBe('Order not found')
  })
})
