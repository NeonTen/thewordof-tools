import { ResumeAnalyzer } from "@/components/tools/resume-analyzer"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ToolHeader } from "@/components/tools/tool-header"
import { RelatedTools } from "@/components/tools/related-tools"

export const metadata = {
  title: "AI Resume Analyzer - TheWordOf Tools",
  description: "Get instant AI feedback on your resume. Improve action verbs, formatting, grammar, and overall impact.",
}

export default async function Page() {
  const session = await auth()
  let creditsRemaining = null

  if (session?.user?.id) {
    const user = await db.user.findUnique({ where: { id: session.user.id } })
    creditsRemaining = user?.credits ?? null
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      <ToolHeader 
        title="Resume Analyzer" 
        description="Get instant AI feedback on your resume. Improve action verbs, formatting, grammar, and overall impact to land your dream job."
      />
      <div className="mt-8">
        <ResumeAnalyzer creditsRemaining={creditsRemaining} isLoggedIn={!!session?.user} />
      </div>
      <div className="mt-16">
        <RelatedTools currentPath="/tools/ai-tools/resume-analyzer" />
      </div>
    </div>
  )
}
