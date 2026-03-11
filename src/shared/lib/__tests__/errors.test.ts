import { describe, it, expect } from 'vitest'
import { OrderServiceError, OrderNotFoundError, OrderValidationError } from '../errors'

describe('OrderServiceError', () => {
  it('stores operation name', () => {
    const err = new OrderServiceError('fail', 'create')
    expect(err.message).toBe('fail')
    expect(err.operation).toBe('create')
    expect(err.name).toBe('OrderServiceError')
    expect(err).toBeInstanceOf(Error)
  })
})

describe('OrderNotFoundError', () => {
  it('includes order ID in message', () => {
    const err = new OrderNotFoundError('abc123')
    expect(err.message).toBe('Order abc123 not found')
    expect(err.operation).toBe('lookup')
    expect(err).toBeInstanceOf(OrderServiceError)
  })
})

describe('OrderValidationError', () => {
  it('sets operation to validation', () => {
    const err = new OrderValidationError('bad input')
    expect(err.operation).toBe('validation')
    expect(err).toBeInstanceOf(OrderServiceError)
  })
})
