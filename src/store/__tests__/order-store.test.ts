import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useOrderStore } from '../order-store'
import type { Order, CreateOrderInput, UpdateOrderInput } from '@/types/order'
import * as orderService from '@/services/order-service'
import { OrderServiceError } from '@/shared/lib/errors'

vi.mock('@/services/order-service', () => ({
  createOrder: vi.fn(),
  updateOrder: vi.fn(),
  deleteOrder: vi.fn(),
}))

const mockCreate = vi.mocked(orderService.createOrder)
const mockUpdate = vi.mocked(orderService.updateOrder)
const mockDelete = vi.mocked(orderService.deleteOrder)

function fakeOrder(input: CreateOrderInput): Order {
  return {
    id: 'server-id-1',
    ...input,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  }
}

function fakeUpdated(order: Order, input: UpdateOrderInput): Order {
  return { ...order, ...input, updatedAt: '2025-01-02T00:00:00.000Z' }
}

describe('orderStore', () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [], error: null, pendingIds: [] })
    vi.clearAllMocks()
    mockCreate.mockImplementation(async (input) => fakeOrder(input))
    mockUpdate.mockImplementation(async (order, input) => fakeUpdated(order, input))
    mockDelete.mockImplementation(async () => {})
  })

  it('starts with empty orders', () => {
    expect(useOrderStore.getState().orders).toEqual([])
  })

  it('adds an order optimistically then resolves with server data', async () => {
    const promise = useOrderStore.getState().addOrder({
      destinationCountry: 'Germany',
      shippingDate: '2025-06-15',
      price: 1500,
    })

    // Optimistic: order appears immediately
    expect(useOrderStore.getState().orders).toHaveLength(1)
    expect(useOrderStore.getState().orders[0].destinationCountry).toBe('Germany')

    await promise

    // After service resolves: replaced with server ID
    const { orders } = useOrderStore.getState()
    expect(orders).toHaveLength(1)
    expect(orders[0].id).toBe('server-id-1')
  })

  it('rolls back on failed create', async () => {
    mockCreate.mockRejectedValueOnce(new OrderServiceError('Create failed', 'create'))

    await expect(
      useOrderStore.getState().addOrder({
        destinationCountry: 'Germany',
        shippingDate: '2025-06-15',
        price: 1500,
      }),
    ).rejects.toThrow('Create failed')

    expect(useOrderStore.getState().orders).toHaveLength(0)
    expect(useOrderStore.getState().error).toBe('Create failed')
  })

  it('edits an order optimistically', async () => {
    useOrderStore.setState({
      orders: [
        {
          id: 'test-id-1',
          destinationCountry: 'Germany',
          shippingDate: '2025-06-15',
          price: 1500,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    })

    const promise = useOrderStore.getState().editOrder('test-id-1', { price: 2000 })

    // Optimistic: price updated immediately
    expect(useOrderStore.getState().orders[0].price).toBe(2000)

    await promise
    expect(useOrderStore.getState().orders[0].price).toBe(2000)
  })

  it('rolls back on failed edit', async () => {
    useOrderStore.setState({
      orders: [
        {
          id: 'test-id-1',
          destinationCountry: 'Germany',
          shippingDate: '2025-06-15',
          price: 1500,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    })
    mockUpdate.mockRejectedValueOnce(new OrderServiceError('Update failed', 'update'))

    await expect(useOrderStore.getState().editOrder('test-id-1', { price: 9999 })).rejects.toThrow('Update failed')

    // Rolled back to original price
    expect(useOrderStore.getState().orders[0].price).toBe(1500)
    expect(useOrderStore.getState().error).toBe('Update failed')
  })

  it('removes an order after service confirms', async () => {
    useOrderStore.setState({
      orders: [
        {
          id: 'test-id-1',
          destinationCountry: 'Germany',
          shippingDate: '2025-06-15',
          price: 1500,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    })

    const promise = useOrderStore.getState().removeOrder('test-id-1')

    // Pending: order still present, id tracked
    expect(useOrderStore.getState().orders).toHaveLength(1)
    expect(useOrderStore.getState().pendingIds).toContain('test-id-1')

    await promise
    expect(useOrderStore.getState().orders).toHaveLength(0)
    expect(useOrderStore.getState().pendingIds).toEqual([])
  })

  it('rolls back on failed delete', async () => {
    useOrderStore.setState({
      orders: [
        {
          id: 'test-id-1',
          destinationCountry: 'Germany',
          shippingDate: '2025-06-15',
          price: 1500,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    })
    mockDelete.mockRejectedValueOnce(new OrderServiceError('Delete failed', 'delete'))

    await expect(useOrderStore.getState().removeOrder('test-id-1')).rejects.toThrow('Delete failed')

    // Rolled back
    expect(useOrderStore.getState().orders).toHaveLength(1)
    expect(useOrderStore.getState().error).toBe('Delete failed')
  })

  it('clears error', () => {
    useOrderStore.setState({ error: 'some error' })
    useOrderStore.getState().clearError()
    expect(useOrderStore.getState().error).toBeNull()
  })

  it('sets error on edit for missing order', async () => {
    await expect(useOrderStore.getState().editOrder('nonexistent', { price: 100 })).rejects.toThrow('Order not found')
    expect(useOrderStore.getState().error).toBe('Order not found')
  })

  it('blocks concurrent edits on the same order via pendingIds', async () => {
    let resolveFirst!: (value: Order) => void
    mockUpdate.mockImplementationOnce(
      () =>
        new Promise<Order>((resolve) => {
          resolveFirst = resolve
        }),
    )

    const order: Order = {
      id: 'test-id-1',
      destinationCountry: 'Germany',
      shippingDate: '2025-06-15',
      price: 1500,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    }
    useOrderStore.setState({ orders: [order] })

    const first = useOrderStore.getState().editOrder('test-id-1', { price: 2000 })
    expect(useOrderStore.getState().pendingIds).toContain('test-id-1')

    // Second edit silently ignored while first is in-flight
    await useOrderStore.getState().editOrder('test-id-1', { price: 9999 })
    expect(useOrderStore.getState().orders[0].price).toBe(2000) // still first edit's value

    resolveFirst({ ...order, price: 2000, updatedAt: '2025-01-02T00:00:00.000Z' })
    await first

    expect(useOrderStore.getState().pendingIds).toEqual([])
    expect(useOrderStore.getState().orders[0].price).toBe(2000)
  })

  it('blocks concurrent deletes on the same order via pendingIds', async () => {
    let resolveFirst!: () => void
    mockDelete.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolveFirst = resolve
        }),
    )

    useOrderStore.setState({
      orders: [
        {
          id: 'test-id-1',
          destinationCountry: 'Germany',
          shippingDate: '2025-06-15',
          price: 1500,
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    })

    const first = useOrderStore.getState().removeOrder('test-id-1')

    // Second delete silently ignored
    await useOrderStore.getState().removeOrder('test-id-1')
    expect(useOrderStore.getState().orders).toHaveLength(1)

    resolveFirst()
    await first

    expect(useOrderStore.getState().orders).toHaveLength(0)
  })
})
