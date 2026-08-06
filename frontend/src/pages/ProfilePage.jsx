import { useState } from "react"
import { Loader2, Lock, User as UserIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthStore } from "@/stores/authStore"
import api, { getErrorMessage } from "@/lib/api"

export function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [saving, setSaving] = useState(false)

  const [info, setInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    street: user?.street || "",
    city: user?.city || "",
    state: user?.state || "",
    postal_code: user?.postal_code || "",
    country: user?.country || "",
  })

  const [pw, setPw] = useState({ current_password: "", password: "", password_confirmation: "" })
  const [pwSaving, setPwSaving] = useState(false)

  const update = (key) => (e) => setInfo((f) => ({ ...f, [key]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await api.put("/profile", info)
      setUser(data.user)
      toast.success("Profile updated successfully!")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    setPwSaving(true)
    try {
      await api.put("/profile/password", pw)
      setPw({ current_password: "", password: "", password_confirmation: "" })
      toast.success("Password changed successfully!")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setPwSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
          {user?.name
            ?.split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{user?.name}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">
            <UserIcon className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="password">
            <Lock className="mr-2 h-4 w-4" /> Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your contact details and shipping address for faster checkout.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={info.name} onChange={update("name")} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={info.email} onChange={update("email")} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={info.phone} onChange={update("phone")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="street">Street address</Label>
                    <Input id="street" value={info.street} onChange={update("street")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" value={info.city} onChange={update("city")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state">State / Province</Label>
                    <Input id="state" value={info.state} onChange={update("state")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="postal_code">Postal code</Label>
                    <Input id="postal_code" value={info.postal_code} onChange={update("postal_code")} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={info.country} onChange={update("country")} />
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="animate-spin" />} Save changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Use a strong password with at least 8 characters.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePassword} className="max-w-sm space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="current">Current password</Label>
                  <Input
                    id="current"
                    type="password"
                    value={pw.current_password}
                    onChange={(e) => setPw({ ...pw, current_password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="new">New password</Label>
                  <Input
                    id="new"
                    type="password"
                    value={pw.password}
                    onChange={(e) => setPw({ ...pw, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">Confirm new password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={pw.password_confirmation}
                    onChange={(e) => setPw({ ...pw, password_confirmation: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={pwSaving}>
                  {pwSaving && <Loader2 className="animate-spin" />} Update password
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}