import { WorkReport } from "@/components/tools/work-report";
import { auth } from "@/auth";

export const metadata = {
  title: "Work Report Generator – Document Tools",
  description: "Generate detailed work reports.",
};

export default async function WorkReportPage() {
  const session = await auth();
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN";
  return <WorkReport isPro={isPro} />;
}
