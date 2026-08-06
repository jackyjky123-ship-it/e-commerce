import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CreditCard,
  Package,
  RefreshCcw,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/ProductCard";
import { formatCurrency } from "@/lib/utils";
import api from "@/lib/api";

const departments = [
  { code: "ELC", name: "គ្រឿងអេឡិចត្រូនិក", to: "/categories/electronics" },
  { code: "FSH", name: "ម៉ូដសម្លៀកបំពាក់", to: "/categories/fashion" },
  {
    code: "HOM",
    name: "សម្ភារៈក្នុងផ្ទះនិងក្រៅផ្ទះ",
    to: "/categories/home-living",
  },
  { code: "SPT", name: "Sport", to: "/categories/sports-outdoors" },
  { code: "BTY", name: "Skincare", to: "/categories/beauty-health" },
];

const trust = [
  { icon: Truck, label: "ការដឹកជញ្ជូនឆាប់រហ័ស" },
  {
    icon: RefreshCcw,
    label: "ការប្តូរ ឬសងទំនិញវិញក្នុងរយៈពេល ៧ ថ្ងៃ",
  },
  { icon: ShieldCheck, label: "ការទូទាត់ប្រាក់មានសុវត្ថិភាព" },
  { icon: CreditCard, label: "Card · GCash · COD" },
];

