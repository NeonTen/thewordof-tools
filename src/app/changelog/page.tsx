import fs from "fs"
import path from "path"
import { marked } from "marked"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Terminal } from "lucide-react"

export const metadata = {
  title: "Changelog & Product Updates | TheWordOf Tools",
  description: "Stay up-to-date with our latest tools, feature additions, fixes, and optimizations.",
}

// Parse root CHANGELOG.md file
async function getChangelogHtml(): Promise<string> {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md")
  try {
    const content = fs.readFileSync(changelogPath, "utf8")
    return marked.parse(content) as string
  } catch (e) {
    console.error("Failed to read root CHANGELOG.md file:", e)
    return "<p>Changelog data is temporarily unavailable.</p>"
  }
}

export default async function ChangelogPage() {
  const rawHtml = await getChangelogHtml()

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />
      
      <main className="flex-1 max-w-[1440px] mx-auto px-6 py-20 w-full">
        <div className="max-w-3xl mx-auto space-y-12">
          
          {/* Page Header */}
          <div className="space-y-4 text-center">
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
              <Terminal className="h-3 w-3" /> Release Logs
            </span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">Product Changelog</h1>
            <p className="text-muted-foreground text-base sm:text-lg">
              Follow our journey as we build, refine, and release new productivity tools.
            </p>
          </div>

          {/* Render parsed HTML */}
          <div 
            className="prose dark:prose-invert max-w-none pt-8 border-t border-border/60 
              prose-h2:text-2xl prose-h2:font-black prose-h2:tracking-tight prose-h2:mt-12 prose-h2:mb-4 prose-h2:flex prose-h2:items-center prose-h2:gap-2
              prose-h3:text-sm prose-h3:font-black prose-h3:uppercase prose-h3:tracking-wider prose-h3:text-primary/90 prose-h3:mt-6
              prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
              prose-li:text-sm prose-li:text-muted-foreground prose-li:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: rawHtml }}
          />

        </div>
      </main>

      <Footer />
    </div>
  )
}
