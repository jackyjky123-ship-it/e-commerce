import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { StoreLayout, ProtectedRoute, GuestRoute, AdminRoute } from "@/layouts/StoreLayout"
import { AdminLayout } from "@/layouts/AdminLayout"

import { HomePage } from "@/pages/HomePage"
import { ShopPage } from "@/pages/ShopPage"
import { CategoriesPage } from "@/pages/CategoriesPage"
import { DealsPage } from "@/pages/DealsPage"
import { AboutPage } from "@/pages/AboutPage"
import { ContactPage } from "@/pages/ContactPage"
import { ProductDetailPage } from "@/pages/ProductDetailPage"
import { CartPage } from "@/pages/CartPage"
import { CheckoutPage } from "@/pages/CheckoutPage"
import { OrdersPage } from "@/pages/OrdersPage"
import { OrderDetailPage } from "@/pages/OrderDetailPage"
import { ProfilePage } from "@/pages/ProfilePage"
import { LoginPage } from "@/pages/LoginPage"
import { RegisterPage } from "@/pages/RegisterPage"

import { AdminDashboardPage } from "@/pages/admin/AdminDashboardPage"
import { AdminProductsPage } from "@/pages/admin/AdminProductsPage"
import { AdminProductFormPage } from "@/pages/admin/AdminProductFormPage"
import { AdminCategoriesPage } from "@/pages/admin/AdminCategoriesPage"
import { AdminOrdersPage } from "@/pages/admin/AdminOrdersPage"
import { AdminUsersPage } from "@/pages/admin/AdminUsersPage"

import { useAuthStore } from "@/stores/authStore"
import { useCartStore } from "@/stores/cartStore"

function AppLoader() {
  const token = useAuthStore((s) => s.token)
  const fetchUser = useAuthStore((s) => s.fetchUser)
  const fetchCart = useCartStore((s) => s.fetchCart)

  useEffect(() => {
    if (token) fetchUser()
    fetchCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export default function App() {
  const token = useAuthStore((s) => s.token)

  return (
    <BrowserRouter>
      <AppLoader />
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/:slug" element={<ShopPage />} />
          <Route path="/deals" element={<DealsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/new" element={<AdminProductFormPage />} />
          <Route path="products/:id/edit" element={<AdminProductFormPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}