export function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products", { params: { per_page: 8, sort: "rating" } })
      .then(({ data }) => setFeatured(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-emerald-500 text-primary-foreground">
        <div aria-hidden className="absolute inset-0 opacity-50 dot-grid" />
        <div
          aria-hidden
          className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-signal/20 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="flex flex-col gap-6">
            <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-semibold backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
              ទំនិញថ្មីៗប្រចាំសប្តាហ៍
            </p>
            <h1 className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-[4rem]">
              មានលក់ទំនិញ
              <br />
              គ្រប់ប្រភេទ,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">ដឹកជញ្ជូនគ្រប់ខេត្ត ក្រុង</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 z-0 h-4 -rotate-1 rounded-sm bg-signal/90"
                />
              </span>
            </h1>
            <p className="max-w-lg text-lg text-primary-foreground/90">
              គ្រឿងអេឡិចត្រូនិក ម៉ូដសម្លៀកបំពាក់ សម្ភារៈក្នុងផ្ទះនិងក្រៅផ្ទះ —
              បានឆ្លងកាត់ការពិនិត្យ តម្លៃច្បាស់លាស់
              និងដឹកជញ្ជូនចេញក្នុងថ្ងៃដែលអ្នកបញ្ជាទិញតែម្តង។
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="bg-card text-primary shadow-lg transition-shadow hover:shadow-[0_8px_30px_rgba(255,255,255,0.35)] hover:bg-card/90"
              >
                <Link to="/shop">
                  ទិញទំនិញ <ArrowRight />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
              >
                <Link to="/deals">មើលការបញ្ចុះតម្លៃ</Link>
              </Button>
            </div>

            {/* social proof strip */}
            <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-4">
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                <Star className="h-4 w-4 fill-warning text-warning" />
                4.8 average rating
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                <Package className="h-4 w-4 text-white/80" />
                2,000+ orders shipped
              </span>
              {/*<span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                <Truck className="h-4 w-4 text-white/80" />
                ការដឹកជញ្ជូនឆាប់រហ័ស
              </span>*/}
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {loading ? (
                <Skeleton className="aspect-[16/11] w-full rounded-3xl bg-white/20 sm:col-span-2 sm:aspect-[4/3] lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-full" />
              ) : (
                <Link
                  to={`/product/${featured[0]?.slug}`}
                  className="group relative block aspect-[16/11] overflow-hidden rounded-3xl bg-card shadow-2xl ring-1 ring-white/40 transition-all duration-200 hover:-translate-y-1 sm:col-span-2 sm:aspect-[4/3] lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:h-full"
                >
                  <img
                    src={featured[0]?.primary_image_url || "/placeholder.svg"}
                    alt={featured[0]?.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                  {/* ribbon */}
                  <span className="absolute left-0 top-5 rounded-r-full bg-card px-3 py-1.5  text-[13px] font-bold text-primary shadow-md">
                    ការផ្តល់ជូនពិសេសប្រចាំថ្ងៃ
                  </span>

                  {/* discount seal */}
                  {featured[0]?.has_discount && (
                    <div className="absolute right-4 top-4 flex h-20 w-20 -rotate-6 flex-col items-center justify-center rounded-full border-2 border-dashed border-white/70 bg-signal text-white shadow-xl motion-reduce:animate-none animate-float">
                      <span className="text-ticket text-xl leading-none">
                        −{featured[0].discount_percent}%
                      </span>
                      <span className="text-rail mt-0.5 text-[8px]">OFF</span>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="truncate font-display text-2xl font-bold text-white">
                      {featured[0]?.name}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2.5">
                      <span className="text-ticket text-3xl text-white">
                        {formatCurrency(featured[0]?.price)}
                      </span>
                      {featured[0]?.old_price > featured[0]?.price && (
                        <span className="text-sm text-white/60 line-through">
                          {formatCurrency(featured[0].old_price)}
                        </span>
                      )}
                      {featured[0]?.rating > 0 && (
                        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold text-white ring-1 ring-white/25">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          {Number(featured[0].rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )}

              {loading ? (
                <Skeleton className="aspect-[4/3] rounded-3xl bg-white/20" />
              ) : (
                <Link
                  to={`/product/${featured[1]?.slug}`}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-card/95 shadow-xl ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={featured[1]?.primary_image_url || "/placeholder.svg"}
                      alt={featured[1]?.name}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {featured[1]?.has_discount && (
                      <span className="absolute left-3 top-3 rounded-full bg-signal px-2 py-0.5 text-ticket text-[10px] text-white shadow-sm">
                        −{featured[1].discount_percent}%
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-4">
                    <p className="text-rail text-[9px] font-bold text-primary">
                      TOP RATED
                    </p>
                    <p className="truncate text-sm font-bold text-foreground">
                      {featured[1]?.name}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <span className="text-ticket text-base font-bold text-primary">
                        {featured[1] ? formatCurrency(featured[1].price) : ""}
                      </span>
                      {featured[1]?.rating > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-bold text-warning">
                          <Star className="h-3 w-3 fill-warning text-warning" />
                          {Number(featured[1].rating).toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              )}

              {/* deals CTA block */}
              <Link
                to="/deals"
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-signal p-5 text-white shadow-xl ring-1 ring-white/30 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl"
              >
                <span
                  aria-hidden
                  className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/10"
                />
                <div className="relative">
                  <p className=" text-[12px] font-bold text-white/80">
                    ការផ្តល់ជូនពិសេស
                  </p>
                  <p className="font-display mt-2 text-2xl font-bold leading-tight">
                    បញ្ចុះតម្លៃរហូតដល់ -៣០% ក្នុងសប្តាហ៍នេះ
                  </p>
                </div>
                <span className="relative mt-8 inline-flex items-center gap-1.5 text-sm font-bold">
                  ទំនិញបញ្ចុះតម្លៃ
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>

            {/* straddling free-shipping sticker */}
            <div className="absolute -bottom-4 left-6 z-10 motion-reduce:animate-none animate-float">
              <div className="flex items-center gap-2 rounded-full bg-ink py-2 pl-2 pr-4 text-primary-foreground shadow-2xl ring-1 ring-white/20">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
                  <Truck className="h-4 w-4" />
                </span>
                <span className="text-[11px] font-bold">
                  ដឹកជញ្ជូនឥតគិតថ្លៃទិញចាប់ពី 100​USD ឡើងទៅ
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="tape" aria-hidden />

      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px lg:grid-cols-4">
          {trust.map((t) => (
            <div
              key={t.label}
              className="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-foreground"
            >
              <t.icon className="h-4 w-4 shrink-0 text-primary" />
              {t.label}
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <p className=" mb-3 text-[15px] font-bold text-primary">
            ប្រភេទទំនិញ
          </p>
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
                  <span className="block text-sm font-bold text-foreground">
                    {d.name}
                  </span>
                  <span className="text-rail mt-1 inline-flex items-center gap-1 text-[10px] text-primary">
                    Shop now{" "}
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
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
            <p className=" mb-1 text-[13px] font-bold text-primary">
              ទំនិញពេញនិយម / ប្រចាំសប្តាហ៍នេះ
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
              ទំនិញដែលអតិថិជនមានតម្រូវការច្រើន
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
  );
}
