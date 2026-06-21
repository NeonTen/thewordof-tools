import { AtsScoreChecker } from "@/components/tools/ats-score-checker"
import { auth } from "@/auth"
import { db } from "@/lib/db"
import { ToolHeader } from "@/components/tools/tool-header"
import { RelatedTools } from "@/components/tools/related-tools"

export const metadata = {
  title: "ATS Score Checker - TheWordOf Tools",
  description: "Compare your resume against a job description. Get an ATS match score and discover missing keywords instantly.",
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
        title="ATS Score Checker" 
        description="Compare your resume against any job description to calculate your ATS match score and discover missing keywords instantly."
      />
      <div className="mt-8">
        <AtsScoreChecker creditsRemaining={creditsRemaining} isLoggedIn={!!session?.user} />
      </div>
      <div className="mt-16">
        <RelatedTools currentPath="/tools/ai-tools/ats-score-checker" />
      </div>
    </div>
  )
}
