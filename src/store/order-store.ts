import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
        set({ loading: true, error: null })
        try {
          const order = await orderService.createOrder(input)
          set((s) => ({ orders: [...s.orders, order], loading: false }))
        } catch (e) {
          set({ loading: false, error: (e as Error).message })
          throw e
        }
      },

      editOrder: async (id, input) => {
        set({ loading: true, error: null })
        const order = get().orders.find((o) => o.id === id)
        if (!order) {
          set({ loading: false, error: 'Order not found' })
          throw new Error('Order not found')
        }
        try {
          const updated = await orderService.updateOrder(order, input)
          set((s) => ({
            orders: s.orders.map((o) => (o.id === id ? updated : o)),
            loading: false,
          }))
        } catch (e) {
          set({ loading: false, error: (e as Error).message })
          throw e
        }
      },

      removeOrder: async (id) => {
        set({ loading: true, error: null })
        try {
          await orderService.deleteOrder(id)
          set((s) => ({
            orders: s.orders.filter((o) => o.id !== id),
            loading: false,
          }))
        } catch (e) {
          set({ loading: false, error: (e as Error).message })
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
