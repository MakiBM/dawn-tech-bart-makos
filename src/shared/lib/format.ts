import { format, parseISO } from 'date-fns'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatCurrency(cents: number): string {
  return currencyFormatter.format(cents / 100)
}

export function formatDate(isoDate: string): string {
  return format(parseISO(isoDate), 'MMM d, yyyy')
}
