import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import api, { getErrorMessage } from "@/lib/api"

const EMPTY_VARIANT = { option_name: "Size", option_value: "", price_adjustment: 0, stock: 0 }

export function AdminProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [variantsSaving, setVariantsSaving] = useState(false)
  const [featuresText, setFeaturesText] = useState("")

  const [form, setForm] = useState({
    name: "",
    sku: "",
    category_id: "",
    brand: "",
    price: "",
    old_price: "",
    stock: 0,
    active: true,
    description: "",
  })

  const [image, setImage] = useState(null)
  const [variants, setVariants] = useState([])
  const [removedVariantIds, setRemovedVariantIds] = useState([])
  const [productId, setProductId] = useState(null)

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data.data))

    if (isEdit) {
      api
        .get(`/admin/products/${id}`)
        .then(({ data: p }) => {
          setForm({
            name: p.name,
            sku: p.sku,
            category_id: p.category_id || "",
            brand: p.brand || "",
            price: p.price,
            old_price: p.old_price || "",
            stock: p.stock,
            active: p.active,
            description: p.description || "",
          })
          setProductId(p.id)
          setVariants((p.variants || []).map((v) => ({ ...v, price_adjustment: String(v.price_adjustment) })))
          setFeaturesText((p.features || []).join("\n"))
        })
        .catch((error) => toast.error(getErrorMessage(error)))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [id, isEdit])

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }))

  const setVariant = (index, key, value) =>
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, [key]: value } : v)))

  const saveProduct = async () => {
    const payload = new FormData()
    payload.append("name", form.name)
    payload.append("sku", form.sku)
    payload.append("category_id", form.category_id || "")
    payload.append("brand", form.brand || "")
    payload.append("price", form.price || 0)
    payload.append("old_price", form.old_price || "")
    payload.append("stock", form.stock || 0)
    payload.append("active", form.active ? "1" : "0")
    payload.append("description", form.description || "")
    featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean)
      .forEach((f) => payload.append("features[]", f))
    if (image) payload.append("image", image)

    const url = isEdit ? `/admin/products/${id}` : "/admin/products"
    const method = isEdit ? api.put : api.post

    const { data } = await method(url, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return data.data
  }

  const persistVariants = async (productId) => {
    for (const v of variants) {
      if (v.option_name && v.option_value) {
        const body = {
          option_name: v.option_name,
          option_value: v.option_value,
          price_adjustment: Number(v.price_adjustment) || 0,
          stock: Number(v.stock) || 0,
        }
        if (v.id) await api.put(`/admin/products/${productId}/variants/${v.id}`, body)
        else await api.post(`/admin/products/${productId}/variants`, body)
      }
    }
    for (const vid of removedVariantIds) {
      await api.delete(`/admin/products/${productId}/variants/${vid}`)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const product = await saveProduct()
      await persistVariants(product.id)
      toast.success(isEdit ? "Product updated." : "Product created.")
      navigate("/admin/products")
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link to="/admin/products">
              <ArrowLeft />
            </Link>
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">{isEdit ? "Edit Product" : "Add Product"}</h1>
            <p className="text-sm text-muted-foreground">{isEdit ? `Editing ${form.name}` : "Fill in the details to create a new product"}</p>
          </div>
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" /> : <Save />}
          {isEdit ? "Save changes" : "Create product"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label htmlFor="name">Product name *</Label>
                  <Input id="name" value={form.name} onChange={update("name")} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sku">SKU *</Label>
                  <Input id="sku" value={form.sku} onChange={update("sku")} required placeholder="SKU-0001" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" value={form.brand} onChange={update("brand")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={form.category_id}
                    onChange={update("category_id")}
                    className="flex h-9 w-full appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="">No category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (₱) *</Label>
                  <Input id="price" type="number" min="0" step="0.01" value={form.price} onChange={update("price")} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="old_price">Compare at price</Label>
                  <Input id="old_price" type="number" min="0" step="0.01" value={form.old_price} onChange={update("old_price")} placeholder="Optional" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stock">Stock quantity *</Label>
                  <Input id="stock" type="number" min="0" value={form.stock} onChange={update("stock")} required />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" rows={4} value={form.description} onChange={update("description")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="features">Features (one per line)</Label>
                <Textarea id="features" rows={3} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} placeholder={"Active noise cancellation\n40h battery life"} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Visible in store</p>
                  <p className="text-xs text-muted-foreground">Hidden products won't appear in the catalog.</p>
                </div>
                <Switch checked={form.active} onCheckedChange={(val) => setForm((f) => ({ ...f, active: val }))} />
              </div>
            </CardContent>
          </Card>

          {/* Variants */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Variants</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setVariants((prev) => [...prev, { ...EMPTY_VARIANT }])}
              >
                <Plus /> Add variant
              </Button>
            </CardHeader>
            <CardContent>
              {variants.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No variants yet. Add options like Size or Color.
                </p>
              ) : (
                <div className="space-y-3">
                  {variants.map((v, i) => (
                    <div key={v.id || i} className="grid grid-cols-2 gap-3 rounded-lg border p-3 sm:grid-cols-5">
                      <div className="space-y-1">
                        <Label className="text-xs">Option</Label>
                        <Input value={v.option_name} onChange={(e) => setVariant(i, "option_name", e.target.value)} placeholder="Size" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Value</Label>
                        <Input value={v.option_value} onChange={(e) => setVariant(i, "option_value", e.target.value)} placeholder="M" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Adj. price</Label>
                        <Input type="number" value={v.price_adjustment} onChange={(e) => setVariant(i, "price_adjustment", e.target.value)} placeholder="0" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Stock</Label>
                        <Input type="number" value={v.stock} onChange={(e) => setVariant(i, "stock", e.target.value)} placeholder="0" />
                      </div>
                      <div className="flex items-end justify-end gap-2">
                        {v.id && <Badge variant="secondary">Saved</Badge>}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => {
                            if (v.id) setRemovedVariantIds((prev) => [...prev, v.id])
                            setVariants((prev) => prev.filter((_, idx) => idx !== i))
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Image */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square w-full overflow-hidden rounded-xl border bg-muted">
                <img
                  src={image ? URL.createObjectURL(image) : (isEdit ? undefined : "/placeholder.svg")}
                  alt="Preview"
                  className="h-full w-full object-cover"
                  onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="image">Upload image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {isEdit ? "Uploading a new image replaces the primary image." : "PNG or JPG up to 4MB."}
              </p>
            </CardContent>
          </Card>
          <Separator className="hidden" />
        </div>
      </div>
    </form>
  )
}