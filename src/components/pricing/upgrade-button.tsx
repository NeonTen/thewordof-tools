"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UpgradeButtonProps {
  priceId: string
  className?: string
  children: React.ReactNode
}

export function UpgradeButton({ priceId, className, children }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleUpgrade = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleUpgrade}
      disabled={loading}
      className={cn("w-full h-12 font-bold", className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Zap className="h-4 w-4 mr-2" />
      )}
      {children}
    </Button>
  )
}
