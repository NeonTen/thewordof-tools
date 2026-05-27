"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function CancelButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will still keep access to your premium features until the end of the current billing cycle.")) {
      return
    }

    try {
      setLoading(true)
      const res = await fetch("/api/subscription/cancel", {
        method: "POST",
      })

      const data = await res.json()
      if (res.ok) {
        alert("Subscription cancelled successfully!")
        router.refresh()
      } else {
        alert(data.error || "Failed to cancel subscription")
      }
    } catch (err) {
      console.error(err)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="destructive" 
      onClick={handleCancel} 
      disabled={loading}
      className="font-bold shadow-lg shadow-destructive/10"
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Cancel Subscription
    </Button>
  )
}
