import { create } from "zustand"
import { persist } from "zustand/middleware"
import api from "@/lib/api"

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,

      setAuth: (user, token) => {
        if (token) localStorage.setItem("auth-token", token)
        set({ user, token })
      },

      setUser: (user) => set({ user }),

      fetchUser: async () => {
        if (!get().token) return null
        try {
          const { data } = await api.get("/auth/user")
          set({ user: data.user })
          return data.user
        } catch {
          return null
        }
      },

      logout: async () => {
        try {
          await api.post("/auth/logout")
        } catch {
          // ignore network errors on logout
        }
        localStorage.removeItem("auth-token")
        set({ user: null, token: null })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)

export function isAdmin(user) {
  return user?.role === "admin"
}