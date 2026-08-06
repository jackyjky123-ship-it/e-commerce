import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

import { useCurrencyStore, USD_TO_KHR } from "@/stores/currencyStore"

export function formatCurrency(value, currency = useCurrencyStore.getState().currency) {
  const amount = Number(value || 0)
  if (currency === "KHR") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KHR",
      maximumFractionDigits: 0,
    }).format(amount * USD_TO_KHR)
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(value) {
  if (!value) return "—"
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}