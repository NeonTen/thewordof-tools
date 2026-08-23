import { generateSeoMetadata } from "@/app/lib/seo";
import Link from "next/link";
import { auth } from "@/auth";
import { ToolsList } from "@/components/tools/tools-list";

export const metadata = generateSeoMetadata({
  title: "Free Online AI Tools & Growing — TheWordOf Utility Dashboard",
  description:
    "Access a suite of free, browser-based tools for image conversion, SVG optimization, AI SEO generation, professional invoices, and financial calculators. No sign-up required.",
  canonical: "/tools",
});

export default async function ToolsPage() {
  const session = await auth();
  const isPro =
    session?.user?.role === "PRO" ||
    session?.user?.role === "BUSINESS" ||
    session?.user?.role === "ADMIN";

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight">All Tools</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Free, browser-based tools. AI tools require a free account.{" "}
          {!isPro && (
            <Link
              href="/pricing"
              className="text-primary font-semibold hover:underline"
            >
              Upgrade for more →
            </Link>
          )}
        </p>
      </div>

      <ToolsList isPro={isPro} userRole={session?.user?.role} />
    </div>
  );
}
