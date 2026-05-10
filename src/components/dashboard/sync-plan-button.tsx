"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Check } from "lucide-react"
import { syncPlanStatus } from "@/app/actions/subscription"

export function SyncPlanButton() {
  const [loading, setLoading] = useState(false)
  const [synced, setSynced] = useState(false)
  const { update } = useSession()

  const handleSync = async () => {
    try {
      setLoading(true)
      const result = await syncPlanStatus()
      
      if (result.success) {
        setSynced(true)
        // This triggers next-auth to refresh the session JWT with explicit new data
        await update({ role: "PRO" })
        // Force a page reload after a short delay to ensure all server components update
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else if (result.message) {
        alert(result.message)
      } else if (result.error) {
        alert(result.error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSync} 
      disabled={loading || synced}
      className="h-8 text-xs font-bold gap-2"
    >
      {synced ? (
        <>
          <Check className="h-3 w-3 text-green-500" /> Plan Synced
        </>
      ) : (
        <>
          <RefreshCcw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> 
          {loading ? "Syncing..." : "Sync Plan"}
        </>
      )}
    </Button>
  )
}
