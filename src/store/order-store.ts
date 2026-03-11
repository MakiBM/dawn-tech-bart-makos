import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'
import type { Order, CreateOrderInput, UpdateOrderInput } from '@/types/order'
import * as orderService from '@/services/order-service'

type OrderState = {
  orders: Order[]
  loading: boolean
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
      loading: false,
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

        // Optimistic: add immediately
        set((s) => ({ orders: [...s.orders, optimistic], loading: true, error: null }))

        try {
          const real = await orderService.createOrder(input)
          // Replace optimistic with server response
          set((s) => ({
            orders: s.orders.map((o) => (o.id === optimisticId ? real : o)),
            loading: false,
          }))
        } catch (e) {
          // Rollback
          set((s) => ({
            orders: s.orders.filter((o) => o.id !== optimisticId),
            loading: false,
            error: (e as Error).message,
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

        // Optimistic: apply changes immediately
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? optimistic : o)),
          loading: true,
          error: null,
        }))

        try {
          const real = await orderService.updateOrder(prev, input)
          set((s) => ({
            orders: s.orders.map((o) => (o.id === id ? real : o)),
            loading: false,
          }))
        } catch (e) {
          // Rollback to previous
          set((s) => ({
            orders: s.orders.map((o) => (o.id === id ? prev : o)),
            loading: false,
            error: (e as Error).message,
          }))
          throw e
        }
      },

      removeOrder: async (id) => {
        const prev = get().orders
        const removed = prev.find((o) => o.id === id)
        if (!removed) return

        // Optimistic: remove immediately
        set((s) => ({
          orders: s.orders.filter((o) => o.id !== id),
          loading: true,
          error: null,
        }))

        try {
          await orderService.deleteOrder(id)
          set({ loading: false })
        } catch (e) {
          // Rollback
          set({ orders: prev, loading: false, error: (e as Error).message })
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
