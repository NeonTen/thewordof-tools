"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { History, Wrench, FileText, QrCode, Sparkles, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface ToolUsageItem {
  id: string
  toolKey: string
  date: string
  count: number
  updatedAt: Date | string
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

const TOOL_NAMES: Record<string, { name: string; category: "AI" | "DOC" | "OTHER" }> = {
  "cv-builder": { name: "CV Builder", category: "AI" },
  "ats-score-checker": { name: "ATS Score Checker", category: "AI" },
  "caption-generator": { name: "AI Caption Generator", category: "AI" },
  "prompt-generator": { name: "AI Prompt Generator", category: "AI" },
  "resume-analyzer": { name: "Resume Analyzer", category: "AI" },
  "seo-generator": { name: "SEO Generator", category: "AI" },
  "product-description": { name: "Product Description", category: "AI" },
  "qr-code": { name: "QR Code Generator", category: "OTHER" },
  "invoice-generator": { name: "Invoice Generator", category: "DOC" },
  "doc-converter": { name: "Document Converter", category: "DOC" },
  "pdf-merger": { name: "PDF Merger", category: "DOC" },
  "pdf-watermark": { name: "PDF Watermark", category: "DOC" },
}

export function CreditUsageHistory({ logs, counts }: CreditUsageHistoryProps) {
  const [activeCategory, setActiveCategory] = useState<"ALL" | "AI" | "DOC" | "OTHER">("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const info = TOOL_NAMES[log.toolKey]
      const category = info?.category || "OTHER"
      const displayName = info?.name || log.toolKey.replace(/-/g, " ")

      const matchesCategory = activeCategory === "ALL" || category === activeCategory
      const matchesSearch = displayName.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [logs, activeCategory, searchQuery])

  return (
    <Card className="border-border w-full">
      <CardHeader className="pb-3 space-y-3">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
          <span className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" /> Credit & Tool Activity
          </span>
          <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {filteredLogs.length} {filteredLogs.length === 1 ? "Item" : "Items"}
          </span>
        </CardTitle>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border text-[11px] font-bold">
            {(
              [
                { id: "ALL", label: "All" },
                { id: "AI", label: "AI Tools" },
                { id: "DOC", label: "Docs" },
                { id: "OTHER", label: "Other" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-all",
                  activeCategory === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          {logs.length > 5 && (
            <div className="relative w-full sm:w-auto">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Filter tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 text-xs pl-8 w-full sm:w-36 bg-background"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Badges if saved items exist */}
        {counts && (counts.savedResumes > 0 || counts.savedInvoices > 0 || counts.qrCodes > 0) && (
          <div className="grid grid-cols-3 gap-2 pb-3 border-b text-center">
            <div className="p-2 rounded-xl bg-muted/30 border flex flex-col items-center justify-center">
              <FileText className="h-4 w-4 text-blue-500 mb-1" />
              <span className="text-xs font-bold">{counts.savedResumes}</span>
              <span className="text-[9px] text-muted-foreground font-semibold">CVs Saved</span>
            </div>
            <div className="p-2 rounded-xl bg-muted/30 border flex flex-col items-center justify-center">
              <FileText className="h-4 w-4 text-emerald-500 mb-1" />
              <span className="text-xs font-bold">{counts.savedInvoices}</span>
              <span className="text-[9px] text-muted-foreground font-semibold">Invoices</span>
            </div>
            <div className="p-2 rounded-xl bg-muted/30 border flex flex-col items-center justify-center">
              <QrCode className="h-4 w-4 text-purple-500 mb-1" />
              <span className="text-xs font-bold">{counts.qrCodes}</span>
              <span className="text-[9px] text-muted-foreground font-semibold">QRs Created</span>
            </div>
          </div>
        )}

        {/* Scrollable Usage History List */}
        {filteredLogs.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground space-y-1">
            <Wrench className="h-6 w-6 mx-auto text-muted-foreground/50 mb-2" />
            <p className="font-semibold text-foreground">No matching activity logs</p>
            <p>
              {searchQuery
                ? "Try searching for another tool name."
                : "Start using tools to track activity here."}
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {filteredLogs.map((log) => {
              const info = TOOL_NAMES[log.toolKey]
              const toolName = info?.name || log.toolKey.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
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
    </Card>
  )
}
