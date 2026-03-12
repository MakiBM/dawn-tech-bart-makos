type DashboardMetricCardProps = {
  title: string
  value: string
  bottomLeft?: string
  bottomRight?: string
}

export function DashboardMetricCard({ title, value, bottomLeft, bottomRight }: DashboardMetricCardProps) {
  return (
    <div className="border-t border-dark-border pt-6">
      <h3 className="font-mono text-[11px] uppercase tracking-[0.05em] text-dark-muted">{title}</h3>

      <div
        className="mt-4 font-bold leading-none tracking-tight text-dark-fg"
        style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', letterSpacing: '-0.02em' }}
      >
        {value}
      </div>

      {(bottomLeft || bottomRight) && (
        <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.05em] text-dark-muted">
          {bottomLeft} __ {bottomRight}
        </div>
      )}
    </div>
  )
}
