import { ToolsNav } from "@/components/layout/tools-nav"
import { Header } from "@/components/layout/header"
import { PageTransition } from "@/components/layout/page-transition"

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="print:hidden">
        <Header />
      </div>
      <div className="flex flex-1 items-start md:grid md:grid-cols-[240px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block bg-muted/30 print:hidden">
          <ToolsNav />
        </aside>
        <main className="flex w-full flex-col overflow-hidden py-8 px-6 md:px-8 lg:px-10 bg-background print:p-0">
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  )
}
