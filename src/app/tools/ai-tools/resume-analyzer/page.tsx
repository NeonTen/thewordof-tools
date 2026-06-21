import { ResumeAnalyzer } from "@/components/tools/resume-analyzer"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ToolHeader } from "@/components/tools/tool-header"

export const metadata = {
  title: "AI Resume Analyzer - TheWordOf Tools",
  description: "Get instant AI feedback on your resume. Improve action verbs, formatting, grammar, and overall impact.",
}

export default async function Page() {
  const session = await auth()
  let creditsRemaining = null

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } })
    creditsRemaining = user?.creditsRemaining ?? null
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <ToolHeader 
        category="AI Tools"
        categoryHref="/tools/ai-tools"
        title="Resume Analyzer" 
      />
      <div className="mt-8">
        <ResumeAnalyzer creditsRemaining={creditsRemaining} isLoggedIn={!!session?.user} />
      </div>
    </div>
  )
}
