"use client"

import { Check, ArrowLeft, X, Briefcase, GraduationCap, Code, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"

type LinkedInImportResult = {
  name: string
  title: string
  location: string
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
}

interface LinkedInPreviewModalProps {
  data: LinkedInImportResult
  onApply: (data: LinkedInImportResult) => void
  onBack: () => void
  onClose: () => void
}

export function LinkedInPreviewModal({ data, onApply, onBack, onClose }: LinkedInPreviewModalProps) {
  const hasExperience = data.experience && data.experience.length > 0
  const hasEducation = data.education && data.education.length > 0
  const skillsArray = data.skillsText ? data.skillsText.split(",").map(s => s.trim()).filter(Boolean) : []

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-200" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border bg-background shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-blue-500/5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h3 className="text-base font-black text-foreground leading-tight">LinkedIn Profile Preview</h3>
              <p className="text-[11px] text-blue-500 font-semibold tracking-wide">✓ Parsed Successfully — Review Details</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 max-h-[50vh]">
          
          {/* Personal Card */}
          <div className="border rounded-2xl p-4 bg-muted/10 space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Personal Details
              </span>
              <span className="h-4 w-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-[10px] text-emerald-500 font-bold">✓</span>
            </div>
            <div className="space-y-2 text-sm leading-relaxed">
              <div><span className="font-bold text-muted-foreground w-16 inline-block">Name:</span> <span className="font-bold text-blue-500">{data.name || "—"}</span></div>
              <div><span className="font-bold text-muted-foreground w-16 inline-block">Title:</span> <span>{data.title || "—"}</span></div>
              <div><span className="font-bold text-muted-foreground w-16 inline-block">Location:</span> <span>{data.location || "—"}</span></div>
            </div>
          </div>

          {/* Summary Card */}
          {data.summary && (
            <div className="border rounded-2xl p-4 bg-muted/10 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5" /> Professional Summary
                </span>
                <span className="h-4 w-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-[10px] text-emerald-500 font-bold">✓</span>
              </div>
              <p className="text-xs text-muted-foreground italic leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience Card */}
          {hasExperience && (
            <div className="border rounded-2xl p-4 bg-muted/10 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" /> Work Experience
                </span>
                <span className="h-4 w-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-[10px] text-emerald-500 font-bold">✓</span>
              </div>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="font-bold text-foreground">{exp.role}</div>
                    <div className="text-blue-500/80 font-medium">{exp.company} · <span className="text-muted-foreground">{exp.period}</span></div>
                    {exp.desc && <p className="text-muted-foreground/80 mt-1 leading-relaxed">{exp.desc}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education Card */}
          {hasEducation && (
            <div className="border rounded-2xl p-4 bg-muted/10 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="h-3.5 w-3.5" /> Education Details
                </span>
                <span className="h-4 w-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-[10px] text-emerald-500 font-bold">✓</span>
              </div>
              <div className="space-y-3">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="space-y-0.5 text-xs">
                    <div className="font-bold text-foreground">{edu.school}</div>
                    <div className="text-muted-foreground">{edu.degree} · {edu.period}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Card */}
          {skillsArray.length > 0 && (
            <div className="border rounded-2xl p-4 bg-muted/10 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5" /> Skills & Abilities
                </span>
                <span className="h-4 w-4 bg-emerald-500/10 rounded-full flex items-center justify-center text-[10px] text-emerald-500 font-bold">✓</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skillsArray.map((skill, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10 px-2.5 py-0.5 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t flex items-center gap-4 bg-muted/5">
          <Button variant="outline" className="flex-1 h-11 font-bold rounded-xl" onClick={onBack}>
            ← Go Back
          </Button>
          <Button className="flex-1 h-11 font-bold rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20" onClick={() => onApply(data)}>
            Apply to CV <Check className="h-4 w-4 ml-2" />
          </Button>
        </div>

      </div>
    </div>
  )
}
