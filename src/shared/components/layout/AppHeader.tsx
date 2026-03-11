import { NavLink } from 'react-router'
import { cn } from '@/shared/lib/cn'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/orders', label: 'Orders' },
] as const

type AppHeaderProps = {
  variant: 'dark' | 'light'
}

export function AppHeader({ variant }: AppHeaderProps) {
  const isDark = variant === 'dark'

  return (
    <header
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 border-b px-4 py-3 sm:px-8 md:px-12 md:py-4',
        isDark ? 'border-dark-border' : 'border-cream-border',
      )}
    >
      <span
        className={cn(
          'text-[14px] font-extrabold tracking-wide',
          isDark ? 'text-dark-fg' : 'text-cream-fg',
        )}
      >
        ORD.SYS
      </span>

      <nav className="flex items-center gap-4 sm:gap-6">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                'font-mono text-[11px] uppercase tracking-[0.05em] transition-opacity',
                isDark
                  ? isActive
                    ? 'text-dark-fg opacity-100'
                    : 'text-dark-fg opacity-60 hover:opacity-80'
                  : isActive
                    ? 'text-cream-fg opacity-100'
                    : 'text-cream-fg opacity-60 hover:opacity-80',
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <span
        className={cn(
          'hidden font-mono text-[11px] uppercase tracking-[0.05em] sm:inline',
          isDark ? 'text-dark-muted' : 'text-cream-muted',
        )}
      >
        System Dashboard
      </span>
    </header>
  )
}
