# Left-Sliding Portalized Mobile Navigation Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix layout bleed issues and render the mobile navigation drawer to slide in from the left side of the screen at full height.

**Architecture:** Use React Portals to render the overlay backdrop and menu drawer elements under `document.body` and set positioning classes to the left side.

**Tech Stack:** React, TailwindCSS.

---

### Task 1: Refactor mobile-nav.tsx

**Files:**
- Modify: `src/components/layout/mobile-nav.tsx`

- [ ] **Step 1: Refactor JSX markup and imports**
  Import `createPortal` and update state hooks and rendering:
  ```tsx
  import { useState, useEffect } from "react"
  import { createPortal } from "react-dom"
  import { Menu, X } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { ToolsNav } from "./tools-nav"
  import Link from "next/link"
  import { usePathname } from "next/navigation"
  import { signOut } from "next-auth/react"

  interface MobileNavProps {
    session: any
  }

  export function MobileNav({ session }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
      setMounted(true)
    }, [])

    useEffect(() => {
      setIsOpen(false)
    }, [pathname])

    return (
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsOpen(true)}
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>

        {isOpen && mounted && typeof document !== "undefined" && createPortal(
          <>
            {/* Backdrop Overlay */}
            <div 
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsOpen(false)}
            />
            {/* Menu Drawer - Slides from Left */}
            <div className="fixed inset-y-0 left-0 z-[110] h-full w-full max-w-xs border-r bg-background p-6 shadow-lg transition-transform duration-300 flex flex-col">
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
          </>,
          document.body
        )}
      </div>
    )
  }
  ```
- [ ] **Step 2: Commit**
  ```bash
  git add src/components/layout/mobile-nav.tsx
  git commit -m "style: convert mobile nav drawer to left-sliding portalized layout"
  ```

---

### Task 2: Verification

- [ ] **Step 1: Check Typescript compilation**
  Run: `npx tsc --noEmit`
- [ ] **Step 2: Check production Next.js build**
  Run: `npm run build`
