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
      <div className="print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">Work Report Generator</h1>
        <p className="text-muted-foreground mt-2">
          Build custom daily task sheets, calculate total hours worked, and print to PDF.
        </p>
      </div>

      <WorkReport isPro={isPro} />
    </div>
  )
}
