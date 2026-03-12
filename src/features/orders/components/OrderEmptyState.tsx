type OrderEmptyStateProps = {
  onCreateOrder: () => void
}

export function OrderEmptyState({ onCreateOrder }: OrderEmptyStateProps) {
  return (
    <div className="py-24">
      <h3
        className="font-bold leading-[0.9] tracking-tight text-cream-fg"
        style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', letterSpacing: '-0.02em' }}
      >
        No orders yet
      </h3>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.05em] text-cream-muted">
        Get started by creating your first order.
      </p>
      <button
        onClick={onCreateOrder}
        className="mt-6 font-mono text-[11px] uppercase tracking-[0.05em] text-cream-fg underline underline-offset-4 hover:opacity-70"
      >
        Create Order
      </button>
    </div>
  )
}
