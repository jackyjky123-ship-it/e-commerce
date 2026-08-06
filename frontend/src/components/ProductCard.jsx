import { Link } from "react-router-dom"
import { ShoppingCart, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/stores/cartStore"
import { cn, formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

export function ProductCard({ product, className }) {
  const addItem = useCartStore((s) => s.addItem)
  const inStock = product.stock > 0

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const res = await addItem({ productId: product.id, quantity: 1 })
    if (res.ok) toast.success(res.message)
    else toast.error(res.message)
  }

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <Link
        to={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden bg-muted"
        aria-label={product.name}
      >
        <img
          src={product.primary_image_url || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          loading="lazy"
        />

        {product.has_discount && (
          <span className="absolute left-3 top-3 rounded-full bg-signal px-2.5 py-1 text-ticket text-xs text-white shadow-sm">
            −{product.discount_percent}%
          </span>
        )}

        {!inStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-card/70">
            <span className="rounded-full bg-foreground px-3 py-1.5 text-rail text-[10px] font-bold tracking-widest text-background">
              Sold out
            </span>
          </span>
        )}

        <span
          aria-hidden
          className="absolute right-3 top-3 rounded-full bg-card/95 px-3 py-1.5 text-ticket text-[13px] leading-none text-foreground shadow-sm"
        >
          {formatCurrency(product.price)}
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="text-rail flex items-center justify-between gap-2 text-[10px] text-muted-foreground">
          <span className="truncate">
            {(product.category?.name || product.brand || "Unassigned").toUpperCase()}
          </span>
          {product.rating > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              {Number(product.rating).toFixed(1)}
            </span>
          )}
        </p>
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 text-[14px] font-semibold leading-snug text-foreground hover:text-primary"
        >
          {product.name}
        </Link>

        <div className="mt-auto pt-3">
          <Button
            size="sm"
            className="w-full"
            onClick={handleAddToCart}
            disabled={!inStock}
          >
            <ShoppingCart className="size-3.5!" />
            {inStock ? "Add to cart" : "Sold out"}
          </Button>
        </div>
      </div>
    </div>
  )
}