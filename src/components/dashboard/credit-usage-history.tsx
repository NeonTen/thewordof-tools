import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History, Wrench, FileText, QrCode, Sparkles } from "lucide-react"

interface ToolUsageItem {
  id: string
  toolKey: string
  date: string
  count: number
  updatedAt: Date
}

interface SavedCounts {
  savedResumes: number
  savedInvoices: number
  qrCodes: number
}

interface CreditUsageHistoryProps {
  logs: ToolUsageItem[]
  counts?: SavedCounts
}

const TOOL_NAMES: Record<string, string> = {
  "cv-builder": "CV Builder",
  "ats-score-checker": "ATS Score Checker",
  "caption-generator": "AI Caption Generator",
  "prompt-generator": "AI Prompt Generator",
  "resume-analyzer": "Resume Analyzer",
  "seo-generator": "SEO Generator",
  "product-description": "Product Description Generator",
  "qr-code": "QR Code Generator",
  "invoice-generator": "Invoice Generator",
  "doc-converter": "Document Converter",
}

export function CreditUsageHistory({ logs, counts }: CreditUsageHistoryProps) {
  return (
    <Card className="h-full border-border flex flex-col justify-between">
      <div>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            <span className="flex items-center gap-2">
              <History className="h-4 w-4 text-primary" /> Credit & Tool Activity
            </span>
            <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              Recent Log
            </span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Summary Badges if saved items exist */}
          {counts && (counts.savedResumes > 0 || counts.savedInvoices > 0 || counts.qrCodes > 0) && (
            <div className="grid grid-cols-3 gap-2 pb-3 border-b text-center">
              <div className="p-2 rounded-xl bg-muted/40 flex flex-col items-center justify-center">
                <FileText className="h-4 w-4 text-blue-500 mb-1" />
                <span className="text-xs font-bold">{counts.savedResumes}</span>
                <span className="text-[9px] text-muted-foreground font-medium">CVs Saved</span>
              </div>
              <div className="p-2 rounded-xl bg-muted/40 flex flex-col items-center justify-center">
                <FileText className="h-4 w-4 text-emerald-500 mb-1" />
                <span className="text-xs font-bold">{counts.savedInvoices}</span>
                <span className="text-[9px] text-muted-foreground font-medium">Invoices</span>
              </div>
              <div className="p-2 rounded-xl bg-muted/40 flex flex-col items-center justify-center">
                <QrCode className="h-4 w-4 text-purple-500 mb-1" />
                <span className="text-xs font-bold">{counts.qrCodes}</span>
                <span className="text-[9px] text-muted-foreground font-medium">QRs Created</span>
              </div>
            </div>
          )}

          {/* Usage History List */}
          {logs.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted-foreground space-y-1">
              <Wrench className="h-6 w-6 mx-auto text-muted-foreground/50 mb-2" />
              <p className="font-semibold text-foreground">No recent tool activity</p>
              <p>Start using AI and document tools to track usage here.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {logs.map((log) => {
                const toolName = TOOL_NAMES[log.toolKey] || log.toolKey.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                const formattedDate = new Date(log.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })

                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Sparkles className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate text-foreground">{toolName}</p>
                        <p className="text-[10px] text-muted-foreground">{formattedDate}</p>
                      </div>
                    </div>
                    <span className="font-black text-xs bg-background border px-2 py-0.5 rounded-md shrink-0">
                      {log.count} {log.count === 1 ? "use" : "uses"}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  )
}
