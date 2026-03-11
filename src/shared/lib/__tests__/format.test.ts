import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate } from '../format'

describe('formatCurrency', () => {
  it('formats cents to USD', () => {
    expect(formatCurrency(1500)).toBe('$15.00')
  })

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00')
  })

  it('formats sub-dollar amounts', () => {
    expect(formatCurrency(50)).toBe('$0.50')
  })

  it('formats large amounts with comma grouping', () => {
    expect(formatCurrency(123456789)).toBe('$1,234,567.89')
  })
})

describe('formatDate', () => {
  it('formats ISO date to readable string', () => {
    expect(formatDate('2025-06-15')).toBe('Jun 15, 2025')
  })

  it('formats January date', () => {
    expect(formatDate('2025-01-01')).toBe('Jan 1, 2025')
  })
})
