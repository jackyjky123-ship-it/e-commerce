import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

const categories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home & Living", slug: "home-living" },
  { name: "Sports & Outdoors", slug: "sports-outdoors" },
  { name: "Beauty & Health", slug: "beauty-health" },
]

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <h3 className="font-display text-2xl font-bold tracking-tight">
              Shop<span className="text-primary">Verse</span>
            </h3>
            <p className="mt-1 text-rail text-[10px] text-paper/50">
              General merchandise — Manila
            </p>
            <p className="mt-4 max-w-sm text-sm text-paper/70">
              Everyday goods across five departments, priced plainly and packed
              the day you order. Free shipping from ₱1,500, easy 7-day returns.
            </p>
            <Button asChild variant="outline" className="mt-6 border-paper/25 bg-transparent text-paper hover:bg-paper/10 hover:text-paper">
              <Link to="/deals">Browse current deals</Link>
            </Button>
          </div>
          <div>
            <h4 className="text-rail mb-4 text-[11px] font-bold text-primary">Store</h4>
            <ul className="space-y-3 text-sm text-paper/80">
              <li><Link to="/shop" className="transition-colors hover:text-paper">Shop</Link></li>
              <li><Link to="/deals" className="transition-colors hover:text-paper">Deals</Link></li>
              <li><Link to="/categories" className="transition-colors hover:text-paper">All departments</Link></li>
              <li><Link to="/about" className="transition-colors hover:text-paper">About us</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-paper">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-rail mb-4 text-[11px] font-bold text-primary">Categories</h4>
            <ul className="space-y-3 text-sm text-paper/80">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link to={`/categories/${c.slug}`} className="transition-colors hover:text-paper">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-rail mb-4 text-[11px] font-bold text-primary">Account</h4>
            <ul className="space-y-3 text-sm text-paper/80">
              <li><Link to="/orders" className="transition-colors hover:text-paper">My orders</Link></li>
              <li><Link to="/cart" className="transition-colors hover:text-paper">Cart</Link></li>
              <li><Link to="/profile" className="transition-colors hover:text-paper">Profile</Link></li>
            </ul>
            <h4 className="text-rail mb-4 mt-8 text-[11px] font-bold text-primary">Contact</h4>
            <ul className="space-y-2 text-sm text-paper/70">
              <li>help@shopverse.example</li>
              <li>Mon–Sat, 9am–7pm</li>
              <li>Manila, Philippines</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-2 border-t border-paper/15 pt-6 text-xs text-paper/50">
          <span>© {new Date().getFullYear()} ShopVerse — general merchandise.</span>
          <span className="text-rail text-[10px]">Card · GCash · COD</span>
        </div>
      </div>
    </footer>
  )
}