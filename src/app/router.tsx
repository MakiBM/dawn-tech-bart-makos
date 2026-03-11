import { createBrowserRouter } from 'react-router'
import { RootLayout } from './layouts/RootLayout'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { OrdersPage } from '@/features/orders/OrdersPage'
import { RouteErrorFallback } from '@/shared/components/RouteErrorFallback'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
        errorElement: <RouteErrorFallback />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
        errorElement: <RouteErrorFallback />,
      },
    ],
  },
])
