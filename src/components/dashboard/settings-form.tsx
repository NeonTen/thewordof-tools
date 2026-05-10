"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent } from "@/components/ui/card"

interface SettingsFormProps {
  user: {
    name?: string | null
    email?: string | null
  }
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter()
  const { update } = useSession()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [name, setName] = React.useState(user.name || "")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setIsSuccess(false)

    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (response.ok) {
        // Update the session client-side
        await update({ name })
        setIsSuccess(true)
        router.refresh()
        setTimeout(() => setIsSuccess(false), 3000)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={user.email || ""} disabled />
          <p className="text-[0.8rem] text-muted-foreground">
            Your email address is managed by your sign-in provider.
          </p>
        </div>
        <Button type="submit" disabled={isLoading || name === user.name}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : isSuccess ? (
            <Check className="mr-2 h-4 w-4" />
          ) : null}
          {isLoading ? "Saving..." : isSuccess ? "Saved!" : "Save changes"}
        </Button>
      </form>
    </CardContent>
  )
}
