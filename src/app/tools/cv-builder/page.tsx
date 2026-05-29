import { CvBuilder } from "@/components/tools/cv-builder"
import { auth } from "@/auth"

export const metadata = {
  title: "AI CV Builder",
  description: "Create a professional, ATS-optimized CV with AI.",
}

export default async function CvBuilderPage() {
  const session = await auth()
  const role = session?.user?.role
  const isPro = role === "PRO" || role === "BUSINESS" || role === "ADMIN"
  const isBusiness = role === "BUSINESS" || role === "ADMIN"

  return (
    <CvBuilder isPro={isPro} isBusiness={isBusiness} />
  )
}
