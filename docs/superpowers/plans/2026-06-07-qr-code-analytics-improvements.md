# QR Code Analytics Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix Scan Timeline decimal Y-axis ticks, add tabs to toggle between Browsers and OS charts in the dashboard, and parse User-Agents to track specific mobile and desktop device models.

**Architecture:** Add specific device classification regexes to the redirect router so they are saved to the `device` field. Add a local toggle state in `qr-code.tsx` to switch between Browsers and OS bar charts, and set Recharts `allowDecimals={false}` to force integer Y-axis ticks.

**Tech Stack:** Next.js, Prisma, Recharts, TypeScript, Tailwind CSS

---

### Task 1: Enhance User-Agent parsing for specific devices

**Files:**
- Modify: `src/app/q/[id]/route.ts`

- [ ] **Step 1: Update User-Agent detection**
Modify lines 28-34 in [route.ts](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/q/[id]/route.ts) to parse:
```typescript
    const uaString = request.headers.get("user-agent") || ""
    let device = "Other Desktop"
    const isMobile = /mobile|iphone|ipod|android|blackberry|opera mini|iemobile|webos/i.test(uaString)
    const isTablet = /tablet|ipad|playbook|silk/i.test(uaString)

    if (isTablet) {
      if (/ipad/i.test(uaString)) {
        device = "iPad"
      } else if (/android/i.test(uaString)) {
        device = "Android Tablet"
      } else {
        device = "Other Tablet"
      }
    } else if (isMobile) {
      if (/iphone|ipod/i.test(uaString)) {
        device = "iPhone"
      } else if (/android/i.test(uaString)) {
        device = "Android Phone"
      } else {
        device = "Other Mobile"
      }
    } else {
      if (/macintosh|mac os x/i.test(uaString)) {
        device = "Mac"
      } else if (/windows/i.test(uaString)) {
        device = "Windows PC"
      } else if (/linux/i.test(uaString)) {
        device = "Linux PC"
      } else {
        device = "Other Desktop"
      }
    }
```

- [ ] **Step 2: Commit**
```bash
git add src/app/q/\[id\]/route.ts
git commit -m "feat: parse and store specific device types from user-agent"
```

---

### Task 2: Implement Browsers & OS tabbed UI and allowDecimals={false}

**Files:**
- Modify: `src/components/tools/qr-code.tsx`

- [ ] **Step 1: Add state for Browsers vs OS tab toggle**
Add a `browserOsTab` state inside the `QRCodeGenerator` component in [qr-code.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/qr-code.tsx):
```typescript
  const [browserOsTab, setBrowserOsTab] = useState<"browsers" | "os">("browsers")
```

- [ ] **Step 2: Render Tabs and Conditional Chart in the UI**
Modify the "Browser Stats" card section (around line 766) to render a header with tabs, and conditionally render the correct chart based on `browserOsTab`:
```tsx
                    {/* Browser & OS Stats Card */}
                    <Card className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Browsers & OS</p>
                        <div className="flex bg-muted p-0.5 rounded-lg gap-0.5 text-[10px] font-semibold">
                          {(["browsers", "os"] as const).map(tab => (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setBrowserOsTab(tab)}
                              className={`px-2 py-0.5 rounded transition-all ${
                                browserOsTab === tab ? "bg-background text-foreground shadow-sm font-bold" : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {tab === "browsers" ? "Browsers" : "OS"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="h-44">
                        {getBarData(browserOsTab).length === 0 ? (
                          <div className="h-full flex items-center justify-center text-xs text-muted-foreground">No data</div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={getBarData(browserOsTab)} layout="vertical">
                              <XAxis type="number" stroke="#888888" fontSize={9} />
                              <YAxis dataKey="name" type="category" stroke="#888888" fontSize={9} width={60} />
                              <Tooltip />
                              <Bar dataKey="count" fill={browserOsTab === "browsers" ? "#8884d8" : "#82ca9d"} radius={[0, 4, 4, 0]} />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </Card>
```

- [ ] **Step 3: Add allowDecimals={false} to Scan Timeline YAxis**
Modify the `<YAxis>` component in the Scan Timeline (around line 713) to include `allowDecimals={false}`:
```tsx
                          <YAxis stroke="#888888" fontSize={10} tickLine={false} allowDecimals={false} />
```

- [ ] **Step 4: Commit**
```bash
git add src/components/tools/qr-code.tsx
git commit -m "feat: implement browsers & OS tabs toggle and disable timeline Y-axis decimals"
```

---

### Task 3: Build Verification

**Files:**
- Test: none (compile and run check)

- [ ] **Step 1: Run production build verification**
Run: `npm run build`
Expected: Successful build with zero compilation errors.

- [ ] **Step 2: Commit any final cleanup**
```bash
git commit --allow-empty -m "chore: verify build success"
```
