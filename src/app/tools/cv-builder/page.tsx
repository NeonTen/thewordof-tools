import { CvBuilder } from "@/components/tools/cv-builder"
import { auth } from "@/auth"

export const metadata = {
  title: "AI CV Builder",
  description: "Create a professional, ATS-optimized CV with AI.",
}

export default async function CvBuilderPage() {
  const session = await auth()
  const isPro = session?.user?.role === "PRO" || session?.user?.role === "ADMIN"

  return (
    <div className="flex flex-col gap-8">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">AI CV Builder</h1>
        <p className="text-muted-foreground mt-2">
          Create a professional, ATS-optimized CV with AI.
        </p>
      </div>

      <CvBuilder isPro={isPro} />
    </div>
  )
}
