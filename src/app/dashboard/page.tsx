import { auth } from "@/auth"
import Link from "next/link"
import { Wrench, CreditCard, Settings, ArrowRight, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SyncPlanButton } from "@/components/dashboard/sync-plan-button"
import { DashboardSuccess } from "@/components/dashboard/dashboard-success"
import { PlanSection } from "@/components/dashboard/plan-section"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "My Account — TheWordOf Tools",
  description: "Manage your account, billing, and settings.",
}

export default async function DashboardPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "ADMIN"

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
          { title: "All Tools",  desc: "Browse and use all free tools.",  icon: Wrench,     href: "/tools",              cta: "Open Tools" },
          { title: "Billing",    desc: "Manage your Pro subscription.",    icon: CreditCard, href: "/dashboard/billing",  cta: "View Billing" },
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

      {/* Current plan */}
      <Card className={cn(
        "bg-gradient-to-br border-primary/10 from-primary/10 via-primary/5 to-background"
      )}>
        <PlanSection />
      </Card>
    </div>
  )
}
