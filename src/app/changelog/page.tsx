import fs from "fs"
import path from "path"
import { marked } from "marked"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Calendar, Terminal, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, Layers } from "lucide-react"

export const metadata = {
  title: "Changelog & Product Updates | TheWordOf Tools",
  description: "Stay up-to-date with our latest tools, feature additions, fixes, and optimizations.",
}

interface Section {
  title: string
  html: string
}

interface Release {
  version: string
  date: string
  sections: Section[]
}

// Custom parser to split changelog into structured blocks
function parseChangelog(content: string): Release[] {
  const blocks = content.split(/(?=^##\s+\[)/m)
  const releases: Release[] = []

  for (const block of blocks) {
    const lines = block.trim().split("\n")
    if (lines.length === 0 || !lines[0].startsWith("##")) continue

    const header = lines[0]
    const match = header.match(/^##\s+\[(.*?)\]\s*-\s*(.*?)$/)
    if (!match) continue

    const version = match[1]
    const date = match[2]
    
    const body = lines.slice(1).join("\n")
    const sectionBlocks = body.split(/(?=^###\s+)/m)
    const sections: Section[] = []

    for (const secBlock of sectionBlocks) {
      const secLines = secBlock.trim().split("\n")
      if (secLines.length === 0 || !secLines[0].startsWith("###")) continue

      const secHeader = secLines[0]
      const secMatch = secHeader.match(/^###\s+(.*?)$/)
      if (!secMatch) continue

      const title = secMatch[1].trim()
      const rawContent = secLines.slice(1).join("\n")
      const html = marked.parse(rawContent) as string

      sections.push({ title, html })
    }

    releases.push({ version, date, sections })
  }

  return releases
}

async function getReleases(): Promise<Release[]> {
  const changelogPath = path.join(process.cwd(), "CHANGELOG.md")
  try {
    const content = fs.readFileSync(changelogPath, "utf8")
    return parseChangelog(content)
  } catch (e) {
    console.error("Failed to read root CHANGELOG.md file:", e)
    return []
  }
}

export default async function ChangelogPage() {
  const releases = await getReleases()

  const getSectionBadgeStyle = (title: string) => {
    const lower = title.toLowerCase()
    if (lower.includes("add")) {
      return {
        color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/10",
        icon: Sparkles
      }
    }
    if (lower.includes("fix") || lower.includes("security")) {
      return {
        color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/10",
        icon: AlertTriangle
      }
    }
    if (lower.includes("change") || lower.includes("refactor")) {
      return {
        color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/10",
        icon: RefreshCw
      }
    }
    return {
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/10",
      icon: Layers
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Header />
      
      <main className="flex-1 max-w-[1440px] mx-auto px-6 py-20 w-full">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Page Header */}
          <div className="space-y-4 text-center">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <Terminal className="h-3.5 w-3.5" /> Release logs
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">Product Updates</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
              Explore the timeline of new additions, bug fixes, performance updates, and optimizations.
            </p>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative border-l border-border/80 ml-4 md:ml-32 pl-8 space-y-16 py-4">
            
            {releases.map((release, rIdx) => (
              <div key={release.version} className="relative group">
                
                {/* Timeline node icon */}
                <span className="absolute -left-[45px] top-1.5 h-8 w-8 rounded-full border border-border bg-card shadow-sm flex items-center justify-center text-primary group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                  <CheckCircle2 className="h-4 w-4" />
                </span>

                {/* Left Date label (Only visible on MD/large screens) */}
                <div className="hidden md:block absolute -left-[180px] top-2.5 text-right w-[140px] space-y-1">
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{release.date}</p>
                  <p className="text-[10px] text-primary/80 font-bold flex items-center justify-end gap-1">
                    <Calendar className="h-3 w-3" /> Released
                  </p>
                </div>

                {/* Main Card content */}
                <div className="space-y-6">
                  
                  {/* Version header */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <h2 className="text-3xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
                      Version {release.version}
                    </h2>
                    <span className="md:hidden text-xs font-black text-muted-foreground uppercase tracking-widest">
                      {release.date}
                    </span>
                  </div>

                  {/* Release Card */}
                  <div className="bg-card border rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-300 space-y-8">
                    
                    {release.sections.map((section, sIdx) => {
                      const style = getSectionBadgeStyle(section.title)
                      const Icon = style.icon

                      return (
                        <div key={sIdx} className="space-y-4 last:mb-0 border-b border-border/40 last:border-none pb-6 last:pb-0">
                          
                          {/* Badge tag */}
                          <span className={`inline-flex items-center gap-1.5 border px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${style.color}`}>
                            <Icon className="h-3 w-3" /> {section.title}
                          </span>

                          {/* Items content */}
                          <div 
                            className="prose dark:prose-invert max-w-none 
                              prose-ul:list-disc prose-ul:pl-5 prose-ul:space-y-3
                              prose-li:text-sm prose-li:text-muted-foreground prose-li:leading-relaxed
                              prose-strong:text-foreground prose-strong:font-bold
                              prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs"
                            dangerouslySetInnerHTML={{ __html: section.html }}
                          />

                        </div>
                      )
                    })}

                  </div>

                </div>

              </div>
            ))}

            {releases.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No releases logged in CHANGELOG.md file.
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
