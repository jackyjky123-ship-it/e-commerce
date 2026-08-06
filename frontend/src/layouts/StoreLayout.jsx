import { Outlet, Navigate, useLocation } from "react-router-dom"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useAuthStore, isAdmin } from "@/stores/authStore"

export function StoreLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return children
}

export function GuestRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  if (user) {
    return <Navigate to={isAdmin(user) ? "/admin" : "/"} replace />
  }
  return children
}

export function AdminRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  if (!isAdmin(user)) {
    return <Navigate to="/" replace />
  }
  return children
}