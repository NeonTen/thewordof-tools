"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Settings, CreditCard, Wrench } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Dashboard",  href: "/dashboard",          icon: LayoutDashboard },
  { title: "All Tools",  href: "/tools",              icon: Wrench },
  { title: "Billing",    href: "/dashboard/billing",  icon: CreditCard },
  { title: "Settings",   href: "/dashboard/settings", icon: Settings },
]

export function DashboardNav() {
  const path = usePathname()

  return (
    <nav className="flex flex-col gap-1 py-6 px-4">
      <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">
        Account
      </p>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = path === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className={cn("mr-3 h-4 w-4", isActive ? "text-primary" : "group-hover:text-foreground")} />
            <span>{item.title}</span>
          </Link>
        )
      })}
    </nav>
  )
}
