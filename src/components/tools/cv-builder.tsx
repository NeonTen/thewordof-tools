"use client"

import React, { useState } from "react"
import { Download, Loader2, Sparkles, Plus, Trash2, User, Layout, Image as ImageIcon, Crown, Star, AlignLeft, BarChart3, ArrowRight, X } from "lucide-react"
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
  { id: 'minimal', name: 'minimalist', pro: true },
  { id: 'creative', name: 'creative', pro: true },
  { id: 'tech', name: 'compact (tech)', pro: true },
  { id: 'bold', name: 'bold', pro: true },
  { id: 'sidebar', name: 'sidebar', pro: true },
  { id: 'futuristic', name: 'futuristic', pro: true },
  { id: 'classic', name: 'classic', pro: true },
  { id: 'startup', name: 'startup', pro: true },
]

const generateUniqueId = () => Date.now() + Math.random()

export function CvBuilder({ isPro = false, isBusiness = false }: { isPro?: boolean; isBusiness?: boolean }) {
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const [templateId, setTemplateId] = useState('modern')
  const [photo, setPhoto] = useState<string | null>(null)
  const [skillMode, setSkillMode] = useState<'text' | 'bars'>('text')
  const [showAIParserModal, setShowAIParserModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [upgradeModalType, setUpgradeModalType] = useState<"template" | "print">("template")

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

  // Rendering Helpers
  const getHeadingStyle = (title: string, accentColor: string) => {
    const base: React.CSSProperties = {
      fontSize: '14px',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '12px',
      color: templateId === 'futuristic' ? 'white' : '#111827',
      display: 'block',
    }

    if (templateId === 'modern' || templateId === 'creative' || templateId === 'classic') {
      return { ...base, borderBottom: `2px solid ${accentColor}`, paddingBottom: '4px' }
    }
    if (templateId === 'elegant') {
      return { ...base, borderBottom: `1px solid ${accentColor}`, paddingBottom: '6px', textAlign: 'center' as const, fontWeight: 'normal' }
    }
    if (templateId === 'bold') {
      return { ...base, borderLeft: `4px solid ${accentColor}`, paddingLeft: '15px', marginBottom: '15px' }
    }
    if (templateId === 'sidebar') {
      return { ...base, fontSize: '16px', borderBottom: `1px solid ${accentColor}`, paddingBottom: '4px' }
    }
    if (templateId === 'futuristic') {
      return { ...base, color: '#38bdf8', fontSize: '14px', letterSpacing: '2px', border: 'none' }
    }
    if (templateId === 'startup') {
      if (title === 'Contact' || title === 'Skills') {
        return { ...base, fontSize: '14px', color: '#64748b', marginBottom: '12px', border: 'none' }
      }
      return { ...base, fontSize: '20px', color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: '4px', textTransform: 'none' as const }
    }
    if (templateId === 'tech') {
      return { ...base, fontFamily: 'monospace', color: accentColor, textTransform: 'none' as const, border: 'none' }
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

  const renderSummary = (accentColor = '#2563eb') => 
    renderSection("Summary", 
      <p style={{ 
        fontSize: '14px', 
        lineHeight: '1.6', 
        color: templateId === 'futuristic' ? 'rgba(255,255,255,0.8)' : '#374151',
        margin: 0,
        textAlign: templateId === 'elegant' ? 'center' : 'left' as const,
        fontStyle: (templateId === 'elegant' || templateId === 'minimal') ? 'italic' : 'normal'
      }}>
        {templateId === 'tech' ? `/* ${cv.summary} */` : cv.summary}
      </p>, 
      accentColor
    )

  const renderSkills = (accentColor = '#2563eb') => 
    renderSection("Skills", 
      skillMode === 'text' ? (
        <p style={{ fontSize: '14px', color: templateId === 'futuristic' ? 'rgba(255,255,255,0.8)' : '#374151', margin: 0 }}>{cv.skillsText}</p>
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
                  <span style={{ color: templateId === 'futuristic' ? 'white' : 'inherit' }}>{s.name}</span>
                  <span style={{ color: templateId === 'futuristic' ? 'rgba(255,255,255,0.6)' : 'inherit' }}>{s.rating}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: templateId === 'futuristic' ? 'rgba(255,255,255,0.1)' : '#f1f5f9', borderRadius: '3px', overflow: 'hidden', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
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
    renderSection("Experience", 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {experience.map(e => {
          if (templateId === 'tech') {
            return <div key={e.id} style={{ paddingLeft: '20px', color: '#334155', fontSize: '13px' }}><p style={{ margin: 0 }}>{`{ role: "${e.role}", company: "${e.company}", desc: "${e.desc}" },`}</p></div>
          }
          if (templateId === 'futuristic') {
            return (
              <div key={e.id} style={{ borderLeft: '2px solid rgba(56,189,248,0.3)', paddingLeft: '20px', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-5px', top: '6px', width: '8px', height: '8px', backgroundColor: '#38bdf8', borderRadius: '50%', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} />
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{e.role}</div>
                <div style={{ fontSize: '13px', color: 'rgba(56,189,248,0.7)' }}>{e.company} / {e.period}</div>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', marginTop: '8px', margin: 0 }}>{e.desc}</p>
              </div>
            )
          }
          return (
            <div key={e.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span style={{ color: templateId === 'futuristic' ? 'white' : 'inherit' }}>{e.role} {templateId === 'elegant' ? '|' : '@'} {e.company}</span>
                <span style={{ fontSize: '12px', color: '#666', fontWeight: 'normal' }}>{e.period}</span>
              </div>
              <p style={{ fontSize: '13px', color: '#4b5563', marginTop: '4px', margin: 0 }}>{e.desc}</p>
            </div>
          )
        })}
      </div>, 
      accentColor
    )

  const renderProjects = (accentColor = '#2563eb') => 
    projects.length > 0 && renderSection("Projects", 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {projects.map(p => {
          if (templateId === 'tech') {
            return <div key={p.id} style={{ paddingLeft: '20px', color: '#334155', fontSize: '13px' }}><p style={{ margin: 0 }}>{`{ title: "${p.title}", link: "${p.link}", desc: "${p.desc}" },`}</p></div>
          }
          return (
            <div key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontWeight: '600', color: templateId === 'futuristic' ? '#38bdf8' : '#111827', margin: 0, fontSize: '14px' }}>{p.title}</h3>
                <span style={{ fontSize: '12px', color: accentColor }}>{p.link}</span>
              </div>
              <p style={{ fontSize: '14px', color: templateId === 'futuristic' ? 'rgba(255,255,255,0.6)' : '#374151', margin: '4px 0 0 0' }}>{p.desc}</p>
            </div>
          )
        })}
      </div>, 
      accentColor
    )

  const renderEducation = (accentColor = '#2563eb') => 
    education.length > 0 && renderSection("Education", 
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {education.map(edu => {
          if (templateId === 'tech') {
            return <div key={edu.id} style={{ paddingLeft: '20px', color: '#334155', fontSize: '13px' }}><p style={{ margin: 0 }}>{`{ school: "${edu.school}", degree: "${edu.degree}", period: "${edu.period}" },`}</p></div>
          }
          return (
            <div key={edu.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <span style={{ color: templateId === 'futuristic' ? 'white' : 'inherit' }}>{edu.school}</span>
                <span style={{ color: templateId === 'futuristic' ? 'rgba(255,255,255,0.4)' : '#6b7280', fontSize: '12px', fontWeight: 'normal' }}>{edu.period}</span>
              </div>
              <p style={{ fontSize: '13px', color: templateId === 'futuristic' ? 'rgba(255,255,255,0.6)' : '#4b5563', margin: 0 }}>{edu.degree}</p>
            </div>
          )
        })}
      </div>, 
      accentColor
    )

  return (<>
    {/* Global Print Styles to fix margins */}
    <style dangerouslySetInnerHTML={{ __html: `
      @media print {
        @page { 
          margin: 0; 
          size: auto;
        }
        body { 
          margin: 0; 
          -webkit-print-color-adjust: exact !important; 
          print-color-adjust: exact !important;
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

    <div className="grid lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_600px] gap-8 print:block print:w-full">
      {/* Editor Panel */}
      <div className="space-y-6 print:hidden">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Details</CardTitle>
            <div className="flex items-center gap-3">
              <ProGate feature="AI Resume Parser" isPro={isBusiness} tier="business">
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
            <CardTitle>Summary</CardTitle>
            <Button size="sm" variant="secondary" onClick={generateAISummary} disabled={isGeneratingAI}>
              {isGeneratingAI ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
              AI Write
            </Button>
          </CardHeader>
          <CardContent><Textarea name="summary" value={cv.summary} onChange={handleCvChange} rows={4} /></CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Skills & Expertise</CardTitle>
            <ProGate feature="Skill Bars" isPro={isPro}>
              <Tabs value={skillMode} onValueChange={(val) => setSkillMode(val as 'text' | 'bars')}>
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
            <CardTitle>Experience</CardTitle>
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
                  <Textarea value={exp.desc} onChange={e => updateExperience(exp.id, 'desc', e.target.value)} rows={3} />
                </div>
              ))}
            </ProGate>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Projects</CardTitle>
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
                  <Textarea placeholder="Project summary..." value={p.desc} onChange={e => updateProject(p.id, 'desc', e.target.value)} rows={2} />
                </div>
              ))}
            </ProGate>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Education</CardTitle>
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
          <div className="flex justify-between items-center bg-card p-4 rounded-2xl border shadow-sm mb-4">
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
            <div className="flex items-center gap-3">
              {!isPro && (
                <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                  {MAX_FREE_PRINTS - usedThisMonth} of {MAX_FREE_PRINTS} free exports left this month
                </span>
              )}
              <Button onClick={handlePrint} className="bg-primary shadow-lg shadow-primary/20">
                <Download className="mr-2 h-4 w-4" /> Export PDF
              </Button>
            </div>
          </div>
        </div>
        
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
              {renderSkills('#000')}
              {renderExperience('#000')}
              {renderProjects('#000')}
              {renderEducation('#000')}
            </div>
          )}

          {/* Minimalist */}
          {templateId === 'minimal' && (
            <div style={{ padding: '60px' }}>
               <h1 style={{ fontSize: '42px', fontWeight: '300', margin: 0 }}>{cv.name}</h1>
               <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '40px', marginTop: '40px' }}>
                  <div style={{ fontSize: '12px', color: '#999', lineHeight: '2' }}>
                    {photo && <img src={photo} style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '20px', objectFit: 'cover' }} />}
                    <p>{cv.email}</p>
                    <p>{cv.phone}</p>
                    <p>{cv.location}</p>
                  </div>
                  <div>
                    {renderSummary()}
                    {renderSkills()}
                    {renderExperience()}
                    {renderProjects()}
                    {renderEducation()}
                  </div>
               </div>
            </div>
          )}

          {/* Bold Template */}
          {templateId === 'bold' && (
            <div style={{ minHeight: '297mm' }}>
              <div style={{ backgroundColor: '#111827', color: 'white', padding: '60px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                <div>
                  <h1 style={{ fontSize: '48px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-1px' }}>{cv.name}</h1>
                  <p style={{ fontSize: '20px', color: '#3b82f6', fontWeight: 'bold' }}>{cv.title}</p>
                </div>
                {photo && <img src={photo} style={{ width: '120px', height: '120px', borderRadius: '12px', border: '4px solid #3b82f6', objectFit: 'cover' }} />}
              </div>
              <div style={{ padding: '40px', display: 'grid', gridTemplateColumns: '1fr 250px', gap: '40px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {renderSummary('#3b82f6')}
                  {renderExperience('#3b82f6')}
                  {renderProjects('#3b82f6')}
                  {renderEducation('#3b82f6')}
                </div>
                <div style={{ backgroundColor: '#f3f4f6', padding: '20px', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Contact</h3>
                  <p style={{ fontSize: '12px', margin: '0 0 20px 0' }}>{cv.email}<br/>{cv.phone}<br/>{cv.location}</p>
                  {renderSkills('#3b82f6')}
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
                  {renderExperience('#1e293b')}
                  {renderProjects('#1e293b')}
                  {renderEducation('#1e293b')}
               </div>
            </div>
          )}

          {/* Futuristic Template */}
          {templateId === 'futuristic' && (
            <div style={{ backgroundColor: '#020617', color: 'white', minHeight: '297mm', padding: '60px 40px', position: 'relative', overflow: 'hidden', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
               <div style={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)' }} />
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(56,189,248,0.3)', paddingBottom: '30px', marginBottom: '40px' }}>
                  <div><h1 style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '-2px', margin: 0, background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{cv.name}</h1><p style={{ fontSize: '20px', color: '#38bdf8', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '5px' }}>{cv.title}</p></div>
                  <div style={{ textAlign: 'right', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
                    <p style={{ margin: 0 }}>{cv.email}</p>
                    <p style={{ margin: '4px 0 0 0' }}>{cv.phone}</p>
                    <p style={{ margin: '4px 0 0 0' }}>{cv.location}</p>
                  </div>
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '60px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {renderSummary('#38bdf8')}
                    {renderExperience('#38bdf8')}
                    {renderProjects('#38bdf8')}
                    {renderEducation('#38bdf8')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {renderSkills('#38bdf8')}
                  </div>
               </div>
            </div>
          )}

          {/* Classic Template */}
          {templateId === 'classic' && (
            <div style={{ padding: '60px', fontFamily: '"Times New Roman", Times, serif' }}>
               <div style={{ textAlign: 'center', borderBottom: '1px solid #000', paddingBottom: '10px', marginBottom: '30px' }}><h1 style={{ fontSize: '36px', margin: 0 }}>{cv.name}</h1><p style={{ fontSize: '14px' }}>{cv.email} | {cv.phone} | {cv.location}</p></div>
               {renderSummary('#000')}
               {renderSkills('#000')}
               {renderExperience('#000')}
               {renderProjects('#000')}
               {renderEducation('#000')}
            </div>
          )}

          {/* Startup Template */}
          {templateId === 'startup' && (
            <div style={{ padding: '40px' }}>
               <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
                 {photo && <img src={photo} style={{ width: '120px', height: '120px', borderRadius: '30px', objectFit: 'cover' }} />}
                 <div>
                   <h1 style={{ fontSize: '40px', fontWeight: 'black', letterSpacing: '-1.5px', color: '#0f172a' }}>{cv.name}</h1>
                   <p style={{ fontSize: '18px', color: '#6366f1', fontWeight: 'bold' }}>{cv.title}</p>
                 </div>
               </div>
               
               <div style={{ width: '100%', marginBottom: '40px' }}>
                 {renderSummary('#6366f1')}
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                  <div>
                    {renderExperience('#6366f1')}
                    {renderProjects('#6366f1')}
                    {renderEducation('#6366f1')}
                  </div>
                  <div>
                    {renderSection("Contact", 
                      <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <p style={{ margin: 0 }}>{cv.email}</p>
                        <p style={{ margin: 0 }}>{cv.phone}</p>
                        <p style={{ margin: 0 }}>{cv.location}</p>
                      </div>,
                      '#64748b'
                    )}
                    {renderSkills('#6366f1')}
                  </div>
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

    {/* SEO Section */}
    <div className="grid md:grid-cols-2 gap-12 mt-16 border-t pt-12 pb-20 print:hidden">
      <section>
        <h2 className="text-2xl font-black tracking-tight mb-4">Why use an AI CV Builder?</h2>
        <p className="text-muted-foreground">Professional CVs are the key to landing high-paying jobs. Our AI helps you craft the perfect summary and experience descriptions tailored to your industry.</p>
      </section>
    </div>
    {showAIParserModal && (
      <AIParserModal
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
  </>)
}
