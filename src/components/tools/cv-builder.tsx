"use client"

import React, { useState } from "react"
import { Download, Loader2, Sparkles, Plus, Trash2, User, Layout, Image as ImageIcon, Crown, Star, AlignLeft, BarChart3, ArrowRight, X, Save, FolderOpen } from "lucide-react"
import { ProGate } from "@/components/ui/pro-gate"
import { cn } from "@/lib/utils"
import { AIParserModal, type CVParserResult } from "./ai-parser-modal"
import Link from "next/link"
import { useUsageLimit } from "@/hooks/use-usage-limit"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const TEMPLATES = [
  { id: 'modern', name: 'modern', pro: false },
  { id: 'elegant', name: 'elegant', pro: false },
  { id: 'creative', name: 'creative', pro: true },
  { id: 'tech', name: 'compact (tech)', pro: true },
  { id: 'sidebar', name: 'sidebar', pro: true },
  { id: 'executive', name: 'executive pro', pro: true },
  { id: 'minimalist-pro', name: 'minimalist pro', pro: true },
  { id: 'developer', name: 'developer pro', pro: true },
  { id: 'metro', name: 'metro grid', pro: true },
  { id: 'accent', name: 'accent left', pro: true },
]

const generateUniqueId = () => Date.now() + Math.random()

