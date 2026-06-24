import { lazy, Suspense } from "react"
import { createBrowserRouter, RouterProvider, Link, Outlet } from "react-router-dom"

// Lazy-loaded pages
const DashboardPage = lazy(() => import("@/pages/DashboardPage"))
const ReceiptListPage = lazy(() => import("@/pages/ReceiptListPage"))

// Main layout component
function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header / Navbar */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold tracking-tight text-primary">PM Theo Dõi Than</span>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link to="/" className="hover:text-primary transition-colors">Tổng Quan</Link>
              <Link to="/receipts" className="hover:text-primary transition-colors">Nhập Than</Link>
            </nav>
          </div>
          <div className="text-sm text-muted-foreground">Admin Portal</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Suspense fallback={<div className="p-6">Đang tải...</div>}>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4 bg-muted/40">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} PM Theo Dõi Than. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "receipts",
        element: <ReceiptListPage />,
      },
    ],
  },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
