import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, CheckCircle2, Zap, ArrowRight, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default async function BillingPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login?from=/dashboard/billing")
  }

  const isPro = session.user.role === "PRO" || session.user.role === "ADMIN"

  return (
    <div className="flex flex-col gap-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription plan and payment history.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Current Plan Card */}
        <Card className={cn(
          "relative overflow-hidden border-2",
          isPro ? "border-primary shadow-xl shadow-primary/5" : "border-muted"
        )}>
          {isPro && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
              Active Plan
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-xl">Current Plan</CardTitle>
            <CardDescription>You are currently on the {isPro ? "Pro" : "Free"} plan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black">{isPro ? "₹499" : "₹0"}</span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>

            <ul className="space-y-3">
              {(isPro ? [
                "Unlimited tool usage",
                "Bulk processing & ZIP downloads",
                "High-priority AI generation",
                "Custom invoice branding",
                "No upgrade banners",
                "Priority support"
              ] : [
                "Access to all 13 core tools",
                "Standard processing speeds",
                "3 AI captions per generation",
                "3 invoices per month",
                "Basic tool functionality"
              ]).map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className={cn("h-4 w-4", isPro ? "text-primary" : "text-muted-foreground")} />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t">
              {isPro ? (
                <Button className="w-full font-bold" variant="outline" disabled>
                  Manage via Stripe Portal (Coming Soon)
                </Button>
              ) : (
                <Button className="w-full font-black shadow-lg shadow-primary/20" asChild>
                  <Link href="/pricing">Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Billing Info / Support */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Secure Billing</CardTitle>
              <CardDescription>
                Your payments are securely processed by Stripe. We never store your credit card information on our servers.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Need help with billing?</CardTitle>
              <CardDescription>
                If you have questions about your invoice or want to request a refund, please contact our support team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="link" className="p-0 h-auto font-bold text-primary">
                support@thewordof.com
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
