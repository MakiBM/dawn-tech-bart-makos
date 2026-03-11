import { Pencil, Trash2 } from 'lucide-react'
import type { Order } from '@/types/order'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { TableCell, TableRow } from '@/shared/components/ui/table'
import { Button } from '@/shared/components/ui/button'

type OrderTableRowProps = {
  order: Order
  onEdit: (order: Order) => void
  onDelete: (order: Order) => void
}

export function OrderTableRow({ order, onEdit, onDelete }: OrderTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
      <TableCell>{order.destinationCountry}</TableCell>
      <TableCell>{formatDate(order.shippingDate)}</TableCell>
      <TableCell className="text-right">{formatCurrency(order.price)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => onEdit(order)}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(order)}>
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
