// In production, shared via API contract (OpenAPI / tRPC) with backend
export type Order = {
  id: string
  destinationCountry: string
  shippingDate: string // ISO 8601 (YYYY-MM-DD)
  price: number // cents
  createdAt: string
  updatedAt: string
}

export type CreateOrderRequest = {
  destinationCountry: string
  shippingDate: string
  price: number
}

export type UpdateOrderRequest = {
  destinationCountry?: string
  shippingDate?: string
  price?: number
}
