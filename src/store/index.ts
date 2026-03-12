import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createOrderSlice } from '@/features/orders/store/order-slice'
import type { OrderSlice } from '@/features/orders/store/order-slice'

export const useAppStore = create<OrderSlice>()(
  persist(createOrderSlice, {
    name: 'order-storage',
    // Only persist the orders array — error and pendingIds are ephemeral
    // and should reset on page reload.
    partialize: (state) => ({ orders: state.orders }),
  }),
)

export const useOrderStore = useAppStore
