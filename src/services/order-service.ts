import { nanoid } from 'nanoid'
import type { Order, CreateOrderInput, UpdateOrderInput } from '@/types/order'
import { OrderServiceError } from '@/shared/lib/errors'

type DevConfig = {
  failNextCreate: boolean
  failNextUpdate: boolean
  failNextDelete: boolean
  simulateSlowNetwork: boolean
}

const devConfig: DevConfig = {
  failNextCreate: false,
  failNextUpdate: false,
  failNextDelete: false,
  simulateSlowNetwork: false,
}

export function getDevConfig(): DevConfig {
  return { ...devConfig }
}

export function setDevConfig(patch: Partial<DevConfig>) {
  Object.assign(devConfig, patch)
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function simulateNetwork(): Promise<void> {
  const base = 150 + Math.random() * 200
  const ms = devConfig.simulateSlowNetwork ? base + 2000 : base
  await delay(ms)
}

const failureMessages: Record<string, string> = {
  create: 'Failed to create order. Please try again.',
  update: 'Failed to save changes. Please try again.',
  delete: 'Failed to delete order. Please try again.',
}

function checkFailure(flag: keyof DevConfig, operation: string): void {
  if (devConfig[flag]) {
    devConfig[flag] = false
    throw new OrderServiceError(failureMessages[operation] ?? 'Something went wrong. Please try again.', operation)
  }
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await simulateNetwork()
  checkFailure('failNextCreate', 'create')
  const now = new Date().toISOString()
  return {
    id: nanoid(),
    ...input,
    createdAt: now,
    updatedAt: now,
  }
}

export async function updateOrder(order: Order, input: UpdateOrderInput): Promise<Order> {
  await simulateNetwork()
  checkFailure('failNextUpdate', 'update')
  return {
    ...order,
    ...input,
    updatedAt: new Date().toISOString(),
  }
}

export async function deleteOrder(_id: string): Promise<void> {
  await simulateNetwork()
  checkFailure('failNextDelete', 'delete')
}
