# Mobile Navigation Drawer Backdrop Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prevent page background content from bleeding through the mobile navigation drawer.

**Architecture:** Separate the backdrop overlay from the drawer container inside `src/components/layout/mobile-nav.tsx` into siblings within a React Fragment.

**Tech Stack:** React, TailwindCSS.

---

### Task 1: Refactor mobile-nav.tsx

**Files:**
- Modify: `src/components/layout/mobile-nav.tsx`

- [ ] **Step 1: Refactor JSX markup**
  Separate overlay div and drawer div:
  ```tsx
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <div 
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsOpen(false)}
            />
            {/* Menu Drawer */}
            <div className="fixed inset-y-0 right-0 z-50 h-full w-full max-w-xs border-l bg-background p-6 shadow-lg transition-transform duration-300 flex flex-col">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <span className="font-black text-lg tracking-tight">Navigation</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close menu</span>
                </Button>
              </div>

              {/* Header Navigation Links */}
              <div className="flex flex-col gap-3 py-2 border-b">
                <Link href="/tools" className="text-sm font-bold hover:text-primary transition-colors">
                  Tools
                </Link>
                <Link href="/pricing" className="text-sm font-bold hover:text-primary transition-colors">
                  Pricing
                </Link>
                {session && (
                  <Link href="/dashboard" className="text-sm font-bold hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                )}
              </div>

              {/* Sidebar Navigation for Tools */}
              <div className="flex-1 overflow-y-auto -mx-6 px-3">
                <ToolsNav />
              </div>

              {/* User Actions Section */}
              <div className="border-t pt-4 mt-auto flex flex-col gap-2">
                {session ? (
                  <>
                    <Link href="/dashboard/settings" className="w-full">
                      <Button variant="outline" className="w-full font-bold">
                        {session.user?.name || "Account"}
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full font-bold text-red-500 hover:text-red-600 hover:bg-red-500/5"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="w-full">
                      <Button variant="outline" className="w-full font-bold">Login</Button>
                    </Link>
                    <Link href="/register" className="w-full">
                      <Button className="w-full font-black">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </>
        )}
  ```
- [ ] **Step 2: Commit**
  ```bash
  git add src/components/layout/mobile-nav.tsx
  git commit -m "style: split mobile nav backdrop overlay and drawer container into siblings"
  ```

---

### Task 2: Verification

- [ ] **Step 1: Check Typescript compilation**
  Run: `npx tsc --noEmit`
- [ ] **Step 2: Check production Next.js build**
  Run: `npm run build`
