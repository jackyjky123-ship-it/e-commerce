import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Package, RefreshCcw, ShieldCheck, Star, Truck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/ProductCard"
import { formatCurrency } from "@/lib/utils"
import api from "@/lib/api"

const departments = [
  { code: "ELC", name: "Electronics", to: "/categories/electronics" },
  { code: "FSH", name: "Fashion", to: "/categories/fashion" },
  { code: "HOM", name: "Home & Living", to: "/categories/home-living" },
  { code: "SPT", name: "Sports & Outdoors", to: "/categories/sports-outdoors" },
  { code: "BTY", name: "Beauty & Health", to: "/categories/beauty-health" },
]

const trust = [
  { icon: Truck, label: "Free shipping over ₱1,500" },
  { icon: RefreshCcw, label: "7-day easy returns" },
  { icon: ShieldCheck, label: "Secure checkout" },
  { icon: Package, label: "Packed & shipped daily" },
]

export function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/products", { params: { per_page: 8, sort: "rating" } })
      .then(({ data }) => setFeatured(data.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <section className="bg-gradient-to-br from-primary via-primary to-emerald-500 text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="flex flex-col justify-center gap-5">
            <p className="text-rail inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              NEW ARRIVALS WEEKLY
            </p>
            <h1 className="font-display text-[2.6rem] leading-[1.02] font-bold tracking-tight sm:text-6xl lg:text-[4rem]">
              Good stuff,
              <br />
              priced in{" "}
              <span className="underline decoration-signal decoration-8 underline-offset-4">plain pesos.</span>
            </h1>
            <p className="max-w-lg text-lg text-primary-foreground/90">
              Electronics, fashion, home, and outdoor goods — tested, priced, and
              out the door the same day you order.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-card text-primary hover:bg-card/90">
                <Link to="/shop">
                  Shop the catalog <ArrowRight />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-white/15 hover:text-primary-foreground">
                <Link to="/deals">View deals</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-6 rounded-[2.5rem] opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_70%)] dot-grid"
            />
            <div
              aria-hidden
              className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/15 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-signal/25 blur-3xl"
            />

            <div className="relative flex flex-col gap-6">
              {loading ? (
                <Skeleton className="aspect-[16/11] w-full rounded-3xl bg-white/20" />
              ) : (
                <div className="relative">
                  {/* offset "peel" card behind the featured product */}
                  <div
                    aria-hidden
                    className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-card/40 ring-1 ring-white/30"
                  />

                  <Link
                    to={`/product/${featured[0]?.slug}`}
                    className="group relative -rotate-1 block aspect-[16/11] overflow-hidden rounded-3xl bg-card shadow-2xl ring-1 ring-white/40 transition-all duration-200 hover:rotate-0 hover:-translate-y-1"
                  >
                    <img
                      src={featured[0]?.primary_image_url || "/placeholder.svg"}
                      alt={featured[0]?.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

                    {featured[0]?.has_discount && (
                      <div className="absolute left-4 top-4 flex -rotate-3 items-center gap-1 rounded-full bg-signal px-3 py-1 text-ticket text-xs text-white shadow-lg motion-reduce:animate-none animate-float">
                        −{featured[0].discount_percent}% today
                      </div>
                    )}
                    <span className="text-ticket absolute right-4 top-4 rounded-full bg-card/95 px-3 py-1.5 text-sm text-foreground shadow-xl">
                      {formatCurrency(featured[0]?.price)}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-rail text-[10px] font-bold tracking-widest text-white/80">
                        FEATURED THIS WEEK
                      </p>
                      <div className="mt-1 flex items-end justify-between gap-3">
                        <p className="truncate font-display text-xl font-bold text-white">
                          {featured[0]?.name}
                        </p>
                        {featured[0]?.rating > 0 && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold text-white ring-1 ring-white/25">
                            <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                            {Number(featured[0].rating).toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((i, idx) =>
                  loading ? (
                    <Skeleton key={i} className="aspect-square rounded-2xl bg-white/20" />
                  ) : (
                    <Link
                      key={i}
                      to={`/product/${featured[i]?.slug}`}
                      className={`group relative overflow-hidden rounded-2xl bg-card/95 shadow-lg ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                        idx === 0 ? "rotate-1" : "-rotate-1"
                      }`}
                    >
                      <img
                        src={featured[i]?.primary_image_url || "/placeholder.svg"}
                        alt={featured[i]?.name}
                        className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {featured[i]?.has_discount && (
                        <span className="absolute left-2 top-2 rounded-full bg-signal px-2 py-0.5 text-ticket text-[10px] text-white shadow-sm">
                          −{featured[i].discount_percent}%
                        </span>
                      )}
                      <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <span className="truncate text-[11px] font-semibold text-foreground">
                          {featured[i]?.name}
                        </span>
                        <span className="text-ticket shrink-0 text-[11px] text-primary">
                          {featured[i] ? formatCurrency(featured[i].price) : ""}
                        </span>
                      </div>
                    </Link>
                  )
                )}
              </div>

              {/* straddling review sticker */}
              <div className="absolute -right-3 -bottom-5 z-10 motion-reduce:animate-none animate-float">
                <div className="flex items-center gap-2 rounded-2xl bg-card px-3.5 py-2 shadow-2xl ring-1 ring-border">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-warning text-white">
                    <Star className="h-4 w-4 fill-current" />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[12px] font-bold text-foreground">Top rated</p>
                    <p className="text-rail text-[9px] text-muted-foreground">
                      {featured[0]?.rating ? Number(featured[0].rating).toFixed(1) : "4.8"} · 120+ orders
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="tape" aria-hidden />

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px lg:grid-cols-4">
          {trust.map((t) => (
            <div key={t.label} className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-foreground">
              <t.icon className="h-4 w-4 shrink-0 text-primary" />
              {t.label}
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className="text-rail mb-1 text-[10px] font-bold text-primary">DEPARTMENTS</p>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {departments.map((d, i) => (
              <Link
                key={d.code}
                to={d.to}
                className="group flex flex-col justify-between gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md"
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs font-bold text-primary"
                  style={{ backgroundColor: `var(--color-accent)` }}
                >
                  {d.code}
                </span>
                <div>
                  <span className="block text-sm font-bold text-foreground">{d.name}</span>
                  <span className="text-rail mt-1 inline-flex items-center gap-1 text-[10px] text-primary">
                    Shop now <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-rail mb-1 text-[10px] font-bold text-primary">TOP / THIS WEEK</p>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              The goods people keep returning for
            </h2>
          </div>
          <Button asChild variant="outline">
            <Link to="/shop">
              View all <ArrowRight />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}