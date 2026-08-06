import { useState } from "react"
import { Link } from "react-router-dom"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [sending, setSending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setForm({ name: "", email: "", message: "" })
      toast.success("Message noted — we reply within one working day.")
    }, 500)
  }

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const lines = [
    { icon: MapPin, title: "Visit us", value: "123 Mabini St., Manila, Philippines" },
    { icon: Phone, title: "Phone", value: "+63 917 000 0001" },
    { icon: Mail, title: "Email", value: "help@shopverse.example" },
    { icon: Clock, title: "Counter hours", value: "Mon–Sat, 9am–7pm" },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <p className="text-rail mb-1 text-[10px] font-bold text-primary">CONTACT / WE'RE HERE TO HELP</p>
      <h1 className="font-display text-4xl font-bold tracking-tight">Talk to the team</h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Questions about an order, a price, or a delivery? Write to us and a person answers —
        no bots, no endless tickets.
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {lines.map((l) => (
            <div key={l.title} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <l.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-rail text-[10px] font-bold text-primary">{l.title.toUpperCase()}</p>
                <p className="mt-0.5 font-semibold">{l.value}</p>
              </div>
            </div>
          ))}
          <Link
            to="/about"
            className="text-rail inline-flex items-center gap-1 text-[10px] font-bold text-primary hover:underline"
          >
            ABOUT THE STORE →
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <p className="text-rail text-[10px] font-bold text-primary">SEND A NOTE</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                value={form.name}
                onChange={update("name")}
                placeholder="Your name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={update("email")}
                placeholder="you@email.com"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea
              id="contact-message"
              value={form.message}
              onChange={update("message")}
              placeholder="Order number, question, or just to say hi…"
              rows={6}
              required
            />
          </div>
          <Button type="submit" disabled={sending} className="w-full sm:w-auto">
            {sending ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </div>
  )
}