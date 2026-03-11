import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { Order, CreateOrderInput, UpdateOrderInput } from '@/types/order'
import * as orderService from '@/services/order-service'
import { OrderServiceError } from '@/shared/lib/errors'

type OrderState = {
  orders: Order[]
  error: string | null

  addOrder: (input: CreateOrderInput) => Promise<void>
  editOrder: (id: string, input: UpdateOrderInput) => Promise<void>
  removeOrder: (id: string) => Promise<void>
  clearError: () => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      error: null,

      addOrder: async (input) => {
        const optimisticId = nanoid()
        const now = new Date().toISOString()
        const optimistic: Order = {
          id: optimisticId,
          ...input,
          createdAt: now,
          updatedAt: now,
        }

        set((s) => ({ orders: [...s.orders, optimistic], error: null }))

        try {
          const real = await orderService.createOrder(input)
          set((s) => ({
            orders: s.orders.map((o) => (o.id === optimisticId ? real : o)),
          }))
        } catch (e) {
          // TODO: Production — forward to Sentry via Sentry.captureException()
          set((s) => ({
            orders: s.orders.filter((o) => o.id !== optimisticId),
            error: e instanceof OrderServiceError ? e.message : 'Something went wrong. Please try again.',
          }))
          throw e
        }
      },

      editOrder: async (id, input) => {
        const prev = get().orders.find((o) => o.id === id)
        if (!prev) {
          set({ error: 'Order not found' })
          throw new Error('Order not found')
        }

        const optimistic: Order = { ...prev, ...input, updatedAt: new Date().toISOString() }

        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? optimistic : o)),
          error: null,
        }))

        try {
          const real = await orderService.updateOrder(prev, input)
          set((s) => ({
            orders: s.orders.map((o) => (o.id === id ? real : o)),
          }))
        } catch (e) {
          // TODO: Production — forward to Sentry via Sentry.captureException()
          set((s) => ({
            orders: s.orders.map((o) => (o.id === id ? prev : o)),
            error: e instanceof OrderServiceError ? e.message : 'Something went wrong. Please try again.',
          }))
          throw e
        }
      },

      removeOrder: async (id) => {
        const prev = get().orders
        const removed = prev.find((o) => o.id === id)
        if (!removed) return

        set((s) => ({
          orders: s.orders.filter((o) => o.id !== id),
          error: null,
        }))

        try {
          await orderService.deleteOrder(id)
        } catch (e) {
          // TODO: Production — forward to Sentry via Sentry.captureException()
          set({ orders: prev, error: e instanceof OrderServiceError ? e.message : 'Something went wrong. Please try again.' })
          throw e
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({ orders: state.orders }),
    },
  ),
)
