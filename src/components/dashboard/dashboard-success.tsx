"use client"

import { useSearchParams } from "next/navigation"
import { CheckCircle2 } from "lucide-react"

export function DashboardSuccess() {
  const searchParams = useSearchParams()
  const isSuccess = searchParams?.get("success") === "true" || searchParams?.get("status") === "success"

  if (!isSuccess) return null

  return (
    <div className="mt-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
      <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
        <CheckCircle2 className="h-6 w-6 text-green-600" />
      </div>
      <div>
        <p className="font-bold text-green-700">Payment Successful!</p>
        <p className="text-xs text-green-600/80">Your Pro features have been unlocked. Please click "Sync Plan" if your status hasn't updated.</p>
      </div>
    </div>
  )
}
