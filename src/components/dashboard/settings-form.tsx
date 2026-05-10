"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check, Lock, ShieldCheck, User } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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
  const [error, setError] = React.useState<string | null>(null)
  
  const [name, setName] = React.useState(user.name || "")
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setIsSuccess(false)
    setError(null)

    if (newPassword) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      if (!passwordRegex.test(newPassword)) {
        setError("New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.")
        setIsLoading(false)
        return
      }
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name, 
          currentPassword: currentPassword || undefined, 
          newPassword: newPassword || undefined 
        }),
      })

      if (response.ok) {
        if (name !== user.name) {
          await update({ name })
        }
        setIsSuccess(true)
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        router.refresh()
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        const errorData = await response.text()
        setError(errorData || "Failed to update settings")
      }
    } catch (error) {
      console.error(error)
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const isPasswordFormFilled = currentPassword || newPassword || confirmPassword
  const isSaveDisabled = isLoading || (name === user.name && !isPasswordFormFilled)

  return (
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <User className="h-4 w-4" />
            <span>Profile Information</span>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" defaultValue={user.email || ""} disabled className="bg-muted/50" />
              <p className="text-[0.75rem] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Managed by your sign-in provider.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Lock className="h-4 w-4" />
            <span>Security & Password</span>
          </div>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 chars + symbols"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
            {error}
          </p>
        )}

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={isSaveDisabled} className="shadow-lg shadow-primary/20">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isSuccess ? (
              <Check className="mr-2 h-4 w-4" />
            ) : null}
            {isLoading ? "Saving Changes..." : isSuccess ? "Settings Updated!" : "Save All Changes"}
          </Button>
        </div>
      </form>
    </CardContent>
  )
}

