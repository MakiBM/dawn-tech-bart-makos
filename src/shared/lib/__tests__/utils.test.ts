import { describe, it, expect, vi } from 'vitest'
import { delay } from '../utils'

describe('delay', () => {
  it('resolves after specified ms', async () => {
    vi.useFakeTimers()
    let resolved = false
    delay(100).then(() => {
      resolved = true
    })

    await vi.advanceTimersByTimeAsync(50)
    expect(resolved).toBe(false)

    await vi.advanceTimersByTimeAsync(50)
    expect(resolved).toBe(true)

    vi.useRealTimers()
  })
})
