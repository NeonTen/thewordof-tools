"use client"

import React, { useState } from "react"
import { Download, Loader2, Sparkles, Plus, Trash2, User, Layout, Image as ImageIcon, Crown, Star, AlignLeft, BarChart3, ArrowRight, X, Save, FolderOpen, Eye, FolderGit2, GraduationCap, Briefcase } from "lucide-react"
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
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

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
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

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

interface SavedResumeItem {
  id: string
  title: string
  updatedAt: string
  data?: Record<string, unknown>
}

  const [activeResumeId, setActiveResumeId] = useState<string | null>(null)
  const [savedResumesList, setSavedResumesList] = useState<SavedResumeItem[]>([])
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

    // Map summaryHeading
    if (data.summaryHeading) {
      setHeadings(prev => ({ ...prev, summary: data.summaryHeading || prev.summary }))
    }

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

    // Map customSections
    if (data.customSections && data.customSections.length > 0) {
      setCustomSections(data.customSections.map((cs, idx: number) => ({
        id: (Date.now() + idx + Math.random()).toString(),
        title: cs.title || "Additional Section",
        content: cs.content || ""
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
          const loadedData = resume.data as Record<string, any>
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

  const renderTemplateContent = () => (
    <>
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
              {photo && <img src={photo} style={{ width: '80px', height: '80px', borderRadius: '16px', marginBottom: '12px', objectFit: 'cover', marginLeft: 'auto' }} alt="Profile" />}
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
            {photo && <img src={photo} style={{ width: '90px', height: '90px', borderRadius: '8px', objectFit: 'cover' }} alt="Profile" />}
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
              {photo && <img src={photo} style={{ width: '140px', height: '140px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 30px auto', display: 'block', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} alt="Profile" />}
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
            {photo && <img src={photo} style={{ width: '120px', height: '120px', borderRadius: '24px', objectFit: 'cover', marginBottom: '20px', border: '4px solid rgba(255,255,255,0.2)' }} alt="Profile" />}
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

    <div className="flex flex-col gap-6 print:block print:w-full">
      {!isPro && (
        <div className="print:hidden flex justify-end -mb-2">
          <span className="text-xs font-bold text-muted-foreground bg-muted px-4 py-1.5 rounded-full">
            {MAX_FREE_PRINTS - usedThisMonth} of {MAX_FREE_PRINTS} free exports left this month
          </span>
        </div>
      )}

      {/* Sticky Unified Top Toolbar */}
      <div className="sticky top-14 z-30 bg-background/95 backdrop-blur border p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-sm print:hidden">
        {/* Left Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
            <SelectTrigger className="w-[170px] h-9 text-xs font-bold capitalize">
              <SelectValue placeholder="Select Template" />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATES.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs capitalize">
                  {t.name}{t.pro && <Crown className="h-3 w-3 text-amber-500 inline ml-1" />}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Photo Uploader */}
          <ProGate feature="User Photo" isPro={isPro}>
            <div className="flex items-center gap-2">
              {photo ? (
                <div className="relative group">
                  <img src={photo} alt="Profile" className="h-9 w-9 rounded-full object-cover border-2 border-primary/20" />
                  <button onClick={() => setPhoto(null)} className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex items-center gap-1.5 px-3 h-9 rounded-xl border border-input bg-background hover:bg-accent text-xs font-bold transition-colors">
                  <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" /> Add Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              )}
            </div>
          </ProGate>

          {/* Skill Mode Toggle */}
          <ProGate feature="Skill Bars" isPro={isPro}>
            <Tabs value={skillMode} onValueChange={(val) => setSkillMode(val as 'text' | 'bars')}>
              <TabsList className="h-9">
                <TabsTrigger value="text" className="text-[10px] uppercase font-bold px-2.5"><AlignLeft className="h-3 w-3 mr-1" /> Text</TabsTrigger>
                <TabsTrigger value="bars" className="text-[10px] uppercase font-bold px-2.5"><BarChart3 className="h-3 w-3 mr-1" /> Bars</TabsTrigger>
              </TabsList>
            </Tabs>
          </ProGate>
        </div>

        {/* Right Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <ProGate feature="AI Resume Parser" isPro={isPro}>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowAIParserModal(true)} 
              className="font-bold border-purple-500/20 hover:bg-purple-500/5 text-purple-600 dark:text-purple-400 gap-1.5 h-9 text-xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-500 animate-pulse" /> AI Import
            </Button>
          </ProGate>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsPreviewOpen(true)} 
            className="gap-1.5 font-bold h-9 text-xs bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
          >
            <Eye className="h-3.5 w-3.5" /> Preview CV
          </Button>

          <ProGate feature="Cloud Save" isPro={isPro}>
            <div className="flex gap-1.5">
              <Button variant="outline" size="sm" onClick={async () => { await handleFetchResumes(); setIsLoadModalOpen(true); }} className="font-bold h-9 px-3 text-xs">
                <FolderOpen className="h-3.5 w-3.5 mr-1" /> Load
              </Button>
              <Button variant="outline" size="sm" onClick={() => { if (activeResumeId) handleSaveResume(saveTitle); else { setSaveTitle(cv.name ? `${cv.name} Resume` : "My Resume"); setIsSaveModalOpen(true); } }} className="font-bold h-9 px-3 text-xs">
                <Save className="h-3.5 w-3.5 mr-1" /> Save
              </Button>
            </div>
          </ProGate>

          <Button size="sm" onClick={handlePrint} className="bg-primary font-bold shadow-sm h-9 px-4 text-xs">
            <Download className="mr-1.5 h-3.5 w-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Full-Width Accordion Editor Area */}
      <div className="w-full space-y-4 print:hidden">
        <Accordion multiple defaultValue={["personal", "summary", "experience"]} className="space-y-4 w-full">
          {/* Section 1: Personal Details */}
          <AccordionItem value="personal" className="border rounded-2xl bg-card px-5 py-1">
            <AccordionTrigger className="hover:no-underline font-bold text-base">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Personal Details
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Full Name</Label><Input name="name" value={cv.name} onChange={handleCvChange} /></div>
                <div className="space-y-2"><Label>Professional Title</Label><Input name="title" value={cv.title} onChange={handleCvChange} /></div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Email</Label><Input name="email" value={cv.email} onChange={handleCvChange} /></div>
                <div className="space-y-2"><Label>Phone</Label><Input name="phone" value={cv.phone} onChange={handleCvChange} /></div>
              </div>
              <div className="space-y-2"><Label>Location</Label><Input name="location" value={cv.location} onChange={handleCvChange} /></div>
            </AccordionContent>
          </AccordionItem>

          {/* Section 2: Summary */}
          <AccordionItem value="summary" className="border rounded-2xl bg-card px-5 py-1">
            <AccordionTrigger className="hover:no-underline font-bold text-base">
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <Layout className="h-4 w-4 text-primary" />
                <Input 
                  value={headings.summary} 
                  onChange={e => updateHeading('summary', e.target.value)} 
                  className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]" 
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-3">
              <div className="flex justify-end">
                <Button size="sm" variant="secondary" onClick={generateAISummary} disabled={isGeneratingAI} className="font-bold text-xs">
                  {isGeneratingAI ? <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 mr-1.5" />}
                  AI Write
                </Button>
              </div>
              <Textarea name="summary" value={cv.summary} onChange={handleCvChange} rows={4} />
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Tip: Start lines with &quot;-&quot; or &quot;&bull;&quot; to auto-format bullet lists, or use line breaks for paragraphs.
              </p>
            </AccordionContent>
          </AccordionItem>

          {/* Section 3: Pro Custom Content Sections */}
          <AccordionItem value="custom-sections" className="border rounded-2xl bg-card px-5 py-1">
            <AccordionTrigger className="hover:no-underline font-bold text-base">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" /> Additional Custom Sections
                  <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">
                    {customSections.length} {customSections.length === 1 ? 'Section' : 'Sections'}
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Add custom sections like Certifications, Languages, Publications, or Key Achievements.</p>
                <ProGate feature="Custom Sections" isPro={isPro}>
                  <Button size="sm" variant="outline" onClick={addCustomSection} className="gap-1.5 font-bold text-xs">
                    <Plus className="h-3.5 w-3.5" /> Add Section
                  </Button>
                </ProGate>
              </div>

              {customSections.length === 0 ? (
                <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                  No additional custom sections added yet. Click &quot;Add Section&quot; above to create one.
                </div>
              ) : (
                customSections.map(cs => (
                  <Card key={cs.id} className="border-primary/20">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <Input
                        value={cs.title}
                        onChange={e => updateCustomSection(cs.id, 'title', e.target.value)}
                        placeholder="Section Title (e.g. Certifications)"
                        className="font-bold text-sm bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[240px]"
                      />
                      <Button size="sm" variant="ghost" onClick={() => removeCustomSection(cs.id)} className="h-8 px-2 text-destructive hover:bg-destructive/10 gap-1 text-xs font-bold">
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={cs.content}
                        onChange={e => updateCustomSection(cs.id, 'content', e.target.value)}
                        placeholder="Enter section content or bullet points..."
                        rows={3}
                        className="text-xs"
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Section 4: Skills & Expertise */}
          <AccordionItem value="skills" className="border rounded-2xl bg-card px-5 py-1">
            <AccordionTrigger className="hover:no-underline font-bold text-base">
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <BarChart3 className="h-4 w-4 text-primary" />
                <Input 
                  value={headings.skills} 
                  onChange={e => updateHeading('skills', e.target.value)} 
                  className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]" 
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-4">
              {skillMode === 'text' ? (
                <Textarea 
                  name="skillsText" 
                  value={cv.skillsText} 
                  onChange={handleCvChange} 
                  placeholder="React.js, Next.js, TypeScript, Node.js, Tailwind CSS, PostgreSQL" 
                  rows={3} 
                />
              ) : (
                <div className="space-y-4">
                  <Button size="sm" variant="outline" className="w-full" onClick={addSkill}><Plus className="h-4 w-4 mr-2" /> Add Skill with Rating</Button>
                  {skills.map((s) => (
                    <div key={s.id} className="flex flex-col gap-3 p-3 border rounded-xl bg-muted/20">
                      <div className="flex items-center gap-3">
                        <Input placeholder="Skill Name" value={s.name} onChange={e => updateSkill(s.id, 'name', e.target.value)} className="h-8 flex-1" />
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-destructive hover:bg-destructive/10 font-bold text-xs gap-1" onClick={() => removeSkill(s.id)}>
                          <Trash2 className="h-3.5 w-3.5" /> Remove
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
            </AccordionContent>
          </AccordionItem>

          {/* Section 5: Experience */}
          <AccordionItem value="experience" className="border rounded-2xl bg-card px-5 py-1">
            <AccordionTrigger className="hover:no-underline font-bold text-base">
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <Briefcase className="h-4 w-4 text-primary" />
                <Input 
                  value={headings.experience} 
                  onChange={e => updateHeading('experience', e.target.value)} 
                  className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]" 
                />
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-1">
                  {experience.length} {experience.length === 1 ? 'Role' : 'Roles'}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-4">
              <div className="flex justify-end">
                <Button size="sm" variant="outline" onClick={addExperience} className="font-bold text-xs">
                  <Plus className="mr-1 h-3.5 w-3.5" /> Add Role
                </Button>
              </div>
              {experience.map((exp, idx) => (
                <div key={exp.id} className={cn("space-y-3 p-4 rounded-xl border bg-muted/20", idx > 0 && "mt-3")}>
                  <div className="flex items-center justify-between gap-2 border-b pb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">Role #{idx + 1}</span>
                    {experience.length > 1 && (
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive hover:bg-destructive/10 gap-1 text-[11px] font-bold" onClick={() => removeExperience(exp.id)}>
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <Input placeholder="Company Name" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                    <Input placeholder="Role / Job Title" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} />
                  </div>
                  <Input placeholder="Period (e.g. Jan 2022 - Present)" value={exp.period} onChange={e => updateExperience(exp.id, 'period', e.target.value)} />
                  <Textarea placeholder="Key responsibilities and achievements..." value={exp.desc} onChange={e => updateExperience(exp.id, 'desc', e.target.value)} rows={3} />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Section 6: Projects */}
          <AccordionItem value="projects" className="border rounded-2xl bg-card px-5 py-1">
            <AccordionTrigger className="hover:no-underline font-bold text-base">
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <FolderGit2 className="h-4 w-4 text-primary" />
                <Input 
                  value={headings.projects} 
                  onChange={e => updateHeading('projects', e.target.value)} 
                  className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]" 
                />
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-1">
                  {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-4">
              <div className="flex justify-end">
                <ProGate feature="Projects Section" isPro={isPro}>
                  <Button size="sm" variant="outline" onClick={addProject} className="font-bold text-xs">
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Project
                  </Button>
                </ProGate>
              </div>
              <ProGate feature="Projects Section" isPro={isPro}>
                {projects.map((proj, idx) => (
                  <div key={proj.id} className={cn("space-y-3 p-4 rounded-xl border bg-muted/20", idx > 0 && "mt-3")}>
                    <div className="flex items-center justify-between gap-2 border-b pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Project #{idx + 1}</span>
                      {projects.length > 1 && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive hover:bg-destructive/10 gap-1 text-[11px] font-bold" onClick={() => removeProject(proj.id)}>
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input placeholder="Project Title" value={proj.title} onChange={e => updateProject(proj.id, 'title', e.target.value)} />
                      <Input placeholder="Project Link" value={proj.link} onChange={e => updateProject(proj.id, 'link', e.target.value)} />
                    </div>
                    <Textarea placeholder="Project summary..." value={proj.desc} onChange={e => updateProject(proj.id, 'desc', e.target.value)} rows={2} />
                  </div>
                ))}
              </ProGate>
            </AccordionContent>
          </AccordionItem>

          {/* Section 7: Education */}
          <AccordionItem value="education" className="border rounded-2xl bg-card px-5 py-1">
            <AccordionTrigger className="hover:no-underline font-bold text-base">
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <GraduationCap className="h-4 w-4 text-primary" />
                <Input 
                  value={headings.education} 
                  onChange={e => updateHeading('education', e.target.value)} 
                  className="font-bold text-base bg-transparent border-dashed h-8 px-2 focus:bg-background w-auto max-w-[200px]" 
                />
                <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-1">
                  {education.length} {education.length === 1 ? 'Entry' : 'Entries'}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4 space-y-4">
              <div className="flex justify-end">
                <ProGate feature="Multiple Degrees" isPro={isPro}>
                  <Button size="sm" variant="outline" onClick={addEducation} className="font-bold text-xs">
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Degree
                  </Button>
                </ProGate>
              </div>
              <ProGate feature="Multiple Degrees" isPro={isPro}>
                {education.map((edu, idx) => (
                  <div key={edu.id} className={cn("space-y-3 p-4 rounded-xl border bg-muted/20", idx > 0 && "mt-3")}>
                    <div className="flex items-center justify-between gap-2 border-b pb-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Education #{idx + 1}</span>
                      {education.length > 1 && (
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-destructive hover:bg-destructive/10 gap-1 text-[11px] font-bold" onClick={() => removeEducation(edu.id)}>
                          <Trash2 className="h-3.5 w-3.5" /> Remove
                        </Button>
                      )}
                    </div>
                    <Input placeholder="School / University Name" value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input placeholder="Degree / Certification" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                      <Input placeholder="Period (e.g. 2018 - 2022)" value={edu.period} onChange={e => updateEducation(edu.id, 'period', e.target.value)} />
                    </div>
                  </div>
                ))}
              </ProGate>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Hidden Print-Only Paper Container */}
      <div className="hidden print:block print:w-full print:m-0 print:p-0">
        <div className="bg-white text-black print:shadow-none print:m-0 overflow-hidden relative mx-auto print-full-width"
          style={{ width: '100%', maxWidth: '210mm', minHeight: '297mm', backgroundColor: '#ffffff', color: '#000000', fontFamily: (templateId === 'elegant' || templateId === 'classic') ? 'serif' : 'Inter, sans-serif' }}>
          {renderTemplateContent()}
        </div>
      </div>
    </div>

    {/* Full Live CV Preview Modal Overlay */}
    {isPreviewOpen && (
      <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex flex-col no-print animate-in fade-in duration-200">
        {/* Preview Modal Header */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-3 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-primary" />
            <h3 className="font-black text-lg">CV Live Preview</h3>
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
              <SelectTrigger className="w-[170px] h-8 text-xs font-bold capitalize">
                <SelectValue placeholder="Modern" />
              </SelectTrigger>
              <SelectContent>
                {TEMPLATES.map(t => (
                  <SelectItem key={t.id} value={t.id} className="text-xs capitalize">
                    {t.name}{t.pro && <Crown className="h-3 w-3 text-amber-500 inline ml-1" />}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handlePrint} className="bg-primary font-bold shadow-sm h-8 px-4 text-xs">
              <Download className="mr-1.5 h-3.5 w-3.5" /> Export PDF
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsPreviewOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Paper Preview Canvas */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex justify-center bg-muted/40 custom-scrollbar">
          <div className="bg-white text-black shadow-2xl overflow-hidden relative print-full-width my-auto" style={{ width: '100%', maxWidth: '210mm', minHeight: '297mm', backgroundColor: '#ffffff', color: '#000000', fontFamily: (templateId === 'elegant' || templateId === 'classic') ? 'serif' : 'Inter, sans-serif' }}>
            {renderTemplateContent()}
          </div>
        </div>
      </div>
    )}

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