export function CvBuilder({ 
  isPro = false, 
  isBusiness = false,
  creditsRemaining = null
}: { 
  isPro?: boolean; 
  isBusiness?: boolean;
  creditsRemaining?: number | null;
}) {
  const [headings, setHeadings] = useState({
    summary: "Summary",
    skills: "Skills & Expertise",
    experience: "Experience",
    projects: "Projects",
    education: "Education"
  })

  const updateHeading = (key: keyof typeof headings, val: string) => {
    setHeadings(prev => ({ ...prev, [key]: val }))
  }

  const [customSections, setCustomSections] = useState<Array<{ id: string; title: string; content: string }>>([])

  const addCustomSection = () => {
    setCustomSections(prev => [
      ...prev,
      { id: (Date.now() + Math.random()).toString(), title: "Additional Section", content: "" }
    ])
  }

  const updateCustomSection = (id: string, field: 'title' | 'content', value: string) => {
    setCustomSections(prev => prev.map(cs => cs.id === id ? { ...cs, [field]: value } : cs))
  }

  const removeCustomSection = (id: string) => {
    setCustomSections(prev => prev.filter(cs => cs.id !== id))
  }

  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [templateId, setTemplateId] = useState('modern')
  const [photo, setPhoto] = useState<string | null>(null)
  const [skillMode, setSkillMode] = useState<'text' | 'bars'>('text')
  const [showAIParserModal, setShowAIParserModal] = useState(false)
  const [initialParserText, setInitialParserText] = useState("")

  React.useEffect(() => {
    const savedText = localStorage.getItem("ats_import_text")
    if (savedText) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setInitialParserText(savedText)
      setShowAIParserModal(true)
      localStorage.removeItem("ats_import_text")
    }
  }, [])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeModalType, setUpgradeModalType] = useState<"template" | "print">("template")

  const [activeResumeId, setActiveResumeId] = useState<string | null>(null)
  const [savedResumesList, setSavedResumesList] = useState<any[]>([])
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false)
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false)
  const [saveTitle, setSaveTitle] = useState("")
  const [isSavingResume, setIsSavingResume] = useState(false)
  const [isLoadingResumesList, setIsLoadingResumesList] = useState(false)

  const { count: usedThisMonth, increment: incrementUsage } = useUsageLimit("cv-builder", "monthly")
  const MAX_FREE_PRINTS = 3
  const limitReached = !isPro && usedThisMonth >= MAX_FREE_PRINTS

  const [cv, setCv] = useState({
    name: "John Doe",
    title: "Senior Full Stack Engineer",
    phone: "+1 555 123 4567",
    email: "john@example.com",
    location: "San Francisco, CA",
    summary: "A passionate software engineer with experience in building scalable web applications.",
    skillsText: "React, Next.js, TypeScript, Node.js, PostgreSQL"
  })

  const handleApplyAIData = (data: CVParserResult) => {
    // Update main details
    setCv(prev => ({
      ...prev,
      name: data.name || prev.name,
      title: data.title || prev.title,
      email: data.email || prev.email,
      phone: data.phone || prev.phone,
      location: data.location || prev.location,
      summary: data.summary || prev.summary,
      skillsText: data.skillsText || prev.skillsText
    }))

    // Map experience
    if (data.experience && data.experience.length > 0) {
      setExperience(data.experience.map((exp, idx: number) => ({
        id: Date.now() + idx,
        company: exp.company || "",
        role: exp.role || "",
        period: exp.period || "",
        desc: exp.desc || ""
      })))
    }

    // Map education
    if (data.education && data.education.length > 0) {
      setEducation(data.education.map((edu, idx: number) => ({
        id: Date.now() + idx,
        school: edu.school || "",
        degree: edu.degree || "",
        period: edu.period || ""
      })))
    }

    // Map projects
    if (data.projects && data.projects.length > 0) {
      setProjects(data.projects.map((proj, idx: number) => ({
        id: Date.now() + idx,
        title: proj.title || "",
        link: proj.link || "",
        desc: proj.desc || ""
      })))
    }
  }

  const [skills, setSkills] = useState([
    { id: 1, name: "React", rating: 90 },
    { id: 2, name: "Next.js", rating: 85 },
    { id: 3, name: "TypeScript", rating: 80 }
  ])

  const [experience, setExperience] = useState([
    { id: 1, company: "Tech Corp", role: "Frontend Developer", period: "2020 - Present", desc: "Led the development of the core product using React." }
  ])

  const [education, setEducation] = useState([
    { id: 1, school: "University of Technology", degree: "B.S. Computer Science", period: "2016 - 2020" }
  ])

  const [projects, setProjects] = useState([
    { id: 1, title: "E-commerce Platform", link: "github.com/john/shop", desc: "Built a full-stack shop using Next.js and Stripe." }
  ])

  const addSkill = () => {
    const id = generateUniqueId()
    setSkills([...skills, { id, name: "", rating: 80 }])
  }
  const removeSkill = (id: number) => setSkills(skills.filter(s => s.id !== id))
  const updateSkill = (id: number, field: string, value: string | number) => {
    setSkills(skills.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const addExperience = () => {
    const id = generateUniqueId()
    setExperience([...experience, { id, company: "", role: "", period: "", desc: "" }])
  }
  const removeExperience = (id: number) => setExperience(experience.filter(e => e.id !== id))
  const updateExperience = (id: number, field: string, value: string) => {
    setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const addEducation = () => {
    const id = generateUniqueId()
    setEducation([...education, { id, school: "", degree: "", period: "" }])
  }
  const removeEducation = (id: number) => setEducation(education.filter(e => e.id !== id))
  const updateEducation = (id: number, field: string, value: string) => {
    setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  const addProject = () => {
    const id = generateUniqueId()
    setProjects([...projects, { id, title: "", link: "", desc: "" }])
  }
  const removeProject = (id: number) => setProjects(projects.filter(p => p.id !== id))
  const updateProject = (id: number, field: string, value: string) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCv({ ...cv, [e.target.name]: e.target.value })
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setPhoto(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const generateAISummary = async () => {
    setIsGeneratingAI(true)
    try {
      const res = await fetch("/api/ai/cv-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: cv.title,
          skills: skillMode === 'text' ? cv.skillsText : skills.map(s => s.name).join(", "),
          experience: experience.map(e => `${e.role} at ${e.company}`).join(", ")
        })
      })
      if (res.ok) {
        const text = await res.text()
        setCv({ ...cv, summary: text })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const handlePrint = async () => {
    if (limitReached) {
      setUpgradeModalType("print")
      setShowUpgradeModal(true)
      return
    }
    window.print()
    if (!isPro) {
      await incrementUsage(1)
    }
  }
  const handleFetchResumes = async () => {
    setIsLoadingResumesList(true)
    try {
      const res = await fetch("/api/tools/cv-builder")
      if (res.ok) {
        const json = await res.json()
        setSavedResumesList(json.list || [])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoadingResumesList(false)
    }
  }

  const handleSaveResume = async (titleToSave?: string) => {
    const finalTitle = titleToSave || saveTitle
    if (!finalTitle) return
    setIsSavingResume(true)
    try {
      const res = await fetch("/api/tools/cv-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeResumeId,
          title: finalTitle,
          data: {
            cv,
            skills,
            experience,
            education,
            projects,
            templateId,
            photo,
            skillMode
          }
        })
      })
      if (res.ok) {
        const json = await res.json()
        setActiveResumeId(json.resume.id)
        setIsSaveModalOpen(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSavingResume(false)
    }
  }

  const handleDeleteResume = async (id: string) => {
    try {
      const res = await fetch(`/api/tools/cv-builder/${id}`, { method: "DELETE" })
      if (res.ok) {
        setSavedResumesList(prev => prev.filter(r => r.id !== id))
        if (activeResumeId === id) setActiveResumeId(null)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleLoadResume = async (id: string) => {
    try {
      const res = await fetch(`/api/tools/cv-builder/${id}`)
      if (res.ok) {
        const json = await res.json()
        const resume = json.resume
        if (resume && resume.data) {
          const loadedData = resume.data as any
          setCv(loadedData.cv || cv)
          setSkills(loadedData.skills || [])
          setExperience(loadedData.experience || [])
          setEducation(loadedData.education || [])
          setProjects(loadedData.projects || [])
          setTemplateId(loadedData.templateId || "modern")
          setPhoto(loadedData.photo || null)
          setSkillMode(loadedData.skillMode || "text")
          setActiveResumeId(resume.id)
          setSaveTitle(resume.title)
          setIsLoadModalOpen(false)
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Rendering Helpers
  const getHeadingStyle = (title: string, accentColor: string) => {
    const base: React.CSSProperties = {
      fontSize: '14px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '12px',
      color: '#111827',
      display: 'block',
    }

    if (templateId === 'modern' || templateId === 'creative' || templateId === 'accent') {
      return { ...base, borderBottom: `2px solid ${accentColor}`, paddingBottom: '4px' }
    }
    if (templateId === 'elegant') {
      return { ...base, borderBottom: `1px solid ${accentColor}`, paddingBottom: '6px', textAlign: 'center' as const, fontWeight: 'normal' }
    }
    if (templateId === 'sidebar') {
      return { ...base, fontSize: '16px', borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px' }
    }
    if (templateId === 'tech') {
      return { ...base, fontFamily: 'monospace', color: accentColor, textTransform: 'none' as const, border: 'none' }
    }
    if (templateId === 'executive') {
      return { ...base, fontFamily: '"Times New Roman", Times, serif', fontSize: '15px', color: '#1e3a8a', borderBottom: `1px solid #cbd5e1`, paddingBottom: '3px', letterSpacing: '0.1em' }
    }
    if (templateId === 'minimalist-pro') {
      return { ...base, fontSize: '12px', letterSpacing: '0.15em', color: '#475569', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }
    }
    if (templateId === 'developer') {
      return { ...base, fontSize: '13px', fontFamily: 'monospace', color: '#4f46e5', borderLeft: '3px solid #4f46e5', paddingLeft: '8px' }
    }
    if (templateId === 'metro') {
      return { ...base, fontSize: '11px', letterSpacing: '0.08em', backgroundColor: '#f8fafc', color: '#0f172a', padding: '6px 12px', borderRadius: '6px', display: 'inline-block', border: '1px solid #e2e8f0', marginBottom: '16px' }
    }

    return base
  }

  const renderSection = (title: string, content: React.ReactNode, accentColor = '#2563eb') => {
    if (!content) return null
    
    // Tech template has a very specific structure for some sections
    if (templateId === 'tech' && (title === 'Experience' || title === 'Projects' || title === 'Education')) {
      const constName = title.toUpperCase()
      return (
        <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px dashed #cbd5e1' }}>
          <h3 style={getHeadingStyle(title, accentColor)}>const {constName} = [</h3>
          {content}
          <h3 style={getHeadingStyle(title, accentColor)}>]</h3>
        </div>
      )
    }

    return (
      <div style={{ marginBottom: '32px' }}>
        <h2 style={getHeadingStyle(title, accentColor)}>{title}</h2>
        {content}
      </div>
    )
  }

  function FormattedCvText({ 
    text, 
    style = {}, 
    templateId: tId = 'modern'
  }: { 
    text: string
    style?: React.CSSProperties
    templateId?: string
  }) {
    if (!text || !text.trim()) return null

    if (tId === 'tech') {
      return <p style={{ margin: 0, ...style }}>{`/* ${text} */`}</p>
    }

    // Normalize inline bullet separators like ".- ", ". - ", or " - " after sentences
    const normalized = text
      .replace(/([a-zA-Z0-9)])\s*\.-\s*/g, "$1.\n- ")
      .replace(/([a-zA-Z0-9)])\s+-\s+(?=[A-Z])/g, "$1.\n- ")
      .replace(/\.{2,}/g, ".")

    const lines = normalized.split("\n").map(l => l.trim()).filter(Boolean)
    const bulletRegex = /^([-*•]|\d+[.)])\s+/

    const hasBullets = lines.some(l => bulletRegex.test(l)) || text.includes(".- ")

    if (hasBullets) {
      return (
        <ul style={{ margin: '4px 0', paddingLeft: '18px', listStyleType: 'disc', ...style }}>
          {lines.map((line, idx) => {
            const cleanLine = line.replace(bulletRegex, "").trim()
            if (!cleanLine) return null
            return (
              <li key={idx} style={{ marginBottom: '3px', lineHeight: '1.5' }}>
                {cleanLine}
              </li>
            )
          })}
        </ul>
      )
    }

    if (lines.length > 1) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {lines.map((line, idx) => (
            <p key={idx} style={{ margin: 0, lineHeight: '1.6', ...style }}>
              {line}
            </p>
          ))}
        </div>
      )
    }

    return (
      <p style={{ margin: 0, lineHeight: '1.6', ...style }}>
        {text}
      </p>
    )
  }

  const renderSummary = (accentColor = '#2563eb') => 
    renderSection(headings.summary || "Summary", 
      <FormattedCvText 
        text={cv.summary} 
        templateId={templateId}
        style={{ 
          fontSize: '14px', 
          lineHeight: '1.6', 
          color: '#374151',
          textAlign: templateId === 'elegant' ? 'center' : 'left' as const,
          fontStyle: (templateId === 'elegant' || templateId === 'minimalist-pro') ? 'italic' : 'normal'
        }} 
      />, 
      accentColor
    )

  const renderSkills = (accentColor = '#2563eb') => 
    renderSection(headings.skills || "Skills", 
      skillMode === 'text' ? (
        <p style={{ fontSize: '14px', color: '#374151', margin: 0 }}>{cv.skillsText}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {skills.map(s => {
            if (templateId === 'tech') {
              const dots = Math.floor(s.rating / 10);
              const bar = '[' + '='.repeat(dots) + '>'.repeat(dots > 0 ? 1 : 0) + ' '.repeat(Math.max(0, 10 - dots - (dots > 0 ? 1 : 0))) + ']';
              return (
                <div key={s.id} style={{ fontFamily: 'monospace', fontSize: '13px', color: '#334155', paddingLeft: '20px' }}>
                  <span style={{ color: '#2563eb' }}>{s.name}</span>: {bar} {s.rating}%
                </div>
              );
            }
            return (
              <div key={s.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '600' }}>
                  <span>{s.name}</span>
                  <span>{s.rating}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                  <div style={{ width: `${s.rating}%`, height: '100%', backgroundColor: accentColor, borderRadius: '3px', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} />
                </div>
              </div>
            );
          })}
        </div>
      ), 
      accentColor
    )

  const renderExperience = (accentColor = '#2563eb') => 
    renderSection(headings.experience || "Experience", 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {experience.map(e => {
          if (templateId === 'tech') {
            return <div key={e.id} style={{ paddingLeft: '20px', color: '#334155', fontSize: '13px' }}><p style={{ margin: 0 }}>{`{ role: "${e.role}", company: "${e.company}", desc: "${e.desc}" },`}</p></div>
          }
          return (
            <div key={e.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{e.role} {templateId === 'elegant' ? '|' : '@'} {e.company}</span>
                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal' }}>{e.period}</span>
              </div>
              <div style={{ marginTop: '4px' }}>
                <FormattedCvText 
                  text={e.desc} 
                  templateId={templateId}
                  style={{ fontSize: '13px', color: '#4b5563' }} 
                />
              </div>
            </div>
          )
        })}
      </div>, 
      accentColor
    )

  const renderProjects = (accentColor = '#2563eb') => 
    projects.length > 0 && renderSection(headings.projects || "Projects", 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {projects.map(p => {
          if (templateId === 'tech') {
            return <div key={p.id} style={{ paddingLeft: '20px', color: '#334155', fontSize: '13px' }}><p style={{ margin: 0 }}>{`{ title: "${p.title}", link: "${p.link}", desc: "${p.desc}" },`}</p></div>
          }
          return (
            <div key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontWeight: '600', color: '#111827', margin: 0, fontSize: '14px' }}>{p.title}</h3>
                <span style={{ fontSize: '12px', color: accentColor }}>{p.link}</span>
              </div>
              <div style={{ marginTop: '4px' }}>
                <FormattedCvText 
                  text={p.desc} 
                  templateId={templateId}
                  style={{ fontSize: '14px', color: '#374151' }} 
                />
              </div>
            </div>
          )
        })}
      </div>, 
      accentColor
    )

  const renderEducation = (accentColor = '#2563eb') => 
    education.length > 0 && renderSection(headings.education || "Education", 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {education.map(edu => {
          if (templateId === 'tech') {
            return <div key={edu.id} style={{ paddingLeft: '20px', color: '#334155', fontSize: '13px' }}><p style={{ margin: 0 }}>{`{ school: "${edu.school}", degree: "${edu.degree}", period: "${edu.period}" },`}</p></div>
          }
          return (
            <div key={edu.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span>{edu.school}</span>
                <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: 'normal' }}>{edu.period}</span>
              </div>
              <p style={{ fontSize: '13px', color: '#4b5563', margin: 0 }}>{edu.degree}</p>
            </div>
          )
        })}
      </div>, 
      accentColor
    )

  const renderCustomSections = (accentColor = '#2563eb') => (
    <>
      {customSections.map(cs => (
        cs.content && cs.content.trim() ? (
          <React.Fragment key={cs.id}>
            {renderSection(cs.title || "Additional Section", 
              <FormattedCvText 
                text={cs.content} 
                templateId={templateId}
                style={{ fontSize: '14px', lineHeight: '1.6', color: '#374151' }} 
              />, 
              accentColor
            )}
          </React.Fragment>
        ) : null
      ))}
    </>
  )

  return (<>
    {/* Global Print Styles to fix margins */}
    <style dangerouslySetInnerHTML={{ __html: `
      @media print {
        @page { 
          margin: 15mm 0; 
          size: A4 portrait;
        }
        @page :first {
          margin-top: 0;
        }
        body { 
          margin: 0; 
          -webkit-print-color-adjust: exact !important; 
          print-color-adjust: exact !important;
        }
        header, footer, nav, aside, .no-print, [class*="ToolHeader"] {
          display: none !important;
        }
        .print-full-width {
          width: 100% !important;
          max-width: none !important;
          margin: 0 !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
      }
    `}} />

    <div className="flex flex-col gap-8 print:block print:w-full">
      {!isPro && (
        <div className="print:hidden flex justify-end -mb-4">
          <span className="text-xs font-bold text-muted-foreground bg-muted px-4 py-2 rounded-full">
            {MAX_FREE_PRINTS - usedThisMonth} of {MAX_FREE_PRINTS} free exports left this month
          </span>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_600px] gap-8 print:block print:w-full">
        {/* Editor Panel */}
        <div className="space-y-6 print:hidden">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Details</CardTitle>
            <div className="flex items-center gap-3">
              <ProGate feature="AI Resume Parser" isPro={isPro}>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowAIParserModal(true)} 
                  className="font-bold border-purple-500/20 hover:bg-purple-500/5 text-purple-600 dark:text-purple-400 gap-1.5"
                >
                  <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
                  ✨ Import with AI
                </Button>
              </ProGate>
              <ProGate feature="User Photo" isPro={isPro}>
                <div className="flex items-center gap-3">
                  {photo && <img src={photo} className="h-10 w-10 rounded-full object-cover border-2 border-primary shadow-sm" alt="Profile" />}
                  <label className="cursor-pointer bg-primary text-white hover:bg-primary/90 p-2.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center">
                    <ImageIcon className="h-5 w-5" />
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                  </label>
                </div>
              </ProGate>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full Name</Label><Input name="name" value={cv.name} onChange={handleCvChange} /></div>
              <div className="space-y-2"><Label>Professional Title</Label><Input name="title" value={cv.title} onChange={handleCvChange} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Email</Label><Input name="email" value={cv.email} onChange={handleCvChange} /></div>
              <div className="space-y-2"><Label>Phone</Label><Input name="phone" value={cv.phone} onChange={handleCvChange} /></div>
            </div>
            <div className="space-y-2"><Label>Location</Label><Input name="location" value={cv.location} onChange={handleCvChange} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Input 
              value={headings.summary} 
              onChange={e => updateHeading('summary', e.target.value)} 
              className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]" 
            />
            <Button size="sm" variant="secondary" onClick={generateAISummary} disabled={isGeneratingAI}>
              {isGeneratingAI ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              AI Write
            </Button>
          </CardHeader>
          <CardContent>
            <Textarea name="summary" value={cv.summary} onChange={handleCvChange} rows={4} />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Tip: Start lines with &quot;-&quot; or &quot;&bull;&quot; to auto-format bullet lists, or use line breaks for paragraphs.
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between py-1">
          <ProGate feature="Custom Sections" isPro={isPro}>
            <Button size="sm" variant="outline" onClick={addCustomSection} className="gap-1.5 font-bold">
              <Plus className="h-4 w-4" /> Add Custom Section
            </Button>
          </ProGate>
        </div>

        {customSections.map(cs => (
          <Card key={cs.id} className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Input
                value={cs.title}
                onChange={e => updateCustomSection(cs.id, 'title', e.target.value)}
                placeholder="Section Heading..."
                className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[220px]"
              />
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeCustomSection(cs.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={cs.content}
                onChange={e => updateCustomSection(cs.id, 'content', e.target.value)}
                rows={3}
                placeholder="Add section details or bullet points..."
              />
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Tip: Start lines with &quot;-&quot; or &quot;&bull;&quot; to auto-format bullet lists, or use line breaks for paragraphs.
              </p>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Input 
              value={headings.skills} 
              onChange={e => updateHeading('skills', e.target.value)} 
              className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]" 
            />
            <ProGate feature="Skill Bars" isPro={isPro}>
              <Tabs 
                value={skillMode} 
                onValueChange={(val) => {
                  const mode = val as 'text' | 'bars'
                  setSkillMode(mode)
                  if (mode === 'bars') {
                    const list = cv.skillsText.split(',').map(s => s.trim()).filter(Boolean)
                    if (list.length > 0) {
                      setSkills(list.map((name, i) => {
                        const existing = skills.find(s => s.name.toLowerCase() === name.toLowerCase())
                        return {
                          id: existing?.id || (Date.now() + i + Math.random()),
                          name,
                          rating: existing?.rating || 80
                        }
                      }))
                    }
                  } else {
                    const text = skills.map(s => s.name).filter(Boolean).join(', ')
                    setCv(prev => ({ ...prev, skillsText: text }))
                  }
                }}
              >
                <TabsList className="h-8">
                  <TabsTrigger value="text" className="text-[10px] uppercase font-bold px-3"><AlignLeft className="h-3 w-3 mr-1" /> Text</TabsTrigger>
                  <TabsTrigger value="bars" className="text-[10px] uppercase font-bold px-3"><BarChart3 className="h-3 w-3 mr-1" /> Bars</TabsTrigger>
                </TabsList>
              </Tabs>
            </ProGate>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillMode === 'text' ? (
              <div className="space-y-2">
                <Label>Skills (Comma separated)</Label>
                <Input name="skillsText" value={cv.skillsText} onChange={handleCvChange} placeholder="React, Next.js, etc." />
              </div>
            ) : (
              <div className="space-y-4">
                <Button size="sm" variant="outline" className="w-full" onClick={addSkill}><Plus className="h-4 w-4 mr-2" /> Add Skill with Rating</Button>
                {skills.map((s) => (
                  <div key={s.id} className="flex flex-col gap-3 p-3 border rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      <Input placeholder="Skill Name" value={s.name} onChange={e => updateSkill(s.id, 'name', e.target.value)} className="h-8" />
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeSkill(s.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 px-1">
                      <Slider value={[s.rating]} max={100} step={1} onValueChange={(val) => updateSkill(s.id, 'rating', Array.isArray(val) ? val[0] : val)} className="flex-1" />
                      <span className="text-xs font-bold w-8 text-right">{s.rating}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Input 
              value={headings.experience} 
              onChange={e => updateHeading('experience', e.target.value)} 
              className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]" 
            />
            <ProGate feature="Experience Manager" isPro={isPro}><Button size="sm" variant="outline" onClick={addExperience}><Plus className="h-4 w-4 mr-2" /> Add</Button></ProGate>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProGate feature="Experience Manager" isPro={isPro}>
              {experience.map((exp, idx) => (
                <div key={exp.id} className={cn("space-y-4 relative", idx > 0 && "pt-6 border-t")}>
                  {idx > 0 && <Button variant="ghost" size="icon" className="absolute top-4 right-0 text-destructive h-8 w-8" onClick={() => removeExperience(exp.id)}><Trash2 className="h-4 w-4" /></Button>}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Company</Label><Input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Role</Label><Input value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} /></div>
                  </div>
                  <Input placeholder="Period" value={exp.period} onChange={e => updateExperience(exp.id, 'period', e.target.value)} />
                  <div>
                    <Textarea value={exp.desc} onChange={e => updateExperience(exp.id, 'desc', e.target.value)} rows={3} />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Tip: Start lines with &quot;-&quot; or &quot;&bull;&quot; to auto-format bullet lists.
                    </p>
                  </div>
                </div>
              ))}
            </ProGate>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Input 
              value={headings.projects} 
              onChange={e => updateHeading('projects', e.target.value)} 
              className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]" 
            />
            <ProGate feature="Projects Section" isPro={isPro}><Button size="sm" variant="outline" onClick={addProject}><Plus className="h-4 w-4 mr-2" /> Add</Button></ProGate>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProGate feature="Projects Section" isPro={isPro}>
              {projects.map((p, idx) => (
                <div key={p.id} className={cn("space-y-4 relative", idx > 0 && "pt-6 border-t")}>
                  {idx > 0 && <Button variant="ghost" size="icon" className="absolute top-4 right-0 text-destructive h-8 w-8" onClick={() => removeProject(p.id)}><Trash2 className="h-4 w-4" /></Button>}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Title</Label><Input value={p.title} onChange={e => updateProject(p.id, 'title', e.target.value)} /></div>
                    <div className="space-y-2"><Label>Link</Label><Input value={p.link} onChange={e => updateProject(p.id, 'link', e.target.value)} /></div>
                  </div>
                  <div>
                    <Textarea placeholder="Project summary..." value={p.desc} onChange={e => updateProject(p.id, 'desc', e.target.value)} rows={2} />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Tip: Start lines with &quot;-&quot; or &quot;&bull;&quot; to auto-format bullet lists.
                    </p>
                  </div>
                </div>
              ))}
            </ProGate>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <Input 
              value={headings.education} 
              onChange={e => updateHeading('education', e.target.value)} 
              className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]" 
            />
            <ProGate feature="Education Details" isPro={isPro}><Button size="sm" variant="outline" onClick={addEducation}><Plus className="h-4 w-4 mr-2" /> Add</Button></ProGate>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProGate feature="Education Details" isPro={isPro}>
              {education.map((edu, idx) => (
                <div key={edu.id} className={cn("space-y-4 relative", idx > 0 && "pt-6 border-t")}>
                  {idx > 0 && <Button variant="ghost" size="icon" className="absolute top-4 right-0 text-destructive h-8 w-8" onClick={() => removeEducation(edu.id)}><Trash2 className="h-4 w-4" /></Button>}
                  <Input placeholder="School / University" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Degree" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                    <Input placeholder="Period" value={edu.period} onChange={e => updateEducation(edu.id, 'period', e.target.value)} />
                  </div>
                </div>
              ))}
            </ProGate>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="space-y-4 relative print:m-0 print:p-0">
        <div className="sticky top-24 print:hidden">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-card p-4 rounded-2xl border shadow-sm mb-4">
            <div className="flex items-center gap-3">
              <Select 
                value={templateId} 
                onValueChange={(val) => {
                  const selected = TEMPLATES.find(t => t.id === val)
                  if (selected?.pro && !isPro) {
                    setUpgradeModalType("template")
                    setShowUpgradeModal(true)
                  } else {
                    setTemplateId(val || "modern")
                  }
                }}
              >
                <SelectTrigger className="w-[180px] font-bold capitalize"><SelectValue placeholder="Modern" /></SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map(t => (
                    <SelectItem key={t.id} value={t.id} className="flex items-center justify-between capitalize">
                      <span className="flex items-center gap-2">{t.name}{t.pro && <Crown className="h-3 w-3 text-amber-500 inline ml-1" />}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              
              <ProGate feature="Cloud Save" isPro={isPro}>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={async () => {
                      await handleFetchResumes()
                      setIsLoadModalOpen(true)
                    }}
                    className="font-bold gap-1.5 h-10 px-4"
                  >
                    <FolderOpen className="h-4 w-4" /> Load
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (activeResumeId) {
                        handleSaveResume(saveTitle)
                      } else {
                        setSaveTitle(cv.name ? `${cv.name} Resume` : "My Resume")
                        setIsSaveModalOpen(true)
                      }
                    }}
                    className="font-bold gap-1.5 h-10 px-4"
                  >
                    <Save className="h-4 w-4" /> {activeResumeId ? "Save" : "Save Cloud"}
                  </Button>
                </div>
              </ProGate>

              <Button onClick={handlePrint} className="bg-primary shadow-lg shadow-primary/20 h-10">
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
          <div className="bg-white text-black shadow-2xl print:shadow-none print:m-0 overflow-hidden relative mx-auto print-full-width"
            style={{ width: '100%', maxWidth: '210mm', minHeight: '297mm', backgroundColor: '#ffffff', color: '#000000', fontFamily: (templateId === 'elegant' || templateId === 'classic') ? 'serif' : 'Inter, sans-serif' }}>
          
          {/* Modern Template */}
          {templateId === 'modern' && (
            <div style={{ padding: '40px' }}>
              <div style={{ marginBottom: '40px', borderBottom: '2px solid #2563eb', paddingBottom: '30px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', margin: 0 }}>{cv.name}</h1>
                <p style={{ fontSize: '20px', color: '#2563eb', fontWeight: '600', margin: '4px 0 0 0' }}>{cv.title}</p>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px', fontSize: '13px', color: '#6b7280' }}><span>{cv.email}</span><span>•</span><span>{cv.phone}</span><span>•</span><span>{cv.location}</span></div>
              </div>
              {renderSummary('#2563eb')}
              {renderCustomSections('#2563eb')}
              {renderSkills('#2563eb')}
              {renderExperience('#2563eb')}
              {renderProjects('#2563eb')}
              {renderEducation('#2563eb')}
            </div>
          )}

          {/* Elegant Template */}
          {templateId === 'elegant' && (
            <div style={{ padding: '60px', fontFamily: 'serif' }}>
              <div style={{ textAlign: 'center', marginBottom: '40px' }}><h1 style={{ fontSize: '38px', letterSpacing: '2px', fontWeight: 'normal', textTransform: 'uppercase', marginBottom: '10px' }}>{cv.name}</h1><div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '13px', color: '#666' }}><span>{cv.location}</span><span>•</span><span>{cv.phone}</span><span>•</span><span>{cv.email}</span></div></div>
              {renderSummary('#000')}
              {renderCustomSections('#000')}
              {renderSkills('#000')}
              {renderExperience('#000')}
              {renderProjects('#000')}
              {renderEducation('#000')}
            </div>
          )}

          {/* Executive Template */}
          {templateId === 'executive' && (
            <div style={{ padding: '50px 40px', fontFamily: '"Times New Roman", Times, serif', color: '#1e293b' }}>
              <div style={{ textAlign: 'center', marginBottom: '25px', borderBottom: '2px double #cbd5e1', paddingBottom: '16px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 8px 0' }}>{cv.name}</h1>
                <p style={{ fontSize: '15px', color: '#475569', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>{cv.title}</p>
                <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', fontSize: '12px', color: '#64748b' }}>
                  <span>{cv.email}</span><span>|</span><span>{cv.phone}</span><span>|</span><span>{cv.location}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {renderSummary('#1e3a8a')}
                {renderCustomSections('#1e3a8a')}
                {renderSkills('#1e3a8a')}
                {renderExperience('#1e3a8a')}
                {renderProjects('#1e3a8a')}
                {renderEducation('#1e3a8a')}
              </div>
            </div>
          )}

          {/* Minimalist Pro Template */}
          {templateId === 'minimalist-pro' && (
            <div style={{ padding: '50px', color: '#334155', fontFamily: 'Inter, sans-serif' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '30px', marginBottom: '30px' }}>
                <div>
                  <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-0.02em', color: '#0f172a', margin: 0 }}>{cv.name}</h1>
                  <p style={{ fontSize: '16px', color: '#64748b', marginTop: '4px', margin: 0 }}>{cv.title}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                  {photo && <img src={photo} style={{ width: '80px', height: '80px', borderRadius: '16px', marginBottom: '12px', objectFit: 'cover', marginLeft: 'auto' }} />}
                  <div>{cv.email}</div>
                  <div>{cv.phone}</div>
                  <div>{cv.location}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {renderSummary('#475569')}
                {renderCustomSections('#475569')}
                {renderSkills('#475569')}
                {renderExperience('#475569')}
                {renderProjects('#475569')}
                {renderEducation('#475569')}
              </div>
            </div>
          )}

          {/* Developer Pro Template */}
          {templateId === 'developer' && (
            <div style={{ padding: '45px', color: '#0f172a', fontFamily: 'Inter, sans-serif' }}>
              <div style={{ borderLeft: '4px solid #4f46e5', paddingLeft: '20px', marginBottom: '35px' }}>
                <h1 style={{ fontSize: '34px', fontWeight: '900', color: '#0f172a', margin: 0 }}>{cv.name}</h1>
                <p style={{ fontSize: '18px', color: '#4f46e5', fontWeight: 'bold', margin: '4px 0 0 0' }}>{cv.title}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '10px', fontSize: '12px', color: '#64748b' }}>
                  <span>{cv.email}</span><span>•</span><span>{cv.phone}</span><span>•</span><span>{cv.location}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {renderSummary('#4f46e5')}
                {renderCustomSections('#4f46e5')}
                {renderSkills('#4f46e5')}
                {renderExperience('#4f46e5')}
                {renderProjects('#4f46e5')}
                {renderEducation('#4f46e5')}
              </div>
            </div>
          )}

          {/* Metro Grid Template */}
          {templateId === 'metro' && (
            <div style={{ padding: '40px', color: '#1e293b', fontFamily: 'Inter, sans-serif' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', border: '1px solid #cbd5e1', padding: '24px', borderRadius: '12px', marginBottom: '30px' }}>
                <div>
                  <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{cv.name}</h1>
                  <p style={{ fontSize: '16px', color: '#0284c7', fontWeight: '600', marginTop: '4px', margin: 0 }}>{cv.title}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
                    <span>{cv.email}</span><span>•</span><span>{cv.phone}</span><span>•</span><span>{cv.location}</span>
                  </div>
                </div>
                {photo && <img src={photo} style={{ width: '90px', height: '90px', borderRadius: '8px', objectFit: 'cover' }} />}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                {renderSummary('#0284c7')}
                {renderCustomSections('#0284c7')}
                {renderSkills('#0284c7')}
                {renderExperience('#0284c7')}
                {renderProjects('#0284c7')}
                {renderEducation('#0284c7')}
              </div>
            </div>
          )}

          {/* Accent Left Template */}
          {templateId === 'accent' && (
            <div style={{ display: 'grid', gridTemplateColumns: '8px 1fr', minHeight: '297mm', fontFamily: 'Inter, sans-serif' }}>
              <div style={{ backgroundColor: '#059669', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} />
              <div style={{ padding: '50px 40px', color: '#1f2937' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
                  <div>
                    <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#111827', margin: 0 }}>{cv.name}</h1>
                    <p style={{ fontSize: '18px', color: '#059669', fontWeight: '700', marginTop: '4px', margin: 0 }}>{cv.title}</p>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: '#4b5563' }}>
                    <p style={{ margin: 0 }}>{cv.email}</p>
                    <p style={{ margin: '4px 0 0 0' }}>{cv.phone}</p>
                    <p style={{ margin: '4px 0 0 0' }}>{cv.location}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  {renderSummary('#059669')}
                  {renderCustomSections('#059669')}
                  {renderSkills('#059669')}
                  {renderExperience('#059669')}
                  {renderProjects('#059669')}
                  {renderEducation('#059669')}
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Template */}
          {templateId === 'sidebar' && (
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: '297mm' }}>
               <div style={{ backgroundColor: '#f8fafc', padding: '40px 20px', borderRight: '1px solid #e2e8f0', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                  {photo && <img src={photo} style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 30px auto', display: 'block', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />}
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', color: '#1e293b' }}>Contact</h2>
                  <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}><p>{cv.email}</p><p>{cv.phone}</p><p>{cv.location}</p></div>
                  {renderSkills('#1e293b')}
               </div>
               <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column' }}>
                  <h1 style={{ fontSize: '40px', fontWeight: '900', color: '#1e293b', margin: 0 }}>{cv.name}</h1><p style={{ fontSize: '18px', color: '#64748b', marginBottom: '40px' }}>{cv.title}</p>
                  {renderSummary('#1e293b')}
                  {renderCustomSections('#1e293b')}
                  {renderExperience('#1e293b')}
                  {renderProjects('#1e293b')}
                  {renderEducation('#1e293b')}
               </div>
            </div>
          )}

          {/* Creative Template */}
          {templateId === 'creative' && (
            <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '297mm' }}>
              <div style={{ backgroundColor: '#2563eb', color: 'white', padding: '40px 20px', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                {photo && <img src={photo} style={{ width: '120px', height: '120px', borderRadius: '24px', objectFit: 'cover', marginBottom: '20px', border: '4px solid rgba(255,255,255,0.2)' }} />}
                <h1 style={{ fontSize: '28px', fontWeight: '900', lineHeight: '1.1', marginBottom: '10px' }}>{cv.name}</h1><p style={{ fontSize: '14px', opacity: 0.8, marginBottom: '40px' }}>{cv.title}</p>
                <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <p style={{ margin: 0 }}>{cv.email}</p>
                  <p style={{ margin: 0 }}>{cv.phone}</p>
                  <p style={{ margin: 0 }}>{cv.location}</p>
                </div>
              </div>
              <div style={{ padding: '40px', display: 'flex', flexDirection: 'column' }}>
                {renderSummary('#2563eb')}
                {renderCustomSections('#2563eb')}
                {renderSkills('#2563eb')}
                {renderExperience('#2563eb')}
                {renderProjects('#2563eb')}
                {renderEducation('#2563eb')}
              </div>
            </div>
          )}

          {/* Tech Template */}
          {templateId === 'tech' && (
            <div style={{ padding: '40px', fontFamily: 'monospace', backgroundColor: '#f8fafc', minHeight: '297mm', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
               <div style={{ border: '1px solid #e2e8f0', backgroundColor: 'white', padding: '20px' }}>
                  <h1 style={{ fontSize: '24px', margin: 0 }}>&gt; {cv.name}</h1>
                  <p style={{ color: '#2563eb' }}>{"// "}{cv.title}</p>
                  <div style={{ display: 'flex', gap: '20px', fontSize: '12px', marginTop: '10px' }}>
                    <span>@: {cv.email}</span><span>#: {cv.phone}</span><span>L: {cv.location}</span>
                  </div>
               </div>
               <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
                  {renderSummary('#2563eb')}
                  {renderCustomSections('#2563eb')}
                  {renderSkills('#2563eb')}
                  {renderExperience('#2563eb')}
                  {renderProjects('#2563eb')}
                  {renderEducation('#2563eb')}
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-0 print:hidden">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">Why use an AI CV Builder?</h2>
        <p className="text-muted-foreground leading-relaxed">
          Creating a professional CV that stands out to recruiters can be challenging. Our AI-powered CV builder simplifies this process by helping you draft compelling professional summaries, optimize your work experience descriptions, and format your layout instantly. Using advanced LLM models, the builder ensures that your achievements are highlighted clearly and concisely. With ATS-friendly templates, you can download your custom resume in high-quality PDF format, ready to submit to top employers.
        </p>
      </section>
      <section className="bg-muted/30 p-8 rounded-3xl border border-primary/5">
        <h3 className="text-xl font-black tracking-tight mb-4">ATS-Optimized Templates & LinkedIn Import</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">
          Modern employers use Applicant Tracking Systems (ATS) to scan resumes for key roles and skills. Our templates—including Modern, Elegant, Creative, Tech, and Sidebar—are engineered with correct CSS layout standards to ensure high parser readability.
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          With the &quot;Import with AI&quot; feature, you can paste raw bio or LinkedIn text, and our system automatically maps contact details (email, phone, location), work updates, education, and projects. Switch between plain text skills and visual rating bars to match the visual styling of your industry.
        </p>
      </section>
    </div>
    {showAIParserModal && (
      <AIParserModal
        initialText={initialParserText}
        creditsRemaining={creditsRemaining}
        onApply={handleApplyAIData}
        onClose={() => setShowAIParserModal(false)}
      />
    )}
    {showUpgradeModal && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300" 
          onClick={() => setShowUpgradeModal(false)} 
        />
        <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border bg-background p-8 shadow-2xl animate-in zoom-in-95 duration-300">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 h-8 w-8 rounded-full" 
            onClick={() => setShowUpgradeModal(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <Crown className="h-8 w-8 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight">
                {upgradeModalType === "print" ? "Print Limit Reached" : "Premium Template"}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-xs">
                {upgradeModalType === "print" 
                  ? "You have reached your limit of 3 free resume exports this month. Upgrade to Pro or Business to print unlimited high-quality PDFs!"
                  : "This stunning layout is a premium feature. Upgrade to the Pro or Business tier to access all resume templates and premium tools."
                }
              </p>
            </div>
            <div className="grid gap-3 pt-2">
              <Button size="lg" className="h-11 font-black text-xs shadow-xl shadow-primary/20" asChild>
                <Link href="/pricing" onClick={() => setShowUpgradeModal(false)}>
                  View Pro Plans <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                className="font-bold text-xs text-muted-foreground" 
                onClick={() => setShowUpgradeModal(false)}
              >
                Maybe later
              </Button>
            </div>
          </div>
        </div>
      </div>
    )}
    {/* Save Modal */}
    {isSaveModalOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300" 
          onClick={() => setIsSaveModalOpen(false)} 
        />
        <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 h-8 w-8 rounded-full" 
            onClick={() => setIsSaveModalOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Save className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black">Save Resume Progress</h3>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase font-black text-muted-foreground">Resume Title</Label>
              <Input 
                value={saveTitle} 
                onChange={e => setSaveTitle(e.target.value)}
                placeholder="My Software Engineer Resume"
                className="h-10 text-xs"
              />
            </div>
            <Button 
              onClick={() => handleSaveResume()} 
              disabled={isSavingResume || !saveTitle}
              className="w-full h-11 font-black"
            >
              {isSavingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save to Cloud"}
            </Button>
          </div>
        </div>
      </div>
    )}

    {/* Load Modal */}
    {isLoadModalOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300" 
          onClick={() => setIsLoadModalOpen(false)} 
        />
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 h-8 w-8 rounded-full" 
            onClick={() => setIsLoadModalOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black">My Saved Resumes</h3>
            </div>
            
            {isLoadingResumesList ? (
              <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : savedResumesList.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No saved resumes found. Click Save to create one.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {savedResumesList.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/40 transition-all">
                    <div className="truncate pr-4">
                      <p className="text-xs font-black truncate">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(r.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="secondary" onClick={() => handleLoadResume(r.id)} className="h-8 text-[10px] font-bold">
                        Load
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteResume(r.id)} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </>)
}
