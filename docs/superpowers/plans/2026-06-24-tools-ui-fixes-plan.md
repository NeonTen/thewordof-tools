# Tools UI Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the tools sidebar initial load state and extend the AI CV Builder import feature to all Pro users.

**Architecture:** Modifying React state defaults for the sidebar and updating a `ProGate` property check for the CV Builder.

**Tech Stack:** React, Next.js

---

### Task 1: Update Sidebar Default State

**Files:**
- Modify: `src/components/layout/tools-nav.tsx`

- [ ] **Step 1: Update `openGroups` initial state**

```tsx
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    "All Tools": true,
    "Image & Code": false,
    "Calculators": false,
    "Document Tools": false,
    "Design": false,
    "Technical SEO": false,
    "AI Tools": false,
  })
```

- [ ] **Step 2: Commit**

```bash
git add src/components/layout/tools-nav.tsx
git commit -m "fix(ui): close unnecessary sidebar categories by default"
```

### Task 2: Extend AI CV Builder to Pro

**Files:**
- Modify: `src/components/tools/cv-builder.tsx`

- [ ] **Step 1: Update `ProGate` wrapper**

Change from `isPro={isBusiness} tier="business"` to `isPro={isPro}`:

```tsx
              <ProGate feature="AI Resume Parser" isPro={isPro}>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowAIParserModal(true)} 
                  className="font-bold border-purple-500/20 hover:bg-purple-500/5 text-purple-600 dark:text-purple-400 gap-1.5"
                >
                  <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                  ✨ Import with AI
                </Button>
              </ProGate>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/tools/cv-builder.tsx
git commit -m "feat(cv-builder): extend AI import feature to all Pro tiers"
```
