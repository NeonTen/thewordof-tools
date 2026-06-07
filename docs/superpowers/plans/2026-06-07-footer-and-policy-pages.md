# Footer & Policies Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new Refund Policy static page, register it in the sitemap, and update the footer layout to display all policies clearly.

**Architecture:** Create `/refund` page under `src/app/refund/page.tsx` utilizing standard header and footer wrapper. Add `/refund` to `src/app/sitemap.ts`, and update link titles/order in `src/components/layout/footer.tsx`.

**Tech Stack:** Next.js, React, Tailwind CSS

---

### Task 1: Create the Refund Policy Page

**Files:**
- Create: `src/app/refund/page.tsx`

- [ ] **Step 1: Create the Refund Policy Page**
Create [page.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/refund/page.tsx) with the approved refund policy content and layout:
```tsx
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export const metadata = {
  title: "Refund Policy — TheWordOf Tools",
  description: "Learn about subscription refunds and our 7-day money-back guarantee.",
}

export default function RefundPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-20 max-w-4xl">
        <h1 className="text-4xl font-black tracking-tight mb-10 text-center">Refund Policy</h1>
        
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. 7-Day Money-Back Guarantee</h2>
            <p className="text-muted-foreground leading-relaxed">
              We want you to be fully satisfied with our services. If you are not satisfied with your Pro or Business subscription, you are eligible for a full refund within 7 days of your original purchase date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Eligibility Criteria</h2>
            <p className="text-muted-foreground leading-relaxed">
              To request a refund, please contact support. Refunds are generally granted to first-time subscribers who have not excessively consumed resources (such as bulk AI usage or dynamic QR redirect scans) during the 7-day period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Processing Time</h2>
            <p className="text-muted-foreground leading-relaxed">
              Once approved, refunds are processed back to your original payment method within 5 to 7 business days depending on your bank or payment provider.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any refund requests, billing inquiries, or subscription issues, please contact our support team via our support portal.
            </p>
          </section>

          <section className="pt-10 border-t">
            <p className="text-sm text-muted-foreground italic text-center">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add src/app/refund/page.tsx
git commit -m "feat: create refund policy page"
```

---

### Task 2: Update Footer Links and Sitemap

**Files:**
- Modify: `src/components/layout/footer.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Update Footer link titles and add Refund Policy**
Modify lines 12-15 in [footer.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/layout/footer.tsx) to render three clear links:
```tsx
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:underline underline-offset-4">Terms & Conditions</Link>
          <Link href="/privacy" className="hover:underline underline-offset-4">Privacy Policy</Link>
          <Link href="/refund" className="hover:underline underline-offset-4">Refund Policy</Link>
        </div>
```

- [ ] **Step 2: Add refund path to sitemap.ts**
Modify lines 32-34 in [sitemap.ts](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/sitemap.ts) to include the refund page:
```typescript
    '/privacy',
    '/terms',
    '/refund',
```

- [ ] **Step 3: Commit**
```bash
git add src/components/layout/footer.tsx src/app/sitemap.ts
git commit -m "feat: update footer layout and add refund page to sitemap"
```

---

### Task 3: Build Verification

**Files:**
- Test: none (run check)

- [ ] **Step 1: Run production build verification**
Run: `npm run build`
Expected: Successful build with zero compilation errors.

- [ ] **Step 2: Commit final verification**
```bash
git commit --allow-empty -m "chore: verify sitemap and footer compilation"
```
