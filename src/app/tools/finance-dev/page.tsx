import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText
} from "lucide-react"

export const metadata = {
  title: "Finance & Developer Utility Tools | TheWordOf Tools",
  description: "Free tools for billing, invoice building, and compiled work report trackers.",
}

const tools = [
  {
    title: "Invoice Generator",
    description: "Generate and download professional, brand-aligned PDF invoices in seconds.",
    href: "/tools/invoice-generator",
    icon: FileText,
    pro: true,
  },
  {
    title: "Work Report Generator",
    description: "Compile daily task trackers, log timesheets, and print A4 work summary sheets.",
    href: "/tools/report",
    icon: FileText,
    pro: false,
  },
]

export default function FinanceDevPage() {
  return (
    <div className="flex flex-col gap-8 pb-16">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Finance & Developer Tools</h1>
        <p className="text-muted-foreground mt-2 text-base">
          Professional productivity templates to streamline business workflows and billing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link key={tool.href} href={tool.href} className="group block h-full">
              <Card className="h-full border border-border/50 bg-card hover:bg-muted/30 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="p-2.5 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    {tool.pro && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        PRO
                      </span>
                    )}
                    <CardTitle className="text-lg font-black group-hover:text-primary transition-colors duration-200 mt-1">
                      {tool.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
