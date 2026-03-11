import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrderTable } from '../components/OrderTable'
import type { Order } from '@/types/order'

const orders: Order[] = [
  { id: 'abc12345', destinationCountry: 'Germany', shippingDate: '2025-06-15', price: 1500, createdAt: '', updatedAt: '' },
  { id: 'def67890', destinationCountry: 'France', shippingDate: '2025-07-01', price: 2500, createdAt: '', updatedAt: '' },
]

describe('OrderTable', () => {
  it('renders order rows', () => {
    render(<OrderTable orders={orders} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Germany')).toBeInTheDocument()
    expect(screen.getByText('France')).toBeInTheDocument()
    expect(screen.getByText('$15.00')).toBeInTheDocument()
    expect(screen.getByText('$25.00')).toBeInTheDocument()
  })

  it('calls onEdit when edit button clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    render(<OrderTable orders={orders} onEdit={onEdit} onDelete={vi.fn()} />)

    const editButtons = screen.getAllByRole('button', { name: 'Edit' })
    await user.click(editButtons[0])
    expect(onEdit).toHaveBeenCalledWith(orders[0])
  })

  it('calls onDelete when delete button clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()
    render(<OrderTable orders={orders} onEdit={vi.fn()} onDelete={onDelete} />)

    const deleteButtons = screen.getAllByRole('button', { name: 'Delete' })
    await user.click(deleteButtons[1])
    expect(onDelete).toHaveBeenCalledWith(orders[1])
  })
})
