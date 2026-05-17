"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Zap, Loader2, CreditCard } from "lucide-react"
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
  user: any
  className?: string
  children: React.ReactNode
  amount?: number
  usdAmount?: string
  plan?: string
  interval?: string
}

declare global {
  interface Window {
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
  interval = "month"
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Load Razorpay Script
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleRazorpay = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    try {
      setLoading(true)
      // 1. Create Order
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "INR" })
      })
      
      const data = await res.json()
      
      if (!res.ok) {
        alert(data.error || "Failed to create Razorpay order")
        return
      }

      const order = data

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "TheWordOf Tools",
        description: `${plan} Subscription - ${interval}`,
        order_id: order.id,
        handler: async function (response: any) {
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
            alert(verifyData.error || "Payment verification failed")
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3b82f6",
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error: any) {
      console.error("RAZORPAY_ERROR", error)
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
          <DialogTitle>Choose Payment Method</DialogTitle>
          <DialogDescription>
            Select your preferred way to pay for TheWordOf Tools {plan}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Razorpay Button */}
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or pay with</span>
            </div>
          </div>

          {/* PayPal Integration */}
          <PayPalScriptProvider options={{ 
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
            currency: "USD"
          }}>
            <PayPalButtons 
              style={{ layout: "vertical", shape: "rect", label: "paypal" }}
              disabled={!user}
              createOrder={async () => {
                const res = await fetch("/api/paypal/create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ amount: usdAmount, currency: "USD" })
                })
                const order = await res.json()
                return order.id
              }}
              onApprove={async (data) => {
                const res = await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ 
                    orderId: data.orderID,
                    plan,
                    interval
                  })
                })
                const captureData = await res.json()
                if (captureData.success) {
                  router.push("/dashboard?status=success")
                }
              }}
            />
          </PayPalScriptProvider>
          
          {!user && (
            <p className="text-[10px] text-center text-destructive font-bold">
              Please login to proceed with payment.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
