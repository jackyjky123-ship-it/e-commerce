import { PackageSearch } from "lucide-react"

export function EmptyState({ title = "No results found", description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
      <PackageSearch className="h-10 w-10 text-muted-foreground" />
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  )
}