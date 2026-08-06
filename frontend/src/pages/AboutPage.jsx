import { Link } from "react-router-dom"
import { ArrowRight, BadgeCheck, PackageCheck, Tags } from "lucide-react"

import { Button } from "@/components/ui/button"

const bayFacts = [
  { icon: Tags, name: "Electronics", note: "Audio, wearables, keyboards — tested before they're listed." },
  { icon: PackageCheck, name: "Fashion", note: "Everyday clothes and carry, cut for living in tropical weather." },
  { icon: BadgeCheck, name: "Home & Living", note: "Coffee, candles, and the small comforts of a place to live." },
]

export function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:py-20">
          <p className="text-rail mb-2 text-[10px] font-bold opacity-90">ABOUT / THE STORE</p>
          <h1 className="font-display max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            A general store
            <br />
            that keeps it plain.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-primary-foreground/90">
            ShopVerse is a Manila-registered general merchandise store. We buy everyday goods,
            price each one honestly, and ship it the day you order — no hype, no
            "exclusive drop," no fine print worth squinting at.
          </p>
        </div>
      </section>

      <div className="tape" aria-hidden />

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <h2 className="font-display text-2xl font-bold tracking-tight">How the store runs</h2>
            <p className="leading-relaxed text-muted-foreground">
              Every product in the catalog passes through one counter. We check the stock, put a
              tag on the shelf with the price you'll actually pay, and only list things we can pack
              the same day. If a thing leaves us, it leaves tagged and tracked — order numbers and
              statuses follow it the whole way from counter to doorstep.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Keep it simple is the whole policy. One counter, one price, one honest shipping
              charge — free from ₱1,500 so your order feels free of the last traffic as well.
            </p>
            <Button asChild>
              <Link to="/shop">
                Walk the catalog <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <p className="text-rail mb-2 text-[10px] font-bold text-primary">WHAT WE CARRY</p>
            {bayFacts.map((b) => (
              <div key={b.name} className="flex gap-3 rounded-xl bg-muted/60 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <b.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-semibold">{b.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{b.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}