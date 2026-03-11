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
  onEdit: (order: Order) => void
  onDelete: (order: Order) => void
}

export function OrderTable({ orders, onEdit, onDelete }: OrderTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">ID</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Shipping Date</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="w-24 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <OrderTableRow
              key={order.id}
              order={order}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
