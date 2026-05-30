import { auth } from "@/auth"
import Link from "next/link"
import { Wrench, CreditCard, Settings, ArrowRight, Sparkles, LifeBuoy } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SyncPlanButton } from "@/components/dashboard/sync-plan-button"
import { PlanSection } from "@/components/dashboard/plan-section"
import { SupportModal } from "@/components/dashboard/support-modal"
import { prisma } from "@/lib/prisma"
import { getCurrentCreditAllocation } from "@/lib/credits"
import { CreditOverview } from "@/components/dashboard/credit-overview"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "My Account — TheWordOf Tools",
  description: "Manage your account, billing, and settings.",
}

export default async function DashboardPage() {
  const session = await auth()
  const userRole = session?.user?.role || "FREE"
  const isPro = userRole === "PRO" || userRole === "BUSINESS" || userRole === "ADMIN"

  const dbUser = session?.user?.id ? await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { creditsRemaining: true, creditsResetAt: true, role: true }
  }) : null

  const toolsDesc = userRole === "ADMIN" || userRole === "BUSINESS"
    ? "Browse and use all business & premium tools."
    : userRole === "PRO"
    ? "Browse and use all premium tools."
    : "Browse and use all free tools."

  const billingDesc = userRole === "BUSINESS"
    ? "Manage your Business subscription."
    : userRole === "PRO"
    ? "Manage your Pro subscription."
    : userRole === "ADMIN"
    ? "Administrative account billing override."
    : "Upgrade your plan to unlock premium."

  return (
    <div className="flex flex-col gap-10 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {session?.user?.name ? `${session.user.name}'s Account` : "My Account"}
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your plan, billing, and settings.
        </p>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { title: "All Tools",  desc: toolsDesc,   icon: Wrench,     href: "/tools",              cta: "Open Tools" },
          { title: "Billing",    desc: billingDesc, icon: CreditCard, href: "/dashboard/billing",  cta: "View Billing" },
          { title: "Settings",   desc: "Update your profile and account.", icon: Settings,   href: "/dashboard/settings", cta: "Open Settings" },
        ].map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.title} className="hover:border-primary/30 hover:bg-primary/5 transition-all">
              <CardContent className="p-5 flex flex-col gap-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-auto" asChild={false}>
                  <Link href={item.href} className="flex items-center justify-center gap-1">
                    {item.cta} <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Credit overview status */}
      {dbUser && (
        <CreditOverview 
          creditsRemaining={dbUser.creditsRemaining} 
          creditsMax={getCurrentCreditAllocation(dbUser.role)} 
          resetDate={dbUser.creditsResetAt} 
          isFree={dbUser.role !== "PRO" && dbUser.role !== "BUSINESS" && dbUser.role !== "ADMIN"}
        />
      )}

      {/* Current plan */}
      <Card className={cn(
        "bg-gradient-to-br border-primary/10 from-primary/10 via-primary/5 to-background"
      )}>
        <PlanSection />
      </Card>

      {/* Support & Concierge */}
      {isPro && (
        <div className="flex flex-col gap-4">
          {/* VIP Concierge Card (Only for Business / Admin) */}
          {(session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN") && (
            <Card className="border-border">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    VIP Concierge & Tool Requests
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    Need a specific tool built for your workflow? Submit a request directly to our engineering team.
                  </p>
                </div>
                <SupportModal type="TOOL_REQUEST">
                  <Button className="shrink-0 font-bold w-full sm:w-auto">
                    Submit Tool Request
                  </Button>
                </SupportModal>
              </CardContent>
            </Card>
          )}

          {/* Priority Support Card (For Pro, Business, and Admin) */}
          <Card className="border-border">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <LifeBuoy className="h-5 w-5 text-primary" />
                  Priority Support
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  Have an issue or question? Get priority email support directly from our core team.
                </p>
              </div>
              <SupportModal type="SUPPORT">
                <Button className="shrink-0 font-bold w-full sm:w-auto">
                  Contact Support
                </Button>
              </SupportModal>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
