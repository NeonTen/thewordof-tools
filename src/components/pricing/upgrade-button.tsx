"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Zap, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog"

interface UpgradeButtonProps {
  user: { name?: string | null; email?: string | null; id?: string | null } | null | undefined
  className?: string
  children: React.ReactNode
  amount?: number
  usdAmount?: string
  plan?: string
  interval?: string
  currency?: "INR" | "USD"
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export function UpgradeButton({ 
  user, 
  className, 
  children,
  amount = 499,
  usdAmount = "5.99",
  plan = "PREMIUM",
  interval = "month",
  currency = "INR"
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [paypalError, setPaypalError] = useState(false)
  const router = useRouter()

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const handleRazorpay = async () => {
    if (!user) {
      router.push("/login?redirect=/pricing")
      return
    }

    try {
      setLoading(true)
      // 1. Create Subscription
      const res = await fetch("/api/razorpay/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, interval })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        alert(data.error || "Failed to create Razorpay subscription")
        return
      }

      const subscription = data

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: (subscription as { id: string }).id,
        name: "TheWordOf Tools",
        description: `${plan} Subscription - ${interval}`,
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_subscription_id: string;
          razorpay_signature: string;
        }) {
          // 3. Verify Payment
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              amount,
              currency: "INR",
              plan,
              interval
            })
          })
          const verifyData = await verifyRes.json()
          if (verifyData.success) {
            router.push("/dashboard?status=success")
          } else {
            alert(verifyData.error || "Subscription verification failed")
          }
        },
        prefill: {
          name: user ? user.name : "",
          email: user ? user.email : "",
        },
        theme: {
          color: "#3b82f6",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      const err = error as Error;
      console.error("RAZORPAY_ERROR", err)
      alert("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        className={cn("w-full h-12 font-bold inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90", className)}
      >
        <Zap className="h-4 w-4 mr-2" />
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {!user ? "Sign In Required" : "Choose Payment Method"}
          </DialogTitle>
          <DialogDescription>
            {!user
              ? `Create an account or sign in to activate your ${plan} subscription.`
              : currency === "USD"
              ? "Pay securely with PayPal — accepted in 200+ countries."
              : `Select your preferred way to pay for TheWordOf Tools ${plan}.`}
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="py-6 text-center space-y-5">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Zap className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-sm text-foreground">Get Started with {plan}</p>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Sign in to your account or register a free account to proceed with subscription checkout.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button asChild className="w-full font-bold">
                <Link href="/login">Log In</Link>
              </Button>
              <Button variant="outline" asChild className="w-full font-bold">
                <Link href="/register">Sign Up Free</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Razorpay — INR only */}
            {currency === "INR" && (
              <Button 
                variant="outline" 
                className="w-full h-16 text-lg font-bold flex items-center justify-between px-6 border-2 hover:border-primary hover:bg-primary/5 transition-all"
                onClick={handleRazorpay}
                disabled={loading}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p>Razorpay</p>
                    <p className="text-[10px] text-muted-foreground font-normal">UPI, Cards, Netbanking (India)</p>
                  </div>
                </div>
                <span className="text-primary">₹{amount}</span>
              </Button>
            )}

            {/* Divider — only when both options visible */}
            {currency === "INR" && paypalClientId && !paypalError && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or pay with</span>
                </div>
              </div>
            )}

            {/* PayPal — rendered only when dialog is open, valid Client ID is configured and script loads without error */}
            {open && paypalClientId && !paypalError ? (
              <PayPalScriptProvider options={{ 
                clientId: paypalClientId,
                currency: "USD",
                vault: true
              }}>
                <PayPalButtons 
                  style={{ layout: "vertical", shape: "rect", label: "paypal" }}
                  createSubscription={async () => {
                    const res = await fetch("/api/paypal/create-subscription", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ plan, interval })
                    })
                    const sub = await res.json()
                    if (!res.ok) {
                      throw new Error(sub.error || "Failed to create PayPal subscription")
                    }
                    return sub.id
                  }}
                  onApprove={async () => {
                    router.push("/dashboard?status=success")
                  }}
                  onError={(err) => {
                    console.warn("PayPal SDK Error:", err)
                    setPaypalError(true)
                  }}
                />
              </PayPalScriptProvider>
            ) : (
              currency === "USD" && (
                <div className="p-4 text-center text-xs text-muted-foreground bg-muted/30 rounded-xl border border-dashed space-y-1">
                  <p className="font-bold text-foreground">PayPal Checkout Unavailable</p>
                  <p className="text-[11px]">
                    {paypalError 
                      ? "PayPal SDK failed to load. Please check your internet connection or ad-blocker." 
                      : "PayPal is currently being configured. Please check back shortly or use INR checkout."}
                  </p>
                </div>
              )
            )}
            
            {/* USD security note */}
            {currency === "USD" && paypalClientId && !paypalError && (
              <p className="text-[10px] text-center text-muted-foreground">
                🔒 Secured by PayPal — ${usdAmount}/{interval}
              </p>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
