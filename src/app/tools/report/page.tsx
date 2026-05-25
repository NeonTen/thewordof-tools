import { WorkReport } from "@/components/tools/work-report"
import { auth } from "@/auth"
import { generateSeoMetadata } from "@/app/lib/seo"

export const metadata = generateSeoMetadata({
  title: "Daily Task Tracker & Work Report Generator",
  description: "Create professional e-commerce or office daily work reports, log tasks, track times, and print/export to PDF instantly.",
  keywords: ["task tracker", "daily standup report", "work report generator", "timesheet compiler"],
})

export default async function WorkReportPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8 print:block print:p-0">
      <WorkReport isPro={isPro} />
    </div>
  )
}

