import { generateSeoMetadata } from "@/app/lib/seo";
import { auth } from "@/auth";
import {
  Sparkles,
  LifeBuoy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlanSection } from "@/components/dashboard/plan-section";
import { SupportModal } from "@/components/dashboard/support-modal";
import { prisma } from "@/lib/prisma";
import { getCurrentCreditAllocation } from "@/lib/credits";
import { CreditOverview } from "@/components/dashboard/credit-overview";
import { CreditUsageHistory } from "@/components/dashboard/credit-usage-history";

export const dynamic = "force-dynamic";

export const metadata = generateSeoMetadata({
  title: "My Account — TheWordOf Tools",
  description: "Manage your account, billing, and settings.",
});

export default async function DashboardPage() {
  const session = await auth();
  const userRole = session?.user?.role || "FREE";
  const isPro =
    userRole === "PRO" || userRole === "BUSINESS" || userRole === "ADMIN";

  const dbUser = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
          creditsRemaining: true,
          creditsResetAt: true,
          role: true,
          _count: {
            select: {
              savedResumes: true,
              savedInvoices: true,
              qrCodes: true,
            },
          },
        },
      })
    : null;

  const usageLogs = session?.user?.id
    ? await prisma.toolUsage.findMany({
        where: { identifier: session.user.id },
        orderBy: { updatedAt: "desc" },
        take: 30,
      })
    : [];

  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          {session?.user?.name
            ? `${session.user.name}'s Account`
            : "My Account"}
        </h1>
        <p className="text-muted-foreground mt-2 text-base">
          Manage your subscription plan, credit usage, and account settings.
        </p>
      </div>

      {/* 2-Column Vertical Layout with Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start w-full">
        {/* Left Column Stack */}
        <div className="flex flex-col gap-6 w-full items-start">
          {/* Card 1: Current Plan Section */}
          <Card
            className={cn(
              "w-full bg-gradient-to-br border-primary/10 from-primary/10 via-primary/5 to-background shadow-sm h-auto",
            )}
          >
            <PlanSection />
          </Card>

          {/* Card 2: AI Usage Credits Overview */}
          {dbUser ? (
            <div className="w-full h-auto">
              <CreditOverview
                creditsRemaining={dbUser.creditsRemaining}
                creditsMax={getCurrentCreditAllocation(dbUser.role)}
                resetDate={dbUser.creditsResetAt}
                isFree={
                  dbUser.role !== "PRO" &&
                  dbUser.role !== "BUSINESS" &&
                  dbUser.role !== "ADMIN"
                }
              />
            </div>
          ) : (
            <Card className="w-full p-6 border-border flex items-center justify-center text-sm text-muted-foreground">
              Sign in to view your credit balance.
            </Card>
          )}

          {/* Card 3: Tool & Feature Requests */}
          <Card className="w-full border-border h-auto">
            <CardContent className="p-6 flex flex-col justify-between gap-6">
              <div>
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-5 w-5 text-amber-500" />
                </div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  Tool & Feature Requests
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Need a specific custom tool built for your workflow? Submit a
                  direct request to our engineers.
                </p>
              </div>
              <SupportModal type="TOOL_REQUEST">
                <Button variant="outline" className="font-bold w-full">
                  Submit Tool Request
                </Button>
              </SupportModal>
            </CardContent>
          </Card>

          {/* Card 4: Priority Email Support (Moved directly after Tool & Feature Requests) */}
          <Card className="w-full border-border h-auto">
            <CardContent className="p-6 flex flex-col justify-between gap-6">
              <div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <LifeBuoy className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground">
                  Priority Email Support
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isPro
                    ? "Get priority email support directly from our core engineering team."
                    : "Need help or have questions? Contact support to resolve issues quickly."}
                </p>
              </div>
              <SupportModal type="SUPPORT">
                <Button className="font-bold w-full">
                  Contact Support
                </Button>
              </SupportModal>
            </CardContent>
          </Card>
        </div>

        {/* Right Column Stack */}
        <div className="flex flex-col gap-6 w-full items-start">
          {/* Card 1: Credit & Tool Activity History */}
          <CreditUsageHistory
            logs={usageLogs}
            counts={
              dbUser
                ? {
                    savedResumes: dbUser._count.savedResumes,
                    savedInvoices: dbUser._count.savedInvoices,
                    qrCodes: dbUser._count.qrCodes,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  );
}
