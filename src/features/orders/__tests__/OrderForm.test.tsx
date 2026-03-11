import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OrderForm } from '../components/OrderForm'

describe('OrderForm', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onSubmit: vi.fn(),
  }

  it('renders create mode', () => {
    render(<OrderForm {...defaultProps} />)
    expect(screen.getByText('New Order')).toBeInTheDocument()
    expect(screen.getByText('Create Order')).toBeInTheDocument()
  })

  it('renders edit mode with pre-filled data', () => {
    render(
      <OrderForm
        {...defaultProps}
        order={{
          id: '1',
          destinationCountry: 'Germany',
          shippingDate: '2025-06-15',
          price: 1500,
          createdAt: '',
          updatedAt: '',
        }}
      />,
    )
    expect(screen.getByText('Edit Order')).toBeInTheDocument()
    expect(screen.getByText('Save Changes')).toBeInTheDocument()
  })

  it('does not submit with invalid data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<OrderForm {...defaultProps} onSubmit={onSubmit} />)

    await user.click(screen.getByRole('button', { name: 'Create Order' }))

    // Wait a tick for validation to run
    await waitFor(() => {
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  it('submits valid form data', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<OrderForm {...defaultProps} onSubmit={onSubmit} />)

    // Select country using Radix Select
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Germany' }))

    // Fill date
    const dateInput = screen.getByLabelText('Shipping Date')
    await user.clear(dateInput)
    await user.type(dateInput, '2025-06-15')

    // Fill price (dollars — converted to cents on submit)
    const priceInput = screen.getByLabelText('Price (USD)')
    await user.clear(priceInput)
    await user.type(priceInput, '15')

    await user.click(screen.getByRole('button', { name: 'Create Order' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        destinationCountry: 'Germany',
        shippingDate: '2025-06-15',
        price: 1500,
      })
    })
  })
})
