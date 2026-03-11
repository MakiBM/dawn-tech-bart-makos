import { Package } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

type EmptyStateProps = {
  onCreateOrder: () => void
}

export function EmptyState({ onCreateOrder }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-12">
      <Package className="h-12 w-12 text-muted-foreground" />
      <div className="text-center">
        <h3 className="text-lg font-semibold">No orders yet</h3>
        <p className="text-sm text-muted-foreground">Get started by creating your first order.</p>
      </div>
      <Button onClick={onCreateOrder}>Create Order</Button>
    </div>
  )
}
