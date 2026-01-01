import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { AdminPage } from '@/pages/AdminPage'
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/candidates",
    element: <AdminPage />,
    errorElement: <RouteErrorBoundary />,
  }
]);
function AppRoot() {
  useEffect(() => {
    document.title = "Vidushan's Valentine Quest 2025";
  }, []);
  return <RouterProvider router={router} />;
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <AppRoot />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)