import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { BrokenLinksAuditor } from "@/components/tools/broken-links";
import { auth } from "@/auth";

export const metadata = generateSeoMetadata({
  title: "Broken Link & Anchor Text Auditor | TheWordOf Tools",
  description:
    "Audit webpage outbound links, detect broken URLs, identify redirects, and optimize anchor texts.",
});

export default async function BrokenLinksPage() {
  const session = await auth();
  const isPro =
    session?.user?.role === "PRO" ||
    session?.user?.role === "BUSINESS" ||
    session?.user?.role === "ADMIN";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <ToolHeader
          category="Technical SEO"
          categoryHref="/tools/technical-seo"
          title="Broken Links"
        />
        <p className="text-muted-foreground mt-2">
          Scan target pages for dead links (404s), redirect chains, and verify
          descriptive anchor texts.
        </p>
      </div>

      <BrokenLinksAuditor isPro={isPro} />
    </div>
  );
}
