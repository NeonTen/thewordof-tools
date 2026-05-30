"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, X, ArrowRight, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProGateProps {
  children: React.ReactNode
  /** Short name of the feature, e.g. "Bulk ZIP Download" */
  feature: string
  /** When true the feature works normally. When false, clicking shows upgrade prompt. */
  isPro?: boolean
  /** Extra classes on the wrapper */
  className?: string
  /** The subscription tier required to unlock this feature */
  tier?: 'pro' | 'business'
}

/**
 * Wraps any Pro-gated action. In Phase 1 isPro is always false (client-side only).
 * In Phase 2 pass the user's real plan from a server session.
 */
export function ProGate({ children, feature, isPro = false, className, tier = 'pro' }: ProGateProps) {
  const [showPrompt, setShowPrompt] = useState(false)

  if (isPro) return <>{children}</>

  const isBusinessTier = tier === 'business'

  return (
    <div className={cn("relative group", className)}>
      {/* Intercept click via invisible overlay */}
      <div
        className="absolute inset-0 z-10 cursor-pointer"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowPrompt(true)
        }}
      />
      
      {/* Visual Indicator: Dimmed + Crown Icon */}
      <div className="pointer-events-none opacity-40 select-none grayscale-[0.8] transition-all group-hover:grayscale-0 group-hover:opacity-60">
        <div className={cn(
          "absolute top-1 right-1 z-[5] backdrop-blur-md p-1.5 rounded-md border shadow-sm",
          isBusinessTier
            ? "bg-purple-500/10 border-purple-500/20"
            : "bg-amber-500/10 border-amber-500/20"
        )}>
          <Crown className={cn(
            "h-2.5 w-2.5",
            isBusinessTier
              ? "text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400"
              : "text-amber-500 fill-amber-500"
          )} />
        </div>
        {children}
      </div>

      {/* Fixed Modal upgrade prompt */}
      {showPrompt && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setShowPrompt(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border bg-background p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setShowPrompt(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center space-y-6">
              <div className={cn(
                "mx-auto w-16 h-16 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform",
                isBusinessTier ? "bg-purple-500/10" : "bg-amber-500/10"
              )}>
                <Crown className={cn(
                  "h-8 w-8",
                  isBusinessTier ? "text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400" : "text-amber-500 fill-amber-500"
                )} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">
                  {isBusinessTier ? "Business Feature" : "Pro Feature"}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  <span className="font-bold text-foreground">{feature}</span> requires a {isBusinessTier ? "Business" : "Pro"} subscription. Upgrade now to unlock all premium tools and unlimited processing.
                </p>
              </div>

              <div className="grid gap-3 pt-2">
                <Button size="lg" className="h-12 font-black text-base shadow-xl shadow-primary/20" asChild>
                  <Link href="/pricing" onClick={() => setShowPrompt(false)}>
                    View {isBusinessTier ? "Business" : "Pro"} Plans <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="font-bold text-muted-foreground"
                  onClick={() => setShowPrompt(false)}
                >
                  Maybe later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Small inline badge used in nav and cards */
export function ProBadge({ className, role }: { className?: string; role?: string }) {
  const isBusiness = role === "BUSINESS"
  return (
    <span className={cn(
      "inline-flex items-center gap-0.5 text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full border",
      isBusiness 
        ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20"
        : "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border-amber-500/20",
      className
    )}>
      <Crown className="h-2 w-2 fill-current" /> {isBusiness ? "Business" : "Pro"}
    </span>
  )
}
