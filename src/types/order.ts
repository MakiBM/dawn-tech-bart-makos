// In production, shared via API contract (OpenAPI / tRPC) with backend
export type Order = {
  id: string
  destinationCountry: string
  shippingDate: string // ISO 8601 (YYYY-MM-DD)
  price: number // cents
  createdAt: string
  updatedAt: string
}

export type CreateOrderInput = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>

export type UpdateOrderInput = Partial<CreateOrderInput>
