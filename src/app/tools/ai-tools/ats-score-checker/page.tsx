import { AtsScoreChecker } from "@/components/tools/ats-score-checker"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { ToolHeader } from "@/components/tools/tool-header"

export const metadata = {
  title: "ATS Score Checker - TheWordOf Tools",
  description: "Compare your resume against a job description. Get an ATS match score and discover missing keywords instantly.",
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
        title="ATS Score Checker" 
      />
      <div className="mt-8">
        <AtsScoreChecker creditsRemaining={creditsRemaining} isLoggedIn={!!session?.user} />
      </div>
      
      {/* SEO Content Section */}
      <div className="mt-16 prose prose-slate dark:prose-invert max-w-none">
        <h2 className="text-2xl font-bold tracking-tight mb-4">What is an ATS Score Checker?</h2>
        <p>
          An Applicant Tracking System (ATS) is software used by employers to filter and rank resumes based on 
          how well they match a job description. Our AI-powered <strong>ATS Score Checker</strong> simulates 
          these algorithms to give you an accurate match percentage. By comparing your resume directly to the 
          job requirements, it highlights precisely which critical keywords you are missing, allowing you to 
          optimize your application before you hit submit.
        </p>

        <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">How to Use This Tool</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Paste the Job Description:</strong> Copy the requirements and responsibilities from the job posting.</li>
          <li><strong>Paste Your Resume:</strong> Provide your current resume text, including your experience and skills.</li>
          <li><strong>Check Your Score:</strong> The AI will analyze the semantic match and provide a score out of 100.</li>
          <li><strong>Review Missing Keywords:</strong> Take note of the red badges indicating critical skills the employer is looking for.</li>
          <li><strong>Improve Your Resume:</strong> Use the "Improve Resume" feature to automatically rewrite your resume and seamlessly incorporate the missing keywords!</li>
        </ol>

        <h2 className="text-2xl font-bold tracking-tight mt-8 mb-4">Why is ATS Optimization Important?</h2>
        <p>
          Over 75% of resumes are rejected by ATS systems before a human recruiter ever sees them. 
          Even if you are highly qualified, missing exact keywords or phrasing can lower your ranking. 
          Regularly using an ATS checker helps ensure your resume successfully passes the automated screening, 
          significantly increasing your chances of landing an interview.
        </p>
      </div>
    </div>
  )
}
