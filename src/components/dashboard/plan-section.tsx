"use client"

import { useSession } from "next-auth/react"
import { SyncPlanButton } from "./sync-plan-button"
import { Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function PlanSection() {
  const { data: session } = useSession()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "ADMIN"

  return (
    <CardContent className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-black uppercase tracking-widest text-primary">Current Plan</p>
            <SyncPlanButton />
          </div>
          <p className="text-2xl font-black">{isPro ? "Pro" : "Free"}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {isPro 
              ? "You have full access to all premium tools and AI features." 
              : "Upgrade to Pro for unlimited access to all tools and AI features."}
          </p>
        </div>
        {!isPro && (
          <Button className="shrink-0 font-bold" asChild>
            <Link href="/pricing" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" /> Upgrade to Pro
            </Link>
          </Button>
        )}
        {isPro && (
          <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
        )}
      </div>
    </CardContent>
  )
}
