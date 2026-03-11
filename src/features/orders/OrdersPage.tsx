import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import type { Order } from '@/types/order'
import type { OrderFormValues } from '@/schemas/order-schema'
import { useOrderStore } from '@/store/order-store'
import { PageHeader } from '@/shared/components/layout/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { OrderTable } from './components/OrderTable'
import { OrderForm } from './components/OrderForm'
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'
import { EmptyState } from './components/EmptyState'

export function OrdersPage() {
  const orders = useOrderStore((s) => s.orders)
  const error = useOrderStore((s) => s.error)
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
    // Close immediately — optimistic update already applied by store
    setFormOpen(false)
    setEditingOrder(undefined)

    if (editingOrder) {
      editOrder(editingOrder.id, values).catch(() => {})
    } else {
      addOrder(values).catch(() => {})
    }
  }

  function handleDelete() {
    if (!deletingOrder) return
    const id = deletingOrder.id

    // Close immediately — optimistic removal already applied by store
    setDeletingOrder(undefined)
    removeOrder(id).catch(() => {})
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        description="Manage your shipping orders"
        action={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        }
      />

      {error && (
        <div className="flex items-center justify-between rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="ghost" size="sm" onClick={clearError}>
            Dismiss
          </Button>
        </div>
      )}

      <ErrorBoundary>
        {orders.length === 0 ? (
          <EmptyState onCreateOrder={openCreate} />
        ) : (
          <OrderTable orders={orders} onEdit={openEdit} onDelete={openDelete} />
        )}
      </ErrorBoundary>

      <OrderForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        order={editingOrder}
      />

      <DeleteConfirmDialog
        open={!!deletingOrder}
        onOpenChange={(open) => !open && setDeletingOrder(undefined)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
