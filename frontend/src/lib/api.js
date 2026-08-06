import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  const cartToken = localStorage.getItem("cart-token")
  if (cartToken && !config.headers.Authorization) {
    config.headers["X-Cart-Token"] = cartToken
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0] ||
      "Something went wrong. Please try again."
    error.userMessage = message
    return Promise.reject(error)
  }
)

export function getErrorMessage(error) {
  const data = error?.response?.data
  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0]
    if (first) return first
  }
  return data?.message || "Something went wrong. Please try again."
}

export default api