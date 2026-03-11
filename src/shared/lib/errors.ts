export class OrderServiceError extends Error {
  readonly operation: string

  constructor(message: string, operation: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'OrderServiceError'
    this.operation = operation
  }
}

export class OrderNotFoundError extends OrderServiceError {
  constructor(id: string) {
    super(`Order ${id} not found`, 'lookup')
    this.name = 'OrderNotFoundError'
  }
}

export class OrderValidationError extends OrderServiceError {
  constructor(message: string) {
    super(message, 'validation')
    this.name = 'OrderValidationError'
  }
}
