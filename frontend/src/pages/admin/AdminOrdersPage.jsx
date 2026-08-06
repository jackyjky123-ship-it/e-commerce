import { useEffect, useState } from "react"
import { Eye, Search } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/Pagination"
import { OrderStatusBadge } from "@/components/OrderStatusBadge"
import { EmptyState } from "@/components/EmptyState"
import api, { getErrorMessage } from "@/lib/api"
import { formatCurrency, formatDateTime } from "@/lib/utils"

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
]

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [meta, setMeta] = useState({})
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const [viewing, setViewing] = useState(null)
  const [viewLoading, setViewLoading] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    setLoading(true)
    api
      .get("/admin/orders", { params: { page, status: status || undefined, search: search || undefined } })
      .then(({ data }) => {
        setOrders(data.data.data)
        setMeta(data.data.meta)
      })
      .finally(() => setLoading(false))
  }, [page, status, search])

  const openOrder = async (order) => {
    setViewLoading(true)
    setViewing(order)
    try {
      const { data } = await api.get(`/admin/orders/${order.id}`)
      setViewing(data.data)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setViewLoading(false)
    }
  }

  const updateStatus = async (newStatus) => {
    setUpdating(true)
    try {
      const { data } = await api.put(`/admin/orders/${viewing.id}/status`, { status: newStatus })
      setViewing(data.data)
      setOrders((prev) => prev.map((o) => (o.id === data.data.id ? { ...o, status: data.data.status } : o)))
      toast.success(`Order marked as "${newStatus}".`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Orders</h1>
        <p className="text-sm text-muted-foreground">Track and manage customer orders</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search by order number or customer…"
            className="pl-9"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value)
            setPage(1)
          }}
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-44"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <EmptyState title="No orders found" description="Try adjusting your search or filters." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead className="hidden md:table-cell">Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_number}</TableCell>
                  <TableCell className="hidden md:table-cell">{order.user?.name || order.shipping_name}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {formatDateTime(order.created_at)}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openOrder(order)} aria-label="View order">
                      <Eye />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Pagination page={page} lastPage={meta.last_page} onChange={setPage} />

      {/* Order detail dialog */}
      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewing?.order_number}</DialogTitle>
            <DialogDescription>
              {viewing ? `Placed ${formatDateTime(viewing.created_at)} by ${viewing.user?.name || viewing.shipping_name}` : ""}
            </DialogDescription>
          </DialogHeader>

          {viewLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-24 rounded-lg" />
              <Skeleton className="h-24 rounded-lg" />
            </div>
          ) : viewing ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current status</p>
                  <div className="mt-1">
                    <OrderStatusBadge status={viewing.status} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["pending", "processing", "shipped", "delivered", "cancelled"].map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={viewing.status === s ? "default" : "outline"}
                      disabled={updating}
                      onClick={() => updateStatus(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {viewing.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.product_image || "/placeholder.svg"}
                      alt={item.product_name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product_name}</p>
                      {item.variant_label && <p className="text-xs text-muted-foreground">{item.variant_label}</p>}
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} × {formatCurrency(item.unit_price)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(viewing.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{viewing.shipping_cost === 0 ? "Free" : formatCurrency(viewing.shipping_cost)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(viewing.total)}</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ship to</p>
                  <p className="text-sm">{viewing.shipping_name}</p>
                  <p className="text-sm text-muted-foreground">{viewing.shipping_street}</p>
                  <p className="text-sm text-muted-foreground">
                    {viewing.shipping_city}, {viewing.shipping_state} {viewing.shipping_postal_code}
                  </p>
                  <p className="text-sm text-muted-foreground">{viewing.shipping_country}</p>
                </div>
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Payment</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary" className="capitalize">
                      {viewing.payment_method.replace("_", " ")}
                    </Badge>
                    <Badge variant="success" className="capitalize">
                      {viewing.payment_status.replace("_", " ")}
                    </Badge>
                  </div>
                  {viewing.shipping_phone && (
                    <p className="mt-2 text-sm text-muted-foreground">{viewing.shipping_phone}</p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}