import { z } from 'zod/v4'
import { isValid, parseISO } from 'date-fns'

export const orderSchema = z.object({
  destinationCountry: z.string().min(1, 'Country is required'),
  shippingDate: z
    .string()
    .min(1, 'Shipping date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date (YYYY-MM-DD)')
    .refine((val) => isValid(parseISO(val)), 'Invalid calendar date'),
  price: z.number().positive('Price must be positive'),
})

export type OrderFormValues = z.infer<typeof orderSchema>
