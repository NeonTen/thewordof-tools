# Hero Section Copy Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the hero section badge, heading, and description to match current product capabilities.

**Architecture:** Modify the Home page React component (`src/app/page.tsx`) JSX statically with the approved copy.

**Tech Stack:** React, Next.js, Tailwind CSS

---

### Task 1: Update Hero Section Content

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace the copy**

Replace the lines 27 to 36 in [`src/app/page.tsx`](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/page.tsx) with the new text.

Original:
```tsx
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Sparkles className="h-3 w-3" /> Growing Suite of AI Tools
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              The ultimate <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">AI Productivity Dashboard</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg sm:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              Stop switching tabs. TheWordOf Tools provides an ever-expanding collection of professional, browser-based utilities including AI invoice generators, image converters, SEO tag builders, and viral caption creators.
            </p>
```

Replacement:
```tsx
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <Sparkles className="h-3 w-3" /> The Ultimate AI Productivity Toolkit
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
              All Your Essential <br />
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Tools in One Dashboard</span>
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground text-lg sm:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
              AI-powered productivity tools for creators, developers, and businesses. Generate invoices, convert images, build SEO tags, create QR codes, write content, and manage everyday tasks from one powerful workspace.
            </p>
```

- [ ] **Step 2: Commit changes**

Run:
```bash
git add src/app/page.tsx
git commit -m "feat(hero): update copy to match current tools and capabilities"
```
