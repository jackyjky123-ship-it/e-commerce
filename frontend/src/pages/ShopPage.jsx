import { useCallback, useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { Search, SlidersHorizontal, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/ProductCard"
import { Pagination } from "@/components/Pagination"
import { EmptyState } from "@/components/EmptyState"
import { useDebounce } from "@/hooks/useDebounce"
import api from "@/lib/api"
import { cn } from "@/lib/utils"

const PRICE_RANGES = [
  { label: "All prices", min: null, max: null },
  { label: "Under â‚±1,000", min: null, max: 1000 },
  { label: "â‚±1,000 â€“ â‚±2,500", min: 1000, max: 2500 },
  { label: "â‚±2,500 â€“ â‚±5,000", min: 2500, max: 5000 },
  { label: "Over â‚±5,000", min: 5000, max: null },
]

const CATEGORY_CODES = {
  electronics: "ELC",
  fashion: "FSH",
  "home-living": "HOM",
  "sports-outdoors": "SPT",
  "beauty-health": "BTY",
}

export function ShopPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialSearch = searchParams.get("search") || ""
  const initialSort = searchParams.get("sort") || "newest"
  const initialRange = Number(searchParams.get("range")) || 0
  const initialPage = Number(searchParams.get("page")) || 1

  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState(initialSearch)
  const [sort, setSort] = useState(initialSort)
  const [range, setRange] = useState(initialRange)
  const [page, setPage] = useState(initialPage)
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({})
  const [loading, setLoading] = useState(true)

  const debouncedSearch = useDebounce(search, 400)

  const categorySlug = slug || searchParams.get("category") || ""

  const buildParams = useCallback(() => {
    const params = new URLSearchParams()
    if (debouncedSearch) params.set("search", debouncedSearch)
    if (categorySlug) params.set("category", categorySlug)
    if (sort !== "newest") params.set("sort", sort)
    if (range > 0) params.set("range", String(range))
    if (page > 1) params.set("page", String(page))
    return params
  }, [debouncedSearch, categorySlug, sort, range, page])

  useEffect(() => {
    setSearchParams(buildParams(), { replace: true })
  }, [buildParams, setSearchParams])

  useEffect(() => {
    setLoading(true)
    const selected = PRICE_RANGES[range] || {}
    const params = {
      per_page: 12,
      category: categorySlug || undefined,
      sort: sort === "newest" ? undefined : sort,
      search: debouncedSearch || undefined,
      min_price: selected.min,
      max_price: selected.max,
      page,
    }
    Promise.all([
      api.get("/products", { params }),
      api.get("/categories"),
    ])
      .then(([productsRes, categoriesRes]) => {
        setProducts(productsRes.data.data)
        setMeta(productsRes.data.meta)
        setCategories(categoriesRes.data.data)
      })
      .finally(() => setLoading(false))
  }, [debouncedSearch, categorySlug, sort, range, page])

  useEffect(() => setPage(1), [debouncedSearch, categorySlug, sort, range])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <p className="text-rail mb-1 text-[10px] font-bold text-primary">
          {categorySlug ? "CATALOG / DEPARTMENT" : "CATALOG / ALL GOODS"}
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          {categorySlug ? (categories.find((c) => c.slug === categorySlug)?.name || "Category") : "The whole catalog"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? "Counting stock…" : `${meta.total || 0} items on the shelves`}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Filters */}
        <aside className="space-y-6">
          <div>
            <h3 className="text-rail mb-3 text-[10px] font-bold text-muted-foreground">Department</h3>
            <div className="space-y-1">
              <Link
                to="/shop"
                className={cn(
                  "flex w-full items-center justify-between rounded-full px-3 py-2 text-sm transition-colors",
                  !categorySlug ? "bg-primary font-semibold text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <span>
                  <span className="mr-2 text-[10px] opacity-60">ALL</span>
                  All Departments
                </span>
                <span className="text-ticket text-xs opacity-80">
                  {categories.reduce((sum, c) => sum + c.products_count, 0)}
                </span>
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/categories/${c.slug}`}
                  className={cn(
                    "flex w-full items-center justify-between rounded-full px-3 py-2 text-sm transition-colors",
                    categorySlug === c.slug
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <span>
                    <span className="mr-2 text-[10px] opacity-60">
                      {CATEGORY_CODES[c.slug] || "--"}
                    </span>
                    {c.name}
                  </span>
                  <span className="text-ticket text-xs opacity-80">{c.products_count}</span>
                </Link>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-rail mb-3 text-[10px] font-bold text-muted-foreground">Price range</h3>
            <div className="space-y-1">
              {PRICE_RANGES.map((option, i) => (
                <button
                  key={option.label}
                  onClick={() => setRange(i)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-full px-3 py-1.5 text-left text-sm transition-colors cursor-pointer",
                    range === i ? "bg-accent font-semibold text-primary" : "hover:bg-accent/60 text-muted-foreground"
                  )}
                >
                  <span className={cn("h-3.5 w-3.5 rounded-full border", range === i && "border-primary bg-primary")} />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products */}
        <div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search productsâ€¦"
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground sm:hidden" />
              <Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-52">
                <option value="newest">Sort by: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </Select>
            </div>
          </div>

          {(debouncedSearch || range !== 0) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {debouncedSearch && (
                <Badge variant="secondary" className="gap-1 py-1">
                  Search: {debouncedSearch}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearch("")} />
                </Badge>
              )}
              {range !== 0 && (
                <Badge variant="secondary" className="gap-1 py-1">
                  {PRICE_RANGES[range].label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setRange(0)} />
                </Badge>
              )}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              title="No products match your search"
              description="Try adjusting your filters or search terms."
              action={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearch("")
                    setRange(0)
                    setSort("newest")
                  }}
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="mt-10">
                <Pagination page={page} lastPage={meta.last_page} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
