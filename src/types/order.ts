export type Order = {
  id: string
  destinationCountry: string
  shippingDate: string // ISO 8601 (YYYY-MM-DD)
  price: number // cents
  createdAt: string
  updatedAt: string
}

export type CreateOrderInput = {
  destinationCountry: string
  shippingDate: string
  price: number // cents
}

export type UpdateOrderInput = Partial<CreateOrderInput>
