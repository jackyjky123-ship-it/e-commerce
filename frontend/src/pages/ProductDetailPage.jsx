import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Check, Minus, Plus, ShieldCheck, ShoppingCart, Star, Truck } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/ProductCard"
import { useCartStore } from "@/stores/cartStore"
import { cn, formatCurrency } from "@/lib/utils"
import api from "@/lib/api"

export function ProductDetailPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [adding, setAdding] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    setLoading(true)
    setProduct(null)
    setQuantity(1)
    setSelectedVariant(null)
    setActiveImage(0)

    api
      .get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data.data)
        if (data.data.category) {
          return api
            .get("/products", {
              params: { category: data.data.category.slug, per_page: 4 },
            })
            .then(({ data: related }) => setRelated(related.data))
        }
      })
      .catch(() => toast.error("Product not found."))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-[3px]" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-muted-foreground">The product you are looking for does not exist.</p>
        <Button asChild className="mt-6">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    )
  }

  const images = product.images || []
  const variants = product.variants || []
  const variantGroups = [...new Set(variants.map((v) => v.option_name))]
  const inStock = product.stock > 0
  const price = product.price + (selectedVariant?.price_adjustment || 0)
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock

  const handleAdd = async () => {
    setAdding(true)
    const res = await addItem({
      productId: product.id,
      quantity,
      variantId: selectedVariant?.id || null,
    })
    if (res.ok) toast.success(res.message)
    else toast.error(res.message)
    setAdding(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-rail mb-6 flex items-center gap-2 text-[11px] text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span className="text-border">/</span>
        <Link to="/shop" className="hover:text-foreground">Catalog</Link>
        {product.category && (
          <>
            <span className="text-border">/</span>
            <Link to={`/categories/${product.category.slug}`} className="hover:text-foreground">
              {product.category.name.toUpperCase()}
            </Link>
          </>
        )}
        <span className="text-border">/</span>
        <span className="truncate text-foreground">{product.name.toUpperCase()}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <img
              src={images[activeImage]?.url || product.primary_image_url || "/placeholder.svg"}
              alt={product.name}
              className="aspect-square w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border-2 transition-colors cursor-pointer",
                    activeImage === i ? "border-primary" : "border-transparent hover:border-border"
                  )}
                >
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">{product.brand || "Generic"}</Badge>
              {product.stock <= 5 && product.stock > 0 && (
                <Badge variant="warning">Only {product.stock} left</Badge>
              )}
              {!inStock && <Badge variant="destructive">Out of stock</Badge>}
            </div>
            <h1 className="font-display mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                {Number(product.rating).toFixed(1)}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-rail text-[11px] text-muted-foreground">SKU {product.sku}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="text-ticket text-4xl text-primary">{formatCurrency(price)}</span>
            {product.old_price && product.old_price > price && (
              <span className="text-lg text-muted-foreground line-through">{formatCurrency(product.old_price)}</span>
            )}
            {product.has_discount && (
              <span className="rounded-full bg-signal px-2.5 py-1 text-ticket text-xs text-white">
                SAVE {product.discount_percent}%
              </span>
            )}
          </div>

          <p className="text-muted-foreground leading-relaxed">{product.description}</p>

          {product.features?.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {product.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-success" />
                  {f}
                </div>
              ))}
            </div>
          )}

          {variantGroups.length > 0 && (
            <div className="space-y-4">
              <Separator />
              {variantGroups.map((group) => (
                <div key={group}>
                  <Label className="mb-2 block text-sm font-medium">
                    {group}: <span className="text-muted-foreground">{selectedVariant?.option_value || "Select"}</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {variants
                      .filter((v) => v.option_name === group)
                      .map((v) => (
                        <Button
                          key={v.id}
                          variant={selectedVariant?.id === v.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedVariant(v)}
                        >
                          {v.option_value}
                        </Button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator />

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border bg-card">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus />
              </Button>
              <span className="w-10 text-center font-semibold tabular-nums">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
                disabled={quantity >= availableStock}
                aria-label="Increase quantity"
              >
                <Plus />
              </Button>
            </div>

            <Button size="lg" className="flex-1 rounded-2xl sm:flex-none" onClick={handleAdd} disabled={!inStock || adding}>
              <ShoppingCart />
              {adding ? "Adding…" : "Add to cart"}
            </Button>
          </div>

          <div className="grid gap-3 rounded-2xl border border-border bg-card p-5 text-sm shadow-sm sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              Free shipping over ₱1,500
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              7-day returns &amp; secure checkout
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16">
          <p className="text-rail mb-1 text-[10px] font-bold text-primary">YOU MIGHT ALSO LIKE</p>
          <h2 className="font-display mb-6 text-2xl font-bold tracking-tight">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}