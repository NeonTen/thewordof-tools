import { ToolHeader } from "@/components/tools/tool-header"
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
    <div className="flex flex-col gap-6 print:block print:p-0">
      <div className="print:hidden">
        <ToolHeader category="Finance & Dev" categoryHref="/tools/finance-dev" title="Work Report Generator" />
        <p className="text-muted-foreground -mt-4 text-base mb-6">
          Build custom daily task sheets, calculate total hours worked, and print to PDF.
        </p>
      </div>
      <WorkReport isPro={isPro} />
    </div>
  )
}

