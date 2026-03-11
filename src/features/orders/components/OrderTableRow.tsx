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
    <TableRow className="hover:bg-transparent">
      <TableCell className="px-4 py-6 font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
      <TableCell className="px-4 py-6 text-lg tracking-tight">{order.destinationCountry}</TableCell>
      <TableCell className="px-4 py-6 font-mono text-xs text-cream-muted">{formatDate(order.shippingDate)}</TableCell>
      <TableCell className="px-4 py-6 text-right font-mono text-xs">{formatCurrency(order.price)}</TableCell>
      <TableCell className="px-4 py-6 text-right">
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
