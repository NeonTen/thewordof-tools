import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { auth } from "@/auth"
import { ProBadge } from "@/components/ui/pro-gate"
import { LogoutButton } from "@/components/auth/logout-button"
import { MobileNav } from "@/components/layout/mobile-nav"

export async function Header() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "BUSINESS" || session?.user?.role === "ADMIN"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="font-black text-xl tracking-tight shrink-0">
            TheWordOf<span className="text-primary">Tools</span>
          </div>
          {isPro && <ProBadge className="ml-2" role={session?.user?.role} />}
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium print:hidden">
          <Link
            href="/tools"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Tools
          </Link>
          <Link
            href="/pricing"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Pricing
          </Link>
          {session && (
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-2">
            {session ? (
              <div className="hidden md:flex items-center space-x-2 print:hidden">
                <Link href="/dashboard/settings">
                  <Button variant="ghost" className="h-9 px-4 font-bold text-muted-foreground hover:text-foreground">
                    {session.user?.name || "Account"}
                  </Button>
                </Link>
                <LogoutButton />
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2 print:hidden">
                <Link href="/login" className="hidden sm:block">
                  <Button variant="ghost" className="h-9 px-4 font-bold text-muted-foreground hover:text-foreground">Login</Button>
                </Link>
                <Link href="/register">
                  <Button className="h-9 px-8 font-black">Get Started</Button>
                </Link>
              </div>
            )}
            <div className="print:hidden flex items-center space-x-2">
              <ThemeToggle />
              <MobileNav session={session} />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
