import { cn } from "@/lib/utils"

const STATUS_META = {
  pending: { label: "Pending", cls: "bg-warning text-white", pulse: true },
  processing: { label: "Processing", cls: "bg-info text-white", pulse: false },
  shipped: { label: "Shipped", cls: "bg-card text-foreground border border-border", pulse: false },
  delivered: { label: "Delivered", cls: "bg-success text-white", pulse: false },
  cancelled: { label: "Cancelled", cls: "bg-destructive text-white", pulse: false },
}

export const ORDER_STATUSES = Object.keys(STATUS_META)

export function OrderStatusBadge({ status }) {
  const meta = STATUS_META[status] ?? { label: status, cls: "bg-muted text-foreground", pulse: false }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
        meta.cls,
        meta.pulse && "motion-reduce:animate-none animate-pulse"
      )}
      title={`Order ${meta.label.toLowerCase()}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {meta.label}
    </span>
  )
}