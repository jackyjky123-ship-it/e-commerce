import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Package, Receipt } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/Pagination"
import { EmptyState } from "@/components/EmptyState"
import { OrderStatusBadge } from "@/components/OrderStatusBadge"
import api from "@/lib/api"
import { formatCurrency, formatDateTime } from "@/lib/utils"

export function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get("/orders", { params: { page } })
      .then(({ data }) => {
        setOrders(data.data)
        setMeta(data.meta)
      })
      .finally(() => setLoading(false))
  }, [page])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-6 h-8 w-40" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When you place an order, it will appear here with live status updates."
          action={
            <Button asChild className="mt-2">
              <Link to="/shop">Browse products</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 pb-3">
                <div>
                  <CardTitle className="text-base">{order.order_number}</CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">{formatDateTime(order.created_at)}</p>
                </div>
                <OrderStatusBadge status={order.status} />
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 overflow-x-auto">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex shrink-0 items-center gap-2">
                      <img
                        src={item.product_image || "/placeholder.svg"}
                        alt={item.product_name}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="text-xs">
                        <p className="max-w-40 truncate font-medium">{item.product_name}</p>
                        <p className="text-muted-foreground">
                          {item.quantity} × {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3">
                  <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Receipt className="h-4 w-4" />
                    {formatCurrency(order.total)}
                  </span>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/orders/${order.id}`}>
                      <Package /> View details
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="pt-4">
            <Pagination page={page} lastPage={meta.last_page} onChange={setPage} />
          </div>
        </div>
      )}
    </div>
  )
}