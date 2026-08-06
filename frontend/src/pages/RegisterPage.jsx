import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/stores/authStore"
import { useCartStore } from "@/stores/cartStore"
import api, { getErrorMessage } from "@/lib/api"

export function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const mergeAfterLogin = useCartStore((s) => s.mergeAfterLogin)
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "" })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    try {
      const { data } = await api.post("/auth/register", form)
      setAuth(data.user, data.token)
      await mergeAfterLogin()
      await useCartStore.getState().fetchCart()
      toast.success("Account created! Welcome to ShopVerse.")
      navigate("/", { replace: true })
    } catch (error) {
      const data = error?.response?.data
      if (data?.errors) {
        const flattened = {}
        Object.entries(data.errors).forEach(([k, v]) => (flattened[k] = v[0]))
        setErrors(flattened)
      }
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <Card className="w-full">
        <CardHeader className="text-center">
          <p className="text-rail text-[10px] font-bold text-primary">NEW MEMBER</p>
          <CardTitle className="font-display text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>Join ShopVerse and start shopping today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" placeholder="Juan Dela Cruz" value={form.name} onChange={update("name")} required />
              {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@email.com" value={form.email} onChange={update("email")} required />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={update("password")}
                required
              />
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password_confirmation">Confirm password</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={form.password_confirmation}
                onChange={update("password_confirmation")}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="animate-spin" />}
              Create account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}