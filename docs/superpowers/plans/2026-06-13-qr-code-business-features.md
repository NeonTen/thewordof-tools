# QR Code Generator Business Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement UTM Campaign Tagging parameters and CSV/PDF report exporting for the QR Code Generator, restricting both features to the Business Tier, and update the global pricing comparison table.

**Architecture:** 
1. Embed the UTM builder form in the QR settings panel, locking it behind a Business-tier ProGate. The parameters are dynamically appended to the target URL during generation.
2. Embed an "Export Report" dropdown on the analytics dashboard, locked behind a Business-tier ProGate. CSV is generated client-side from the stats scans array; PDF is triggered via `window.print()` styled with print-optimized CSS classes.
3. Update the features array in the pricing cards configuration.

**Tech Stack:** React, Next.js, Lucide-React icons, CSS Media Queries, Tailwind CSS.

---

### Task 1: Update Pricing Comparison Features List
**Files:**
- Modify: `src/components/pricing/pricing-cards.tsx`

- [ ] **Step 1: Add UTM Builder and CSV/PDF Export labels to Free plan features list**
  Add the following objects under the Free plan features array in [pricing-cards.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/pricing/pricing-cards.tsx):
  ```typescript
  { label: "UTM campaign builder for QR codes", included: false },
  { label: "Export QR analytics as CSV/PDF", included: false },
  ```

- [ ] **Step 2: Add UTM Builder and CSV/PDF Export labels to Pro plan features list**
  Add the following objects under the Pro plan features array:
  ```typescript
  { label: "UTM campaign builder for QR codes", included: false },
  { label: "Export QR analytics as CSV/PDF", included: false },
  ```

- [ ] **Step 3: Add UTM Builder and CSV/PDF Export labels to Business plan features list**
  Add the following objects under the Business plan features array:
  ```typescript
  { label: "UTM campaign builder for QR codes", included: true },
  { label: "Export QR analytics as CSV/PDF", included: true },
  ```

- [ ] **Step 4: Commit**
  ```bash
  git add src/components/pricing/pricing-cards.tsx
  git commit -m "feat: add QR UTM and CSV/PDF export features to pricing comparison table"
  ```

---

### Task 2: Implement UTM Tracking Builder UI & Logic
**Files:**
- Modify: `src/components/tools/qr-code.tsx`

- [ ] **Step 1: Declare state variables for UTM fields**
  Inside the `QRCodeGenerator` component in [qr-code.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/qr-code.tsx), declare the following state hooks:
  ```typescript
  const [showUtm, setShowUtm] = useState(false)
  const [utmSource, setUtmSource] = useState("")
  const [utmMedium, setUtmMedium] = useState("")
  const [utmCampaign, setUtmCampaign] = useState("")
  const [utmTerm, setUtmTerm] = useState("")
  const [utmContent, setUtmContent] = useState("")
  ```

