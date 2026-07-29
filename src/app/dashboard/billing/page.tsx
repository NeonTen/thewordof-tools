import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Calendar,
  Clock,
  History,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CancelButton } from "@/components/pricing/cancel-button";

export default async function BillingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?from=/dashboard/billing");
  }

  // Fetch user data for fallback date
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { createdAt: true },
  });

  // Fetch real subscription data
  const subscription = await prisma.subscription.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const isPro = session.user.role === "PRO" || session.user.role === "ADMIN";
  const isBusiness =
    session.user.role === "BUSINESS" || session.user.role === "ADMIN";
  const hasPremium = isPro || isBusiness;

  let planName = "Free Explorer";
  let planPrice = "₹0";
  let intervalText = "month";

  if (hasPremium) {
    if (subscription?.plan === "BUSINESS" || session.user.role === "BUSINESS") {
      planName = "Business";
      planPrice = subscription?.amount
        ? `${subscription.currency === "USD" ? "$" : "₹"}${subscription.amount}`
        : "₹999";
      intervalText = subscription?.interval || "month";
    } else {
      planName = "Premium Pro";
      planPrice = subscription?.amount
        ? `${subscription.currency === "USD" ? "$" : "₹"}${subscription.amount}`
        : "₹499";
      intervalText = subscription?.interval || "month";
    }
  }

  const billingStartDate =
    subscription?.createdAt || user?.createdAt || new Date();

  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-primary" />
          Billing & Subscription
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Manage your plan, view billing history, and update payment methods.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Current Plan Summary */}
        <Card
          className={cn(
            "md:col-span-2 relative overflow-hidden border-2",
            hasPremium
              ? "border-primary/50 bg-primary/5 shadow-xl shadow-primary/5"
              : "border-muted",
          )}
        >
          {hasPremium && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-6 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-bl-2xl shadow-sm">
              Current Active Plan
            </div>
          )}
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-black text-primary">
              {planName}
            </CardTitle>
            <CardDescription className="text-base">
              {hasPremium
                ? `You have full access to ${isBusiness ? "all API features and" : ""} premium AI tools.`
                : "You are currently on the limited free tier."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-2 py-4">
              <span className="text-5xl font-black tracking-tighter">
                {planPrice}
              </span>
              <span className="text-muted-foreground font-semibold">
                / {intervalText}
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-foreground/5 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">
                    Billed Since
                  </p>
                  <p className="font-bold">
                    {new Intl.DateTimeFormat("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(billingStartDate))}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-foreground/5 shadow-sm">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-wider">
                    Status
                  </p>
                  <div className="flex items-center gap-1.5 font-bold">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        hasPremium ? "bg-green-500" : "bg-blue-500",
                      )}
                    />
                    {subscription?.status.toUpperCase() ||
                      (hasPremium ? "ACTIVE" : "FREE")}
                  </div>
                </div>
              </div>
            </div>

            {!hasPremium && (
              <div className="pt-6 border-t border-foreground/5">
                <Button
                  className="w-full font-black shadow-lg shadow-primary/20"
                  asChild
                >
                  <Link href="/pricing">
                    Upgrade to Premium <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}

            {hasPremium && subscription?.status === "active" && (
              <div className="pt-6 border-t border-foreground/5 flex justify-end">
                <CancelButton />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Billing History Sidebar */}
        <div className="flex flex-col gap-6">
          <Card className="bg-primary/5 border-dashed border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <History className="h-5 w-5" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Invoice</span>
                  <span className="font-bold">
                    {hasPremium ? planPrice : "₹0.00"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {hasPremium ? "Expires On" : "Next Billing Date"}
                  </span>
                  <span className="font-bold">
                    {hasPremium && subscription?.currentPeriodEnd
                      ? new Intl.DateTimeFormat("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(subscription.currentPeriodEnd))
                      : hasPremium
                        ? "Automated"
                        : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30 border-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                Need Help?
              </CardTitle>
              <CardDescription className="text-xs">
                For billing inquiries, please contact{" "}
                <span className="text-primary font-medium">
                  support@thewordof.com
                </span>
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Feature List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Plan Comparison</CardTitle>
          <CardDescription>
            Everything included in your current {planName} plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(isBusiness
              ? [
                  "1-on-1 Onboarding",
                  "Priority Tool Requests",
                  "Highest priority AI generation",
                  "Unlimited processing & ZIPs",
                  "Custom invoice branding",
                  "24/7 Dedicated Support",
                ]
              : isPro
                ? [
                    "Unlimited AI tool usage",
                    "Bulk processing & ZIP downloads",
                    "High-priority AI generation",
                    "Custom invoice branding",
                    "Advanced SEO analysis",
                    "Priority Email support",
                  ]
                : [
                    "Access to all 13 core tools",
                    "Standard processing speeds",
                    "3 AI captions per generation",
                    "3 invoices per month",
                    "Basic tool functionality",
                    "Community support",
                  ]
            ).map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
