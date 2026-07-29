import { DashboardNav } from "./dashboard-nav"
import { Header } from "./header"

export function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="print:hidden">
        <Header />
      </div>
      <div className="flex flex-1 items-start xl:grid xl:grid-cols-[280px_minmax(0,1fr)] px-0">
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r xl:sticky xl:block print:hidden bg-muted/30">
          <DashboardNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-8 px-6 xl:px-10 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
