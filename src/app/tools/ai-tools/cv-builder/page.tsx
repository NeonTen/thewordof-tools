import { generateSeoMetadata } from "@/app/lib/seo";
import { ToolHeader } from "@/components/tools/tool-header";
import { CvBuilder } from "@/components/tools/cv-builder";
import { auth } from "@/auth";

export const metadata = generateSeoMetadata({
  title: "AI CV Builder",
  description: "Create a professional, ATS-optimized CV with AI.",
});

export default async function CvBuilderPage() {
  const session = await auth();
  const role = session?.user?.role;
  const isPro = role === "PRO" || role === "BUSINESS" || role === "ADMIN";
  const isBusiness = role === "BUSINESS" || role === "ADMIN";

  return (
    <div className="flex flex-col gap-6">
      <ToolHeader
        category="AI Tools"
        categoryHref="/tools/ai-tools"
        title="AI CV Builder"
      />
      <CvBuilder isPro={isPro} isBusiness={isBusiness} />
    </div>
  );
}
