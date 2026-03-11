import { useState } from 'react'
import { Bug, ChevronDown, ChevronUp } from 'lucide-react'
import { getDevConfig, setDevConfig } from '@/services/order-service'
import { Button } from '@/shared/components/ui/button'

export function DevToolbar() {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState(getDevConfig)

  function toggle(key: keyof ReturnType<typeof getDevConfig>) {
    const next = { ...config, [key]: !config[key] }
    setDevConfig(next)
    setConfig(next)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 border border-cream-border bg-cream-bg shadow-lg">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-cream-fg"
      >
        <Bug className="h-3 w-3" />
        Dev Tools
        {open ? <ChevronDown className="ml-auto h-3 w-3" /> : <ChevronUp className="ml-auto h-3 w-3" />}
      </button>

      {open && (
        <div className="space-y-1 border-t border-cream-border px-3 py-2">
          {([
            ['failNextCreate', 'Fail next create'],
            ['failNextUpdate', 'Fail next update'],
            ['failNextDelete', 'Fail next delete'],
            ['simulateSlowNetwork', 'Slow network (2s)'],
          ] as const).map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-xs text-cream-fg">
              <input
                type="checkbox"
                checked={config[key]}
                onChange={() => toggle(key)}
              />
              {label}
            </label>
          ))}
          <div className="pt-1">
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs"
              onClick={() => {
                localStorage.removeItem('order-storage')
                window.location.reload()
              }}
            >
              Clear Storage
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
