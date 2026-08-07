import { useEffect, useState } from "react"
import { FolderOpen, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import api, { getErrorMessage } from "@/lib/api"

const EMPTY_FORM = { name: "", description: "", active: true }

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchCategories = () => {
    setLoading(true)
    api
      .get("/admin/categories")
      .then(({ data }) => setCategories(data.data))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false))
  }

  useEffect(fetchCategories, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setDialogOpen(true)
  }

  const openEdit = (category) => {
    setEditing(category)
    setForm({ name: category.name, description: category.description || "", active: category.active })
    setDialogOpen(true)
  }

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = { name: form.name, description: form.description, active: form.active ? 1 : 0 }
      if (editing) await api.put(`/admin/categories/${editing.id}`, body)
      else await api.post("/admin/categories", body)
      toast.success(editing ? "Category updated." : "Category created.")
      setDialogOpen(false)
      fetchCategories()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/admin/categories/${toDelete.id}`)
      toast.success(`"${toDelete.name}" deleted.`)
      setToDelete(null)
      fetchCategories()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  const toggleActive = async (category) => {
    try {
      await api.put(`/admin/categories/${category.id}`, {
        name: category.name,
        description: category.description,
        active: category.active ? 0 : 1,
      })
      setCategories((prev) => prev.map((c) => (c.id === category.id ? { ...c, active: !category.active } : c)))
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Categories</h1>
          <p className="text-sm text-muted-foreground">Organize products into departments</p>
        </div>
        <Button onClick={openCreate}>
          <Plus /> Add category
        </Button>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm font-medium">No categories yet</p>
            <p className="text-xs text-muted-foreground">Create your first category to organize products.</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={openCreate}>
              <Plus /> Add category
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Products</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="max-w-56 truncate font-medium">{category.name}</p>
                      {category.description && (
                        <p className="max-w-64 truncate text-xs text-muted-foreground">{category.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="secondary">{category.products_count}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={category.active ? "text-success" : "text-muted-foreground"}
                      onClick={() => toggleActive(category)}
                    >
                      {category.active ? "Active" : "Hidden"}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => openEdit(category)}>
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        aria-label="Delete"
                        onClick={() => setToDelete(category)}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
            <DialogDescription>
              {editing ? `Update "${editing.name}".` : "Add a new department to organize products."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name">Name *</Label>
              <Input id="cat-name" value={form.name} onChange={update("name")} required placeholder="Electronics" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea id="cat-desc" rows={3} value={form.description} onChange={update("description")} placeholder="Gadgets, audio, and accessories for everyday tech." />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">Visible in store</p>
                <p className="text-xs text-muted-foreground">Hidden categories won't appear in the storefront.</p>
              </div>
              <Switch
                checked={form.active}
                onCheckedChange={(val) => setForm((f) => ({ ...f, active: val }))}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : editing ? "Save changes" : "Create category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-medium text-foreground">"{toDelete?.name}"</span>.
              Categories that still have products cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}