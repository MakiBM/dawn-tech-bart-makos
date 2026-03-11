import { useState, useCallback } from 'react'
import type { Order } from '@/types/order'
import type { OrderFormValues } from '@/schemas/order-schema'
import { useOrderStore } from '@/store/order-store'
import { AppHeader } from '@/shared/components/layout/AppHeader'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { OrderTable } from './components/OrderTable'
import { OrderForm } from './components/OrderForm'
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'
import { EmptyState } from './components/EmptyState'

export function OrdersPage() {
  const orders = useOrderStore((s) => s.orders)
  const error = useOrderStore((s) => s.error)
  const pendingIds = useOrderStore((s) => s.pendingIds)
  const addOrder = useOrderStore((s) => s.addOrder)
  const editOrder = useOrderStore((s) => s.editOrder)
  const removeOrder = useOrderStore((s) => s.removeOrder)
  const clearError = useOrderStore((s) => s.clearError)

  const [formOpen, setFormOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | undefined>()
  const [deletingOrder, setDeletingOrder] = useState<Order | undefined>()

  const openCreate = useCallback(() => {
    setEditingOrder(undefined)
    setFormOpen(true)
  }, [])

  const openEdit = useCallback((order: Order) => {
    setEditingOrder(order)
    setFormOpen(true)
  }, [])

  const openDelete = useCallback((order: Order) => {
    setDeletingOrder(order)
  }, [])

  function handleSubmit(values: OrderFormValues) {
    const orderToEdit = editingOrder
    setFormOpen(false)
    setEditingOrder(undefined)

    if (orderToEdit) {
      editOrder(orderToEdit.id, values).catch(() => {})
    } else {
      addOrder(values).catch(() => {})
    }
  }

  function handleDelete() {
    if (!deletingOrder) return
    const id = deletingOrder.id

    setDeletingOrder(undefined)
    removeOrder(id).catch(() => {})
  }

  return (
    <section className="flex min-h-screen flex-col bg-cream-bg text-cream-fg">
      <AppHeader variant="light" />
      <div className="flex-1 px-4 py-8 sm:px-8 md:px-12 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-border pb-6">
          <h2
            className="font-bold tracking-tight"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', letterSpacing: '-0.02em' }}
          >
            Order Overview
          </h2>
          <button
            onClick={openCreate}
            className="font-mono text-[11px] uppercase tracking-[0.05em] text-cream-fg underline underline-offset-4 hover:opacity-70"
          >
            + New Order
          </button>
        </div>

        {error && (
          <div className="mt-6 flex items-center justify-between border border-cream-border bg-cream-bg px-6 py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.05em] text-destructive">{error}</p>
            <button
              onClick={clearError}
              className="font-mono text-[11px] uppercase tracking-[0.05em] text-cream-muted underline underline-offset-4 hover:opacity-70"
            >
              Dismiss
            </button>
          </div>
        )}

        <ErrorBoundary>
          {orders.length === 0 ? (
            <EmptyState onCreateOrder={openCreate} />
          ) : (
            <div className="mt-6">
              <OrderTable orders={orders} pendingIds={pendingIds} onEdit={openEdit} onDelete={openDelete} />
            </div>
          )}
        </ErrorBoundary>
      </div>

      <OrderForm open={formOpen} onOpenChange={setFormOpen} onSubmit={handleSubmit} order={editingOrder} />

      <DeleteConfirmDialog
        open={!!deletingOrder}
        onOpenChange={(open) => !open && setDeletingOrder(undefined)}
        onConfirm={handleDelete}
      />
    </section>
  )
}
