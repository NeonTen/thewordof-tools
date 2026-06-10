# Broken Links Social Fallbacks and Scanning Notice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent false broken reports on social media links (e.g. Facebook returning 400), and display a friendly slow scanning notice after 8 seconds of continuous page scanning.

**Architecture:**
1. In the backend fetch auditor mapping step, check if the link hostname matches major social media sites. Override bot-blocked statuses (400, 403, 503, 999) to 200.
2. In the React scanner form component, initialize a 8000ms timeout timer in `handleScan` to show a warning alert, and cancel it on complete.

**Tech Stack:** React, Next.js API Routes, TypeScript.

---

### Task 1: Update API Scanner for Social Domains

**Files:**
- Modify: `src/app/api/tools/scan-links/route.ts`

- [ ] **Step 1: Implement social domain checks in link status validation mapping**
Find the status check inside the parallel batches map block, and add hostname checking + status override logic.

```typescript
          if (status < 200 || status >= 400) {
            try {
              const getResponse = await fetch(link.href, {
                method: "GET",
                headers: { "User-Agent": userAgent },
                signal: AbortSignal.timeout(4000)
              })
              status = getResponse.status
            } catch {
              status = 0 // network/connection issue
            }
          }

          // Special handling for major social media domains that aggressively block bots with 400/403/999/503
          const socialDomains = ["facebook.com", "instagram.com", "linkedin.com", "twitter.com", "x.com", "youtube.com"]
          try {
            const domain = new URL(link.href).hostname.toLowerCase()
            const isSocial = socialDomains.some(d => domain === d || domain.endsWith("." + d))
            if (isSocial && (status === 400 || status === 403 || status === 999 || status === 503)) {
              status = 200 // Treat as active/OK to avoid false broken status
            }
          } catch {
            // ignore
          }

          return { ...link, status }
```

- [ ] **Step 2: Commit changes**
Stage and commit changes to `src/app/api/tools/scan-links/route.ts`.

---

### Task 2: Implement 8s Delay Alert in UI

**Files:**
- Modify: `src/components/tools/broken-links.tsx`

- [ ] **Step 1: Add showSlowScanNotice state variable**
```typescript
  const [scanning, setScanning] = useState(false)
  const [scanError, setScanError] = useState("")
  const [showSlowScanNotice, setShowSlowScanNotice] = useState(false)
```

- [ ] **Step 2: Update handleScan to handle timeout timer**
Add the `setTimeout` code inside `handleScan`.

```typescript
  // Scan Action
  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    if (limitReached) {
      setScanError("Free plan limit reached (3 page audits/month). Upgrade to Pro to bypass.")
      return
    }

    setScanning(true)
    setScanError("")
    setShowSlowScanNotice(false)

    // Set a timer to show slow scan notice after 8 seconds
    const timer = setTimeout(() => {
      setShowSlowScanNotice(true)
    }, 8000)

    try {
      const res = await fetch("/api/tools/scan-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (data.error) {
        setScanError(data.error)
      } else {
        setLinks(data.links)
        await incrementUsage()
      }
    } catch {
      setScanError("Connection timed out or failed to parse target URL links.")
    } finally {
      clearTimeout(timer)
      setShowSlowScanNotice(false)
      setScanning(false)
    }
  }
```

- [ ] **Step 3: Render status message below form**
In the JSX code, right below the `<form>` inside the `ProGate` container, render the delay message:

```typescript
          <ProGate feature="Broken Link Checker" isPro={isFeatureUnlocked}>
            <form onSubmit={handleScan} className="flex gap-2 max-w-2xl">
              <input 
                type="text" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. tools.thewordof.com"
                className="flex-1 px-3 py-2 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                disabled={limitReached}
              />
              <button 
                type="submit" 
                disabled={scanning || limitReached}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                {scanning ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                {scanning ? "Scanning..." : "Scan Links"}
              </button>
            </form>

            {scanning && showSlowScanNotice && (
              <p className="text-xs text-amber-500 font-semibold animate-pulse mt-2.5 flex items-center gap-1.5">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Analyzing link inventory... Since this page has a large number of links, it may take a minute or two.
              </p>
            )}
          </ProGate>
```

- [ ] **Step 4: Commit changes**
Stage and commit changes to `src/components/tools/broken-links.tsx`.

---

### Task 3: Verifications

- [ ] **Step 1: Check typescript compile output**
Run: `npx tsc --noEmit`
Expected: Succeeds with no errors.
