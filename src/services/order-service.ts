import { nanoid } from 'nanoid'
import type { Order, CreateOrderRequest, UpdateOrderRequest } from '@/types/api'
import { OrderServiceError } from '@/shared/lib/errors'
import { simulateNetworkDelay, simulateNetworkFailure } from '@/dev/dev-config'

const failureMessages: Record<string, string> = {
  create: 'Failed to create order. Please try again.',
  update: 'Failed to save changes. Please try again.',
  delete: 'Failed to delete order. Please try again.',
}

function serviceError(operation: string): OrderServiceError {
  return new OrderServiceError(failureMessages[operation] ?? 'Something went wrong. Please try again.', operation)
}

// Simulated API — each function mirrors a real REST endpoint signature.
// Swap this file for an HTTP client to connect to a real backend.

export async function createOrder(request: CreateOrderRequest): Promise<Order> {
  await simulateNetworkDelay()
  simulateNetworkFailure('failNextCreate', serviceError('create'))
  const now = new Date().toISOString()
  return {
    id: nanoid(),
    ...request,
    createdAt: now,
    updatedAt: now,
  }
}

export async function updateOrder(order: Order, request: UpdateOrderRequest): Promise<Order> {
  await simulateNetworkDelay()
  simulateNetworkFailure('failNextUpdate', serviceError('update'))
  return {
    ...order,
    ...request,
    updatedAt: new Date().toISOString(),
  }
}

export async function deleteOrder(_id: string): Promise<void> {
  await simulateNetworkDelay()
  simulateNetworkFailure('failNextDelete', serviceError('delete'))
}
