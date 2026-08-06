import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"

const CODES = {
  electronics: "ELC",
  fashion: "FSH",
  "home-living": "HOM",
  "sports-outdoors": "SPT",
  "beauty-health": "BTY",
}

export function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-rail mb-1 text-[10px] font-bold text-primary">SHOP BY DEPARTMENT</p>
      <h1 className="font-display text-4xl font-bold tracking-tight">Departments</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Five departments, each one stocked and ready. Pick one and the shelf is yours.
      </p>

      {loading ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={`/categories/${c.slug}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-baseline justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-mono text-xs font-bold text-primary">
                  {CODES[c.slug] || "--"}
                </span>
                <span className="text-ticket text-[11px] text-muted-foreground">
                  {c.products_count} {c.products_count === 1 ? "item" : "items"}
                </span>
              </div>
              <h2 className="font-display mt-4 text-2xl font-bold tracking-tight">{c.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <span className="text-rail mt-5 inline-flex items-center gap-1 text-[10px] font-bold text-primary transition-transform group-hover:translate-x-0.5">
                SHOP NOW <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
          <div className="flex flex-col justify-center rounded-2xl border-2 border-dashed border-border bg-transparent p-6">
            <h2 className="font-display text-xl font-bold tracking-tight">Or just walk the whole store.</h2>
            <Button asChild className="mt-4 w-fit">
              <Link to="/shop">
                Browse all <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}