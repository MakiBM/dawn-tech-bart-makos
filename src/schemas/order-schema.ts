import { z } from 'zod/v4'
import { isValid, parseISO } from 'date-fns'

export const orderSchema = z.object({
  destinationCountry: z.string().min(1, 'Country is required'),
  shippingDate: z
    .string()
    .min(1, 'Shipping date is required')
    .refine((val) => isValid(parseISO(val)), 'Invalid date'),
  price: z.number().positive('Price must be positive'),
})

export type OrderFormValues = z.infer<typeof orderSchema>
