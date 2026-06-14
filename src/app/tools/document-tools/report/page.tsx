import { generateSeoMetadata } from "@/app/lib/seo";
import { WorkReport } from "@/components/tools/work-report";
import { auth } from "@/auth";

export const metadata = generateSeoMetadata({
  title: "Work Report Generator – Document Tools",
  description: "Generate detailed work reports.",
});

export default async function WorkReportPage() {
  const session = await auth();
  const isPro =
    session?.user?.role === "PRO" ||
    session?.user?.role === "BUSINESS" ||
    session?.user?.role === "ADMIN";
  return <WorkReport isPro={isPro} />;
}
