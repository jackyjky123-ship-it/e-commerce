import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/EmptyState"
import { useCartStore } from "@/stores/cartStore"
import { formatCurrency } from "@/lib/utils"

const FREE_SHIPPING_THRESHOLD = 1500
const SHIPPING_FLAT = 99

export function CartPage() {
  const { items, subtotal, count, loading, fetchCart, updateItemQuantity, removeItem, clear } =
    useCartStore()
  const [busyItem, setBusyItem] = useState(null)

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT
  const total = subtotal + shipping
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

  const handleUpdate = async (id, quantity) => {
    setBusyItem(id)
    const res = await updateItemQuantity(id, quantity)
    if (!res.ok) toast.error(res.message)
    setBusyItem(null)
  }

  const handleRemove = async (id) => {
    const res = await removeItem(id)
    if (!res.ok) toast.error(res.message)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <Skeleton key={i} className="h-40 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    )
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Browse the catalog and add something worth taking home."
          action={
            <Button asChild className="mt-2">
              <Link to="/shop">
                Browse the catalog <ArrowRight />
              </Link>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-rail mb-1 text-[10px] font-bold text-primary">YOUR CART</p>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Your cart <span className="text-ticket text-xl text-muted-foreground">({count})</span>
          </h1>
        </div>
        <Button variant="ghost" size="sm" className="text-destructive" onClick={clear}>
          Clear cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const product = item.product || {}
            return (
              <Card key={item.id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <Link to={`/product/${product.slug}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/product/${product.slug}`} className="font-medium hover:text-primary">
                      {product.name}
                    </Link>
                    {item.variant && (
                      <p className="mt-0.5 text-sm text-muted-foreground">{item.variant.label}</p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground">{formatCurrency(item.unit_price)} each</p>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <div className="flex items-center rounded-full border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={busyItem === item.id || item.quantity <= 1}
                        onClick={() => handleUpdate(item.id, item.quantity - 1)}
                        aria-label="Decrease"
                      >
                        <Minus />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={busyItem === item.id}
                        onClick={() => handleUpdate(item.id, item.quantity + 1)}
                        aria-label="Increase"
                      >
                        <Plus />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-ticket font-bold">{formatCurrency(item.line_total)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleRemove(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Summary */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:sticky lg:top-24">
            <div className="border-b border-border px-5 py-3">
              <p className="text-rail text-[10px] font-bold text-foreground">TOTAL DUE / {count} ITEM{count === 1 ? "" : "S"}</p>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Free shipping progress</span>
                  <span className="text-ticket font-bold">
                    {remaining > 0 ? `₱${remaining.toLocaleString()} to go` : "Unlocked"}
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="border-t border-border" />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-ticket font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-ticket font-bold">{shipping === 0 ? "FREE" : formatCurrency(shipping)}</span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-end justify-between">
                <span className="text-sm font-bold">Total</span>
                <span className="text-ticket text-2xl text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 border-t border-border p-5">
              <Button asChild size="lg" className="w-full">
                <Link to="/checkout">
                  Checkout <ShoppingBag />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/shop">Keep browsing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}