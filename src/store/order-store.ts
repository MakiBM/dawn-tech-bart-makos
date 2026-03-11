import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { Order, CreateOrderInput, UpdateOrderInput } from '@/types/order'
import * as orderService from '@/services/order-service'
import { OrderServiceError } from '@/shared/lib/errors'

type OrderState = {
  orders: Order[]
  error: string | null
  pendingIds: string[]

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
      pendingIds: [],

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
          set((s) => ({
            orders: s.orders.filter((o) => o.id !== optimisticId),
            error: e instanceof OrderServiceError ? e.message : 'Something went wrong. Please try again.',
          }))
          throw e
        }
      },

      editOrder: async (id, input) => {
        if (get().pendingIds.includes(id)) return

        const prev = get().orders.find((o) => o.id === id)
        if (!prev) {
          set({ error: 'Order not found' })
          throw new Error('Order not found')
        }

        const optimistic: Order = { ...prev, ...input, updatedAt: new Date().toISOString() }

        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? optimistic : o)),
          pendingIds: [...s.pendingIds, id],
          error: null,
        }))

        try {
          const real = await orderService.updateOrder(prev, input)
          set((s) => ({
            orders: s.orders.map((o) => (o.id === id ? real : o)),
          }))
        } catch (e) {
          set((s) => ({
            orders: s.orders.map((o) => (o.id === id ? prev : o)),
            error: e instanceof OrderServiceError ? e.message : 'Something went wrong. Please try again.',
          }))
          throw e
        } finally {
          set((s) => ({ pendingIds: s.pendingIds.filter((x) => x !== id) }))
        }
      },

      removeOrder: async (id) => {
        if (get().pendingIds.includes(id)) return

        if (!get().orders.some((o) => o.id === id)) return

        set((s) => ({
          pendingIds: [...s.pendingIds, id],
          error: null,
        }))

        try {
          await orderService.deleteOrder(id)
          set((s) => ({
            orders: s.orders.filter((o) => o.id !== id),
          }))
        } catch (e) {
          set({
            error: e instanceof OrderServiceError ? e.message : 'Something went wrong. Please try again.',
          })
          throw e
        } finally {
          set((s) => ({ pendingIds: s.pendingIds.filter((x) => x !== id) }))
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
