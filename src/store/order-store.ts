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

      // Optimistic create: insert with a temporary ID so the UI updates instantly,
      // then swap it for the server-assigned ID on success, or roll back on failure.
      addOrder: async (input) => {
        const optimisticId = nanoid()
        const now = new Date().toISOString()
        const optimistic: Order = {
          id: optimisticId,
          ...input,
          createdAt: now,
          updatedAt: now,
        }

        set((s) => ({ orders: [...s.orders, optimistic], pendingIds: [...s.pendingIds, optimisticId], error: null }))

        try {
          const real = await orderService.createOrder(input)
          set((s) => ({
            orders: s.orders.map((o) => (o.id === optimisticId ? real : o)),
          }))
        } catch (e) {
          // Rollback: remove the optimistic entry
          set((s) => ({
            orders: s.orders.filter((o) => o.id !== optimisticId),
            error: e instanceof OrderServiceError ? e.message : 'Something went wrong. Please try again.',
          }))
          throw e
        } finally {
          set((s) => ({ pendingIds: s.pendingIds.filter((x) => x !== optimisticId) }))
        }
      },

      // Optimistic update: snapshot previous state, apply changes immediately,
      // then confirm with the service. Rolls back to snapshot on failure.
      // pendingIds guard prevents concurrent edits on the same order.
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
          // Rollback: restore the snapshot taken before the optimistic write
          set((s) => ({
            orders: s.orders.map((o) => (o.id === id ? prev : o)),
            error: e instanceof OrderServiceError ? e.message : 'Something went wrong. Please try again.',
          }))
          throw e
        } finally {
          set((s) => ({ pendingIds: s.pendingIds.filter((x) => x !== id) }))
        }
      },

      // Pessimistic delete: keep the order visible (with a pending spinner) until
      // the service confirms. Only then remove it. On failure the order stays and
      // an error is shown — no data loss.
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
      // Only persist the orders array — error and pendingIds are ephemeral
      // and should reset on page reload.
      partialize: (state) => ({ orders: state.orders }),
    },
  ),
)
