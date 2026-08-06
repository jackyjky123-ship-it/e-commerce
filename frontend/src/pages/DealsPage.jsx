import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Percent } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/ProductCard"
import api from "@/lib/api"

export function DealsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/products", { params: { on_sale: 1, per_page: 60 } })
      .then(({ data }) => setProducts(data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="mb-2 inline-flex items-center gap-1.5">
            <span className="text-rail inline-flex items-center gap-1 rounded-full bg-signal px-2.5 py-1 font-bold text-white">
              <Percent className="h-3 w-3" /> MARKED DOWN
            </span>
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            The deals aisle
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Everything here is priced at a cut rate.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to="/shop">
            Full catalog <ArrowRight />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">
          Nothing marked down right now — check back soon.
        </p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}