"use client"

import { useState } from "react"
import { Loader2, Send } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface SupportModalProps {
  type: "SUPPORT" | "TOOL_REQUEST"
  children: React.ReactNode
}

export function SupportModal({ type, children }: SupportModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  const title = type === "TOOL_REQUEST" ? "Submit Tool Request" : "Contact Priority Support"
  const description = type === "TOOL_REQUEST" 
    ? "As a Business member, you have direct influence over our roadmap. Let us know what tool you need built!"
    : "As a Pro member, you get priority email support. How can we help you today?"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message, type })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request")
      }

      setSuccess(true)
      setTimeout(() => {
        setOpen(false)
        // Reset form after closing
        setTimeout(() => {
          setSuccess(false)
          setSubject("")
          setMessage("")
        }, 500)
      }, 2000)

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="h-12 w-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-green-600 dark:text-green-400">Request Sent Successfully!</h3>
            <p className="text-sm text-muted-foreground">We've received your ticket and will email you back shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md font-medium">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject" 
                placeholder={type === "TOOL_REQUEST" ? "e.g., Build a PDF Merger Tool" : "e.g., Billing Issue"}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                placeholder={type === "TOOL_REQUEST" ? "Describe the tool and how you would use it..." : "Describe your issue in detail..."}
                className="min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || !subject || !message} className="w-full sm:w-auto font-bold">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Request
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
