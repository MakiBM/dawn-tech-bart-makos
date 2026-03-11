import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { orderSchema, type OrderFormValues } from '@/features/orders/order-schema'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'

type OrderFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: OrderFormValues) => void
  order?: Order
}

const emptyDefaults: OrderFormValues = {
  destinationCountry: '',
  shippingDate: '',
  price: 0,
}

function orderToFormValues(order: Order): OrderFormValues {
  return {
    destinationCountry: order.destinationCountry,
    shippingDate: order.shippingDate,
    price: order.price / 100,
  }
}

export function OrderForm({ open, onOpenChange, onSubmit, order }: OrderFormProps) {
  const isEdit = !!order

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: emptyDefaults,
  })

  useEffect(() => {
    if (open) {
      reset(order ? orderToFormValues(order) : emptyDefaults)
    }
  }, [open, order, reset])

  // watch() is incompatible with React Compiler memoization (react-hooks/incompatible-library).
  // Acceptable here — this component is a dialog form with no expensive children to memo-skip.
  const selectedCountry = watch('destinationCountry')

  function handleFormSubmit(values: OrderFormValues) {
    if (isEdit && !isDirty) {
      handleOpenChange(false)
      return
    }
    onSubmit({ ...values, price: Math.round(values.price * 100) })
    reset()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-cream-bg sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold tracking-tight">{isEdit ? 'Edit Order' : 'New Order'}</DialogTitle>
          <DialogDescription className="font-mono text-[11px] uppercase tracking-[0.05em]">
            {isEdit ? 'Update the order details below.' : 'Fill in the details to create a new order.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="destinationCountry" className="font-mono text-[11px] uppercase tracking-[0.05em]">
              Destination Country
            </Label>
            <Select
              value={selectedCountry}
              onValueChange={(v) => setValue('destinationCountry', v as string, { shouldValidate: true })}
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
            <Label htmlFor="shippingDate" className="font-mono text-[11px] uppercase tracking-[0.05em]">
              Shipping Date
            </Label>
            <Input id="shippingDate" type="date" {...register('shippingDate')} />
            {errors.shippingDate && <p className="text-sm text-destructive">{errors.shippingDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="font-mono text-[11px] uppercase tracking-[0.05em]">
              Price (USD)
            </Label>
            <Input id="price" type="number" min={0.01} step="0.01" {...register('price', { valueAsNumber: true })} />
            {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? 'Save Changes' : 'Create Order'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
