import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { orderSchema, type OrderFormValues } from '@/schemas/order-schema'
import type { Order } from '@/types/order'
import { countries } from '@/shared/lib/countries'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Loader2 } from 'lucide-react'

type OrderFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: OrderFormValues) => Promise<void>
  order?: Order
}

export function OrderForm({ open, onOpenChange, onSubmit, order }: OrderFormProps) {
  const isEdit = !!order

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: order
      ? {
          destinationCountry: order.destinationCountry,
          shippingDate: order.shippingDate,
          price: order.price,
        }
      : {
          destinationCountry: '',
          shippingDate: '',
          price: 0,
        },
  })

  const selectedCountry = watch('destinationCountry')

  async function handleFormSubmit(values: OrderFormValues) {
    await onSubmit(values)
    reset()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Order' : 'New Order'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the order details below.' : 'Fill in the details to create a new order.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destinationCountry">Destination Country</Label>
            <Select
              value={selectedCountry}
              onValueChange={(v) => setValue('destinationCountry', v, { shouldValidate: true })}
            >
              <SelectTrigger id="destinationCountry">
                <SelectValue placeholder="Select a country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.destinationCountry && (
              <p className="text-sm text-destructive">{errors.destinationCountry.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shippingDate">Shipping Date</Label>
            <Input id="shippingDate" type="date" {...register('shippingDate')} />
            {errors.shippingDate && (
              <p className="text-sm text-destructive">{errors.shippingDate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (cents)</Label>
            <Input
              id="price"
              type="number"
              min={1}
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && (
              <p className="text-sm text-destructive">{errors.price.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Save Changes' : 'Create Order'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
