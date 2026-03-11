import { describe, it, expect } from 'vitest'
import { orderSchema } from '../order-schema'

describe('orderSchema', () => {
  it('accepts valid input', () => {
    const result = orderSchema.safeParse({
      destinationCountry: 'Germany',
      shippingDate: '2025-06-15',
      price: 1500,
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty country', () => {
    const result = orderSchema.safeParse({
      destinationCountry: '',
      shippingDate: '2025-06-15',
      price: 1500,
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid date format', () => {
    const result = orderSchema.safeParse({
      destinationCountry: 'Germany',
      shippingDate: '15/06/2025',
      price: 1500,
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-integer price', () => {
    const result = orderSchema.safeParse({
      destinationCountry: 'Germany',
      shippingDate: '2025-06-15',
      price: 15.5,
    })
    expect(result.success).toBe(false)
  })

  it('rejects negative price', () => {
    const result = orderSchema.safeParse({
      destinationCountry: 'Germany',
      shippingDate: '2025-06-15',
      price: -100,
    })
    expect(result.success).toBe(false)
  })

  it('rejects zero price', () => {
    const result = orderSchema.safeParse({
      destinationCountry: 'Germany',
      shippingDate: '2025-06-15',
      price: 0,
    })
    expect(result.success).toBe(false)
  })
})
