import { create } from "zustand"
import api from "@/lib/api"

export const CART_TOKEN_KEY = "cart-token"

function getOrCreateCartToken() {
  let token = localStorage.getItem(CART_TOKEN_KEY)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(CART_TOKEN_KEY, token)
  }
  return token
}

function apiWithToken() {
  if (!localStorage.getItem("auth-token")) {
    const token = getOrCreateCartToken()
    api.defaults.headers.common["X-Cart-Token"] = token
  }
  return api
}

export const useCartStore = create((set, get) => ({
  items: [],
  subtotal: 0,
  count: 0,
  loading: false,

  setCart: (payload) =>
    set({
      items: payload?.items || [],
      subtotal: payload?.subtotal || 0,
      count: payload?.count || 0,
    }),

  fetchCart: async () => {
    try {
      const { data } = await apiWithToken().get("/cart")
      const sessionToken = data.data?.session_token
      if (sessionToken) localStorage.setItem(CART_TOKEN_KEY, sessionToken)
      get().setCart(data.data)
    } catch {
      // guest carts may fail silently
    }
  },

  addItem: async ({ productId, quantity = 1, variantId = null }) => {
    try {
      const payload = { product_id: productId, quantity, ...(variantId ? { variant_id: variantId } : {}) }
      const { data } = await apiWithToken().post("/cart/items", payload)
      get().setCart(data.cart)
      return { ok: true, message: data.message }
    } catch (error) {
      return { ok: false, message: error.userMessage }
    }
  },

  updateItemQuantity: async (itemId, quantity) => {
    try {
      const { data } = await apiWithToken().put(`/cart/items/${itemId}`, { quantity })
      get().setCart(data.cart)
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error.userMessage }
    }
  },

  removeItem: async (itemId) => {
    try {
      const { data } = await apiWithToken().delete(`/cart/items/${itemId}`)
      get().setCart(data.cart)
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error.userMessage }
    }
  },

  clear: async () => {
    try {
      await apiWithToken().delete("/cart")
      get().setCart({ items: [], subtotal: 0, count: 0 })
      return { ok: true }
    } catch (error) {
      return { ok: false, message: error.userMessage }
    }
  },

  mergeAfterLogin: async () => {
    const token = localStorage.getItem(CART_TOKEN_KEY)
    if (!token) return
    try {
      const { data } = await api.post("/cart/merge", { session_token: token })
      get().setCart(data.cart)
    } catch {
      // ignore merge failures
    }
  },
}))