- [ ] **Step 2: Implement URL builder function**
  Add a helper function `buildUrlWithUtm` to build the final target URL:
  ```typescript
  const buildUrlWithUtm = (baseUrl: string) => {
    if (!baseUrl) return ""
    try {
      const urlObj = new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`)
      if (showUtm) {
        if (utmSource) urlObj.searchParams.set("utm_source", utmSource)
        if (utmMedium) urlObj.searchParams.set("utm_medium", utmMedium)
        if (utmCampaign) urlObj.searchParams.set("utm_campaign", utmCampaign)
        if (utmTerm) urlObj.searchParams.set("utm_term", utmTerm)
        if (utmContent) urlObj.searchParams.set("utm_content", utmContent)
      }
      return urlObj.toString()
    } catch {
      return baseUrl // fallback for plain text or malformed URLs
    }
  }
  ```

- [ ] **Step 3: Update Generate logic to use UTM-tagged URL**
  Modify `generateQR` around line 254 to pass the UTM-tagged URL to the dynamic redirect backend creation:
  ```typescript
  const targetRedirectUrl = showUtm ? buildUrlWithUtm(text) : text
  const createRes = await fetch("/api/tools/qr-code/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetUrl: targetRedirectUrl, fgColor, bgColor, size, logoUrl }),
  })
  ```

- [ ] **Step 4: Render UTM Campaign Tracking builder UI**
  Insert the UTM campaign tracking builder inside the parameters Card, right under the Target URL input. Ensure it is wrapped in `<ProGate tier="business" feature="UTM Campaign Builder" isPro={isBusiness}>` so it is restricted to Business:
  ```tsx
  <div className="border-t border-border/40 pt-4 space-y-2">
    <ProGate feature="UTM Campaign Tracking" isPro={isBusiness} tier="business">
      <div className="space-y-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox"
            checked={showUtm}
            onChange={(e) => setShowUtm(e.target.checked)}
            className="rounded border-border text-primary focus:ring-primary/20 h-4 w-4"
          />
          <span className="text-sm font-semibold text-muted-foreground">Add UTM Campaign Tracking</span>
        </label>
        
        {showUtm && (
          <div className="grid grid-cols-2 gap-3 pl-6 border-l border-dashed border-border animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Source</label>
              <Input size="sm" value={utmSource} onChange={e => setUtmSource(e.target.value)} placeholder="e.g. qr" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Medium</label>
              <Input size="sm" value={utmMedium} onChange={e => setUtmMedium(e.target.value)} placeholder="e.g. print" />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-xs font-semibold text-muted-foreground">Campaign Name</label>
              <Input size="sm" value={utmCampaign} onChange={e => setUtmCampaign(e.target.value)} placeholder="e.g. spring_sale" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Term</label>
              <Input size="sm" value={utmTerm} onChange={e => setUtmTerm(e.target.value)} placeholder="e.g. book_cover" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Content</label>
              <Input size="sm" value={utmContent} onChange={e => setUtmContent(e.target.value)} placeholder="e.g. logo_link" />
            </div>
          </div>
        )}
      </div>
    </ProGate>
  </div>
  ```

- [ ] **Step 5: Commit**
  ```bash
  git add src/components/tools/qr-code.tsx
  git commit -m "feat: implement UTM campaign parameters builder in QR settings"
  ```

---

### Task 3: Implement Analytics CSV/PDF Export UI & Logic
**Files:**
- Modify: `src/components/tools/qr-code.tsx`

- [ ] **Step 1: Implement CSV download function**
  Add a helper function inside the `QRCodeGenerator` component to convert scan statistics into a CSV file and trigger download:
  ```typescript
  const handleExportCSV = () => {
    if (!stats || !stats.scans) return
    const headers = ["Timestamp", "IP Address", "Unique Scan", "Country", "City", "Browser", "OS"]
    const rows = stats.scans.map(s => [
      new Date(s.createdAt).toISOString(),
      s.ip || "N/A",
      s.isUnique ? "TRUE" : "FALSE",
      s.country || "Unknown",
      s.city || "Unknown",
      s.browser || "Unknown",
      s.os || "Unknown"
    ])
    const csvContent = [headers.join(","), ...rows.map(r => r.map(val => `"${val.replace(/"/g, '""')}"`).join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `qr-scans-${selectedQr?.id || "export"}.csv`)
    link.click()
  }
  ```

- [ ] **Step 2: Implement PDF print trigger**
  Add a handler to open the browser print window:
  ```typescript
  const handlePrintPDF = () => {
    window.print()
  }
  ```

- [ ] **Step 3: Render Export Report button dropdown**
  Render the dropdown button next to the timeframe filter in the dynamic QR scan insights header, wrapped in a ProGate locked to Business tier:
  ```tsx
  <div className="flex gap-2 items-center">
    <ProGate feature="Analytics Export" isPro={isBusiness} tier="business">
      <div className="relative group">
        <Button size="sm" variant="outline" className="text-xs font-bold gap-1 cursor-pointer">
          Export Report ▾
        </Button>
        <div className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded-lg shadow-lg hidden group-hover:block z-50">
          <button 
            type="button" 
            onClick={handleExportCSV}
            className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-muted/50 transition-colors"
          >
            Export as CSV
          </button>
          <button 
            type="button" 
            onClick={handlePrintPDF}
            className="w-full text-left px-3 py-2 text-xs font-semibold hover:bg-muted/50 border-t border-border/40 transition-colors"
          >
            Print PDF Report
          </button>
        </div>
      </div>
    </ProGate>
    {/* Timeframe selector continues here */}
  </div>
  ```

- [ ] **Step 4: Add CSS print utility classes to hide navigation and highlight report**
  Add print-specific CSS styles at the top or globally in `src/app/globals.css` or styled tags to ensure that header, navigation, sidebar lists, and buttons are hidden during printing, leaving only the clean report charts:
  ```css
  @media print {
    header, footer, nav, aside, button, .no-print {
      display: none !important;
    }
    .print-full-width {
      width: 100% !important;
      max-width: 100% !important;
      border: none !important;
      box-shadow: none !important;
    }
  }
  ```
  Add a `<style>` block dynamically at the top of the component or wrap the dashboard in print utilities.

- [ ] **Step 5: Commit**
  ```bash
  git add src/components/tools/qr-code.tsx
  git commit -m "feat: add CSV and PDF analytics reporting tools to QR dashboard"
  ```
