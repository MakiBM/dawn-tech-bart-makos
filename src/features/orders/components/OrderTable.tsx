import type { Order } from '@/types/order'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'
import { OrderTableRow } from './OrderTableRow'

type OrderTableProps = {
  orders: Order[]
  pendingIds: string[]
  onEdit: (order: Order) => void
  onDelete: (order: Order) => void
}

const thClass = 'font-mono text-[11px] uppercase tracking-[0.05em] font-normal text-cream-muted px-4'

export function OrderTable({ orders, pendingIds, onEdit, onDelete }: OrderTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[560px]">
        <TableHeader>
          <TableRow>
            <TableHead className={`w-28 ${thClass}`}>ID</TableHead>
            <TableHead className={thClass}>Country</TableHead>
            <TableHead className={thClass}>Shipping Date</TableHead>
            <TableHead className={`text-right ${thClass}`}>Price</TableHead>
            <TableHead className={`w-28 text-right ${thClass}`}>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <OrderTableRow
              key={order.id}
              order={order}
              onEdit={onEdit}
              onDelete={onDelete}
              isPending={pendingIds.includes(order.id)}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
