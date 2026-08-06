import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { CreditCard, Loader2, MapPin } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/stores/authStore"
import { useCartStore } from "@/stores/cartStore"
import { formatCurrency, cn } from "@/lib/utils"
import api from "@/lib/api"

const paymentOptions = [
  { value: "cash_on_delivery", label: "Cash on Delivery", desc: "Pay when your order arrives" },
  { value: "card", label: "Credit / Debit Card", desc: "Pay securely with Visa & Mastercard" },
  { value: "gcash", label: "GCash", desc: "Pay instantly with GCash" },
]

export function CheckoutPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { items, subtotal, count, fetchCart } = useCartStore()
  const [placing, setPlacing] = useState(false)
  const [form, setForm] = useState({
    shipping_name: user?.name || "",
    shipping_email: user?.email || "",
    shipping_phone: user?.phone || "",
    shipping_street: user?.street || "",
    shipping_city: user?.city || "",
    shipping_state: user?.state || "",
    shipping_postal_code: user?.postal_code || "",
    shipping_country: user?.country || "Philippines",
    payment_method: "cash_on_delivery",
    notes: "",
  })

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const shipping = subtotal >= 1500 ? 0 : 99
  const total = subtotal + shipping

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPlacing(true)
    try {
      const { data } = await api.post("/orders", form)
      toast.success("Order placed successfully!")
      fetchCart()
      navigate(`/orders/${data.data.id}`)
    } catch (error) {
      toast.error(error.userMessage || "Failed to place order.")
    } finally {
      setPlacing(false)
    }
  }

  if (count === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products before checking out.</p>
        <Button asChild className="mt-6">
          <Link to="/shop">Go to shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-7xl px-4 py-8">
      <p className="text-rail mb-1 text-[10px] font-bold text-primary">SECURE CHECKOUT</p>
      <h1 className="font-display mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Shipping info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required>
                  <Input value={form.shipping_name} onChange={update("shipping_name")} required placeholder="Juan Dela Cruz" />
                </Field>
                <Field label="Email" required>
                  <Input type="email" value={form.shipping_email} onChange={update("shipping_email")} required placeholder="you@email.com" />
                </Field>
                <Field label="Phone">
                  <Input value={form.shipping_phone} onChange={update("shipping_phone")} placeholder="0917 123 4567" />
                </Field>
                <Field label="Street address" required>
                  <Input value={form.shipping_street} onChange={update("shipping_street")} required placeholder="123 Mabini St." />
                </Field>
                <Field label="City" required>
                  <Input value={form.shipping_city} onChange={update("shipping_city")} required placeholder="Manila" />
                </Field>
                <Field label="State / Province">
                  <Input value={form.shipping_state} onChange={update("shipping_state")} placeholder="Metro Manila" />
                </Field>
                <Field label="Postal code">
                  <Input value={form.shipping_postal_code} onChange={update("shipping_postal_code")} placeholder="1000" />
                </Field>
                <Field label="Country">
                  <Input value={form.shipping_country} onChange={update("shipping_country")} placeholder="Philippines" />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {paymentOptions.map((option) => (
                  <label
                    key={option.value}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-colors hover:border-primary",
                      form.payment_method === option.value && "border-primary bg-accent/40"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={form.payment_method === option.value}
                      onChange={update("payment_method")}
                      className="mt-1 h-4 w-4 accent-primary"
                    />
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <div>
          <Card className="lg:sticky lg:top-24">
            <CardHeader>
              <CardTitle>Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img src={item.product?.image || "/placeholder.svg"} alt={item.product?.name} className="h-full w-full object-cover" />
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.product?.name}</p>
                    {item.variant && <p className="text-xs text-muted-foreground">{item.variant.label}</p>}
                  </div>
                  <span className="text-sm font-medium">{formatCurrency(item.line_total)}</span>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <Button size="lg" className="w-full" type="submit" disabled={placing}>
                {placing ? (
                  <>
                    <Loader2 className="animate-spin" /> Placing order…
                  </>
                ) : (
                  <>Place order</>
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                This is a demo checkout. No real payment is processed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  )
}