// Dev-only toggles for error simulation and slow network.
// Controlled by DevToolbar at runtime — no code changes needed to test error UX.
/** @public */
export type DevConfig = {
  failNextCreate: boolean
  failNextUpdate: boolean
  failNextDelete: boolean
  simulateSlowNetwork: boolean
}

const devConfig: DevConfig = {
  failNextCreate: false,
  failNextUpdate: false,
  failNextDelete: false,
  simulateSlowNetwork: false,
}

export function getDevConfig(): DevConfig {
  return { ...devConfig }
}

export function setDevConfig(patch: Partial<DevConfig>) {
  Object.assign(devConfig, patch)
}

// Simulates realistic network latency (150-350ms).
// With slow network toggle: adds 2s to exercise loading spinners and pending states.
export async function simulateNetworkDelay(): Promise<void> {
  const { delay } = await import('@/shared/lib/utils')
  const config = getDevConfig()
  const base = 150 + Math.random() * 200
  const ms = config.simulateSlowNetwork ? base + 2000 : base
  await delay(ms)
}

// One-shot failure: flag auto-resets after firing so subsequent calls succeed.
// This lets reviewers trigger a single failure without sticky broken state.
export function simulateNetworkFailure(flag: keyof DevConfig, error: Error): void {
  const config = getDevConfig()
  if (config[flag]) {
    setDevConfig({ [flag]: false })
    throw error
  }
}
