import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User as UserIcon,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { useAuthStore, isAdmin } from "@/stores/authStore"
import { useCartStore } from "@/stores/cartStore"

const categories = [
  { code: "ELC", name: "Electronics", to: "/categories/electronics" },
  { code: "FSH", name: "Fashion", to: "/categories/fashion" },
  { code: "HOM", name: "Home & Living", to: "/categories/home-living" },
  { code: "SPT", name: "Sports & Outdoors", to: "/categories/sports-outdoors" },
  { code: "BTY", name: "Beauty & Health", to: "/categories/beauty-health" },
]

const navLinks = [
  { to: "/shop", label: "Shop" },
  { to: "/deals", label: "Deals" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  const { user, logout } = useAuthStore()
  const cartCount = useCartStore((s) => s.count)

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/shop?search=${encodeURIComponent(search)}`)
    setSearch("")
    setSearchOpen(false)
  }

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu />
        </Button>

        <Link to="/" className="group flex flex-col items-start leading-none" aria-label="ShopVerse home">
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Shop<span className="text-primary">Verse</span>
          </span>
          <span className="text-rail text-[10px] text-muted-foreground">
            Everyday goods
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                  isActive ? "bg-accent text-primary" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-auto rounded-full px-4 py-2 text-[13px] font-semibold text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                aria-label="Open departments"
              >
                Departments
                <ChevronDown className="ml-0.5 h-3.5 w-3.5 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 rounded-xl border p-1.5 shadow-lg">
              <DropdownMenuItem asChild className="px-3 py-2 font-bold">
                <Link to="/categories">All departments</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {categories.map((c) => (
                <DropdownMenuItem key={c.slug} asChild className="flex items-center gap-3 px-3 py-2">
                  <Link to={`/categories/${c.slug}`}>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted font-mono text-[10px] font-bold text-primary">
                      {c.code}
                    </span>
                    {c.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <Input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search the catalog…"
                className="w-44 rounded-full sm:w-64"
              />
              <Button type="submit" variant="ghost" size="icon" aria-label="Search">
                <Search />
              </Button>
            </form>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
            >
              <Search />
            </Button>
          )}

          <Button asChild variant="ghost" size="icon" aria-label="Cart">
            <Link to="/cart" className="relative">
              <ShoppingBag />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-signal px-1.5 text-[10px] font-bold leading-none text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <Avatar className="h-9 w-9 rounded-full bg-primary">
                    <AvatarFallback className="bg-primary text-xs font-bold text-primary-foreground">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="truncate">{user.name}</span>
                    <span className="text-rail text-[10px] font-normal text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  <Package /> My orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <UserIcon /> Profile
                </DropdownMenuItem>
                {isAdmin(user) && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <LayoutDashboard /> Admin dashboard
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-80 flex-col bg-card shadow-xl">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                Shop<span className="text-primary">Verse</span>
              </span>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <X />
              </Button>
            </div>
            <nav className="flex flex-col overflow-y-auto p-4">
              <NavLink
                to="/shop"
                onClick={() => setMobileOpen(false)}
                className="rounded-full px-4 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-accent"
              >
                Shop
              </NavLink>
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `rounded-full px-4 py-2.5 text-sm font-semibold ${
                      isActive ? "bg-accent text-primary" : "text-muted-foreground hover:bg-accent"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              <p className="text-rail mt-4 px-4 pb-1 text-[10px] font-bold text-primary">Departments</p>
              <div className="flex flex-col gap-1">
                <NavLink
                  to="/categories"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent"
                >
                  All departments
                </NavLink>
                {categories.map((c) => (
                  <NavLink
                    key={c.slug}
                    to={`/categories/${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent"
                  >
                    {c.name}
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-muted font-mono text-[9px] text-primary">
                      {c.code}
                    </span>
                  </NavLink>
                ))}
              </div>

              {!user && (
                <div className="mt-4 flex flex-col gap-2 border-t pt-4">
                  <Button asChild variant="outline">
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}