import { createBrowserRouter } from 'react-router'
import { RootLayout } from './layouts/RootLayout'
import { RouteErrorFallback } from '@/shared/components/RouteErrorFallback'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        lazy: () =>
          import('@/features/dashboard/DashboardPage').then((m) => ({
            Component: m.DashboardPage,
          })),
        errorElement: <RouteErrorFallback />,
      },
      {
        path: 'orders',
        lazy: () =>
          import('@/features/orders/OrdersPage').then((m) => ({
            Component: m.OrdersPage,
          })),
        errorElement: <RouteErrorFallback />,
      },
    ],
  },
])
