# Crown Icon, Premium Locks, and Sidebar Badge Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean navigation sidebar by removing tool badges, highlighting pro/limited tools on the main dashboard cards, and transitioning premium locks and badges to a unified gold/purple Crown icon theme.

**Architecture:** Modify React navigation components, page configs, unified gate wrappers (`ProGate`/`ProBadge`), and lock overlays to utilize lucide-react's `Crown` icon and corresponding theme colors.

**Tech Stack:** React, Next.js, TailwindCSS, Lucide Icons.

---

### Task 1: Navigation Sidebar Update

**Files:**
- Modify: `src/components/layout/tools-nav.tsx`

- [ ] **Step 1: Remove ProBadge from sidebar items**
  Update the component rendering to omit the badge:
  ```tsx
  // Remove or comment out:
  // {item.pro && <ProBadge role={session?.user?.role} />}
  ```
- [ ] **Step 2: Commit**
  ```bash
  git add src/components/layout/tools-nav.tsx
  git commit -m "style: remove ProBadge from sidebar items"
  ```

---

### Task 2: All Tools Dashboard Update

**Files:**
- Modify: `src/app/tools/page.tsx`

- [ ] **Step 1: Mark additional limited tools as Pro**
  Add `pro: true` properties to QR Code Generator, Invoice Generator, and SVG Compressor tools.
- [ ] **Step 2: Commit**
  ```bash
  git add src/app/tools/page.tsx
  git commit -m "style: flag additional limited tools as pro on dashboard"
  ```

---

### Task 3: Unified Locks & Badges Update

**Files:**
- Modify: `src/components/ui/pro-gate.tsx`

- [ ] **Step 1: Refactor ProBadge and ProGate**
  Import `Crown` from `lucide-react`. Change `ProBadge` to use `Crown`.
  Update `ProGate` wrapper to render a `Crown` indicator styled gold/amber for Pro or purple/indigo for Business.
  Update the gate dialog's header icon graphic to display an animated `Crown` with matching colors.
- [ ] **Step 2: Commit**
  ```bash
  git add src/components/ui/pro-gate.tsx
  git commit -m "style: update pro-gate and pro-badge to Crown theme"
  ```

---

### Task 4: QR Code Lock Screen Overlay Update

**Files:**
- Modify: `src/components/tools/qr-code.tsx`

- [ ] **Step 1: Refactor analytics locked screen**
  Import `Crown`.
  Replace `<Layers>` with `<Crown className="h-6 w-6" />`.
  Update container classes to `bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20`.
  Update button classes to `bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20`.
- [ ] **Step 2: Commit**
  ```bash
  git add src/components/tools/qr-code.tsx
  git commit -m "style: update QR Code locked analytics overlay to Crown theme"
  ```

---

### Task 5: Compilation and Verification

- [ ] **Step 1: Check Typescript compilation**
  Run: `npx tsc --noEmit`
  Expected: Success without errors.
- [ ] **Step 2: Confirm Production Build**
  Run: `npm run build`
  Expected: Success without errors.
