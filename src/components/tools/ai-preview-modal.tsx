"use client"

import { X, CheckCircle, ArrowLeft, Briefcase, GraduationCap, Code, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export type CVParserResult = {
  name: string
  title: string
  email: string
  phone: string
  location: string
  summaryHeading?: string
  summary: string
  skillsText: string
  experience: Array<{
    company: string
    role: string
    period: string
    desc: string
  }>
  education: Array<{
    school: string
    degree: string
    period: string
  }>
  projects: Array<{
    title: string
    link: string
    desc: string
  }>
  customSections?: Array<{
    title: string
    content: string
  }>
}

interface AIPreviewModalProps {
  data: CVParserResult
  onApply: (data: CVParserResult) => void
  onBack: () => void
  onClose: () => void
}

export function AIPreviewModal({ data, onApply, onBack, onClose }: AIPreviewModalProps) {
  const hasExp = data.experience && data.experience.length > 0
  const hasEdu = data.education && data.education.length > 0
  const hasProj = data.projects && data.projects.length > 0
  const hasSkills = data.skillsText && data.skillsText.trim().length > 0

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border bg-background shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h3 className="text-lg font-bold tracking-tight">Review Parsed Profile</h3>
              <p className="text-xs text-muted-foreground">Verify CV data extracted by AI</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Summary */}
          <div className="space-y-3 rounded-2xl border p-4 bg-muted/10">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                <User className="h-4 w-4 text-primary" /> Personal Information
              </h4>
              {data.name && <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-1">
              <div>
                <span className="text-xs text-muted-foreground block">Name</span>
                <span className="font-medium">{data.name || "—"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Title</span>
                <span className="font-medium">{data.title || "—"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Email</span>
                <span className="font-medium">{data.email || "—"}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Phone</span>
                <span className="font-medium">{data.phone || "—"}</span>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-muted-foreground block">Location</span>
                <span className="font-medium">{data.location || "—"}</span>
              </div>
              {data.summary && (
                <div className="col-span-2 pt-2 border-t">
                  <span className="text-xs text-muted-foreground block mb-1">Professional Summary</span>
                  <p className="text-muted-foreground text-xs leading-relaxed">{data.summary}</p>
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-3 rounded-2xl border p-4 bg-muted/10">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                <Briefcase className="h-4 w-4 text-primary" /> Work Experience
              </h4>
              {hasExp && <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />}
            </div>
            {!hasExp ? (
              <p className="text-xs text-muted-foreground italic">No work history identified.</p>
            ) : (
              <div className="space-y-4 pt-2">
                {data.experience.map((item, idx) => (
                  <div key={idx} className="text-xs space-y-1 relative pl-4 border-l-2 border-primary/20 last:pb-0 pb-2">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-foreground">{item.role}</h5>
                      <span className="text-muted-foreground font-medium shrink-0">{item.period}</span>
                    </div>
                    <p className="text-muted-foreground font-semibold">{item.company}</p>
                    {item.desc && <p className="text-muted-foreground leading-relaxed pt-1">{item.desc}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div className="space-y-3 rounded-2xl border p-4 bg-muted/10">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                <GraduationCap className="h-4 w-4 text-primary" /> Education
              </h4>
              {hasEdu && <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />}
            </div>
            {!hasEdu ? (
              <p className="text-xs text-muted-foreground italic">No education details identified.</p>
            ) : (
              <div className="space-y-4 pt-2">
                {data.education.map((item, idx) => (
                  <div key={idx} className="text-xs space-y-0.5 relative pl-4 border-l-2 border-primary/20 last:pb-0 pb-1">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-foreground">{item.degree}</h5>
                      <span className="text-muted-foreground font-medium shrink-0">{item.period}</span>
                    </div>
                    <p className="text-muted-foreground font-semibold">{item.school}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="space-y-3 rounded-2xl border p-4 bg-muted/10">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                <Briefcase className="h-4 w-4 text-primary" /> Key Projects
              </h4>
              {hasProj && <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />}
            </div>
            {!hasProj ? (
              <p className="text-xs text-muted-foreground italic">No projects identified.</p>
            ) : (
              <div className="space-y-4 pt-2">
                {data.projects.map((item, idx) => (
                  <div key={idx} className="text-xs space-y-1 relative pl-4 border-l-2 border-primary/20 last:pb-0 pb-2">
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-foreground">{item.title}</h5>
                      {item.link && <span className="text-muted-foreground font-medium shrink-0">{item.link}</span>}
                    </div>
                    {item.desc && <p className="text-muted-foreground leading-relaxed pt-1">{item.desc}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Custom Content Sections */}
          {data.customSections && data.customSections.length > 0 && (
            <div className="space-y-3 rounded-2xl border p-4 bg-muted/10">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                  <User className="h-4 w-4 text-primary" /> Custom Sections ({data.customSections.length})
                </h4>
                <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />
              </div>
              <div className="space-y-3 pt-2">
                {data.customSections.map((item, idx) => (
                  <div key={idx} className="text-xs space-y-1 relative pl-4 border-l-2 border-primary/20 last:pb-0 pb-2">
                    <h5 className="font-bold text-foreground">{item.title}</h5>
                    {item.content && <p className="text-muted-foreground leading-relaxed pt-1 whitespace-pre-line">{item.content}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          <div className="space-y-3 rounded-2xl border p-4 bg-muted/10">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2 text-foreground">
                <Code className="h-4 w-4 text-primary" /> Extracted Skills
              </h4>
              {hasSkills && <CheckCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />}
            </div>
            {!hasSkills ? (
              <p className="text-xs text-muted-foreground italic">No skills identified.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {data.skillsText.split(',').map((skill, idx) => {
                  const cleaned = skill.trim()
                  if (!cleaned) return null
                  return (
                    <span key={idx} className="text-[10px] font-semibold bg-primary/5 border text-primary rounded-full px-2 py-0.5">
                      {cleaned}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t flex gap-3 bg-muted/20">
          <Button variant="outline" className="flex-1 rounded-2xl h-11" onClick={onBack}>
            Discard & Edit
          </Button>
          <Button className="flex-1 rounded-2xl h-11 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" onClick={() => onApply(data)}>
            Apply to Resume
          </Button>
        </div>
      </div>
    </div>
  )
}
