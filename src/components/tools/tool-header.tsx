import Link from "next/link"
import { ChevronRight, ArrowLeft } from "lucide-react"

interface ToolHeaderProps {
  category: string
  categoryHref: string
  title: string
}

export function ToolHeader({ category, categoryHref, title }: ToolHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
        <Link href="/tools" className="hover:text-foreground transition-colors">Tools</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={categoryHref} className="hover:text-foreground transition-colors">{category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{title}</span>
      </div>
      
      {/* Back Button & Title */}
      <div className="flex items-center gap-3">
        <Link 
          href={categoryHref} 
          className="h-9 w-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        </div>
      </div>
    </div>
  )
}
