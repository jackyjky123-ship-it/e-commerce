import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { OrderStatusBadge } from "@/components/OrderStatusBadge"
import api from "@/lib/api"
import { formatCurrency, formatDateTime } from "@/lib/utils"

export function AdminDashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then(({ data }) => setData(data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-xl" />
      </div>
    )
  }

  const stats = [
    {
      title: "Total Sales",
      value: formatCurrency(data.total_sales),
      icon: DollarSign,
      hint: `${data.total_orders} orders placed`,
    },
    {
      title: "Total Orders",
      value: data.total_orders,
      icon: ShoppingCart,
      hint: `${Object.values(data.orders_by_status || {}).reduce((a, b) => a + Number(b), 0) || data.total_orders} all time`,
    },
    {
      title: "Active Users",
      value: data.active_users,
      icon: Users,
      hint: "Registered customers",
    },
    {
      title: "Products",
      value: data.total_products,
      icon: Package,
      hint: `${data.out_of_stock} out of stock`,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your store's performance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="mt-2 text-2xl font-bold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Low stock alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" /> Low Stock Alerts
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/products">
                Manage <ArrowUpRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.low_stock_products?.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No low stock items. All good!</p>
            ) : (
              <div className="space-y-3">
                {data.low_stock_products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.sku}</p>
                    </div>
                    <Badge variant={p.stock === 0 ? "destructive" : "warning"}>
                      {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/orders">
                View all <ArrowUpRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {data.recent_orders?.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {data.recent_orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{order.order_number}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.user?.name} · {formatDateTime(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{formatCurrency(order.total)}</span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}