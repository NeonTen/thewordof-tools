import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ShieldAlert } from "lucide-react"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-6 flex h-14 items-center gap-4">
          <div className="flex items-center gap-2 font-black text-primary">
            <ShieldAlert className="h-5 w-5" />
            <span>SUPER ADMIN</span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium ml-6">
            <a href="/admin/users" className="transition-colors hover:text-foreground/80 text-foreground">Users</a>
            <a href="/admin/analytics" className="transition-colors hover:text-foreground/80 text-muted-foreground">Analytics</a>
            <a href="/admin/settings" className="transition-colors hover:text-foreground/80 text-muted-foreground">Global Settings</a>
          </nav>
        </div>
      </header>
      <main className="flex-1 container px-6 py-10">
        {children}
      </main>
    </div>
  )
}
