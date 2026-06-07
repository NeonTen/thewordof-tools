"use client"
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef } from "react"
import { 
  Plus, 
  Trash2, 
  Printer, 
  Bold as BoldIcon, 
  Italic as ItalicIcon, 
  Underline as UnderlineIcon, 
  Link as LinkIcon, 
  List as ListIcon, 
  ListOrdered, 
  Eraser 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TaskRow {
  id: string
  taskName: string
  updateText: string
  projectedDate: string
  hours: number
  minutes: number
}

interface RichTextEditorProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ""
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, arg = "") => {
    document.execCommand("defaultParagraphSeparator", false, "p")
    document.execCommand(command, false, arg)
    handleInput()
  }

  const clearFormat = () => {
    document.execCommand("removeFormat", false)
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      let node = selection.anchorNode
      let isInList = false
      while (node && node.nodeName !== "DIV" && node.nodeName !== "BODY") {
        if (node.nodeName === "LI" || node.nodeName === "UL" || node.nodeName === "OL") {
          isInList = true
          break
        }
        node = node.parentNode
      }
      if (isInList) {
        document.execCommand("insertUnorderedList", false)
      }
    }
    handleInput()
  }

  const addLink = () => {
    const url = prompt("Enter URL:", "https://")
    if (url) {
      execCommand("createLink", url)
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        let parent = selection.anchorNode?.parentElement
        while (parent && parent.tagName !== "A" && parent.tagName !== "DIV") {
          parent = parent.parentElement
        }
        if (parent && parent.tagName === "A") {
          parent.setAttribute("style", "color:#1d4ed8;text-decoration:underline;")
          parent.setAttribute("target", "_blank")
        }
      }
      handleInput()
    }
  }

  return (
    <div className="border border-border rounded-lg bg-background/50 overflow-hidden flex flex-col focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-muted/40 border-b border-border/40 text-muted-foreground select-none">
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-1.5 rounded hover:bg-muted hover:text-foreground transition-colors"
          title="Bold"
        >
          <BoldIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-1.5 rounded hover:bg-muted hover:text-foreground transition-colors"
          title="Italic"
        >
          <ItalicIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-1.5 rounded hover:bg-muted hover:text-foreground transition-colors"
          title="Underline"
        >
          <UnderlineIcon className="h-3.5 w-3.5" />
        </button>
        <div className="w-px h-4 bg-border/50 mx-1" />
        <button
          type="button"
          onClick={addLink}
          className="p-1.5 rounded hover:bg-muted hover:text-foreground transition-colors text-primary"
          title="Insert Link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-1.5 rounded hover:bg-muted hover:text-foreground transition-colors"
          title="Bullet List"
        >
          <ListIcon className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="p-1.5 rounded hover:bg-muted hover:text-foreground transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={clearFormat}
          className="p-1.5 rounded hover:bg-muted hover:text-foreground transition-colors text-destructive/80"
          title="Clear Format"
        >
          <Eraser className="h-3.5 w-3.5" />
        </button>
      </div>
      {/* Editable Content */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        className="p-2 min-h-[60px] max-h-[150px] overflow-y-auto outline-none text-xs leading-relaxed font-sans empty:before:content-[attr(placeholder)] empty:before:text-muted-foreground/40 before:pointer-events-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ placeholder } as any)}
      />
    </div>
  )
}


interface WorkReportProps {
  isPro?: boolean
}

const parseDurationVal = (val: string) => {
  let hours = 0
  let minutes = 0
  const normalized = val.toLowerCase().trim()
  if (normalized === "all day") {
    hours = 8
  } else if (normalized.includes("hour") || normalized.includes("hr")) {
    const parsedHours = parseFloat(normalized)
    if (!isNaN(parsedHours)) {
      hours = Math.floor(parsedHours)
      minutes = Math.round((parsedHours - hours) * 60)
    }
  } else if (normalized.includes("min")) {
    const parsedMins = parseFloat(normalized)
    if (!isNaN(parsedMins)) {
      minutes = Math.round(parsedMins)
    }
  } else {
    const parsedHours = parseFloat(normalized)
    if (!isNaN(parsedHours)) {
      hours = Math.floor(parsedHours)
      minutes = Math.round((parsedHours - hours) * 60)
    }
  }
  return { hours, minutes }
}

const formatDuration = (hours: number, minutes: number) => {
  if (!hours && !minutes) return "—"
  const hText = hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""}` : ""
  const mText = minutes > 0 ? `${minutes} min${minutes > 1 ? "s" : ""}` : ""
  return [hText, mText].filter(Boolean).join(" ")
}

export function WorkReport({}: WorkReportProps) {
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [scheduledHours, setScheduledHours] = useState("8")
  const [tasks, setTasks] = useState<TaskRow[]>([
    { id: "1", taskName: "Phone Calls", updateText: "Total addressed: <b>40</b><br />Reviewed callbacks", projectedDate: "", hours: 2, minutes: 0 },
    { id: "2", taskName: "Chats", updateText: "Attended support chats and checked <a href='https://google.com' target='_blank' style='color:#1d4ed8;text-decoration:underline;'>Google portal</a>", projectedDate: "", hours: 1, minutes: 0 }
  ])
  const [extraTitle, setExtraTitle] = useState("")
  const [extraContent, setExtraContent] = useState("")
  const [extraImage, setExtraImage] = useState("")
  const [extraTitle2, setExtraTitle2] = useState("")
  const [extraContent2, setExtraContent2] = useState("")
  const [extraImage2, setExtraImage2] = useState("")
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Load initial values
  useEffect(() => {
    const saved = localStorage.getItem("thewordof-work-report")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        /* eslint-disable react-hooks/set-state-in-effect */
        if (parsed.name) setName(parsed.name)
        if (parsed.date) setDate(parsed.date)
        if (parsed.scheduledHours) setScheduledHours(parsed.scheduledHours)
        if (parsed.tasks && Array.isArray(parsed.tasks)) {
          const migratedTasks = parsed.tasks.map((t: { hours?: number; minutes?: number; durationVal?: string }) => {
            const hrs = typeof t.hours === "number" ? t.hours : 0
            const mins = typeof t.minutes === "number" ? t.minutes : 0
            if (t.hours === undefined && t.minutes === undefined && t.durationVal) {
              const parsedTime = parseDurationVal(t.durationVal)
              return {
                ...t,
                hours: parsedTime.hours,
                minutes: parsedTime.minutes
              }
            }
            return {
              ...t,
              hours: hrs,
              minutes: mins
            }
          })
          setTasks(migratedTasks)
        }
        if (parsed.extraTitle !== undefined) setExtraTitle(parsed.extraTitle)
        if (parsed.extraContent !== undefined) setExtraContent(parsed.extraContent)
        if (parsed.extraImage !== undefined) setExtraImage(parsed.extraImage)
        if (parsed.extraTitle2 !== undefined) setExtraTitle2(parsed.extraTitle2)
        if (parsed.extraContent2 !== undefined) setExtraContent2(parsed.extraContent2)
        if (parsed.extraImage2 !== undefined) setExtraImage2(parsed.extraImage2)
        /* eslint-enable react-hooks/set-state-in-effect */
      } catch (e) {
        console.error("Failed to parse saved state", e)
      }
    } else {
      const today = new Date().toISOString().split("T")[0]
      setDate(today)
    }
  }, [])

  // Sync to localstorage
  useEffect(() => {
    const state = { name, date, scheduledHours, tasks, extraTitle, extraContent, extraImage, extraTitle2, extraContent2, extraImage2 }
    localStorage.setItem("thewordof-work-report", JSON.stringify(state))
  }, [name, date, scheduledHours, tasks, extraTitle, extraContent, extraImage, extraTitle2, extraContent2, extraImage2])

  // Totals calculation
  const calculateTotals = () => {
    let totalMins = 0
    tasks.forEach(t => {
      totalMins += (t.hours || 0) * 60 + (t.minutes || 0)
    })

    const finalHours = Math.floor(totalMins / 60)
    const finalMins = Math.round(totalMins % 60)
    
    if (finalHours > 0 && finalMins > 0) {
      return `${finalHours} hour${finalHours > 1 ? "s" : ""} ${finalMins} minute${finalMins > 1 ? "s" : ""}`
    } else if (finalHours > 0) {
      return `${finalHours} hour${finalHours > 1 ? "s" : ""}`
    } else {
      return `${finalMins} minute${finalMins > 1 ? "s" : ""}`
    }
  }

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        id: Math.random().toString(36).substr(2, 9),
        taskName: "",
        updateText: "",
        projectedDate: "",
        hours: 0,
        minutes: 30
      }
    ])
  }

  const deleteRow = (index: number) => {
    if (tasks.length === 1) return
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const updateRow = (index: number, field: keyof TaskRow, value: string | number) => {
    const newTasks = [...tasks]
    newTasks[index] = { ...newTasks[index], [field]: value } as TaskRow
    setTasks(newTasks)
  }

  // Drag-and-drop
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (index: number) => {
    if (draggedIndex === null) return
    const reordered = [...tasks]
    const [moved] = reordered.splice(draggedIndex, 1)
    reordered.splice(index, 0, moved)
    setTasks(reordered)
    setDraggedIndex(null)
  }

  const printPdf = () => {
    const originalTitle = document.title
    document.title = "Daily Task Tracker & Work Report Generator | TheWordOf Tools"
    window.print()
    document.title = originalTitle
  }

  // Render HTML strings natively
  const renderHtmlText = (text: string) => {
    if (!text) return "—"
    
    // Clean up empty paragraphs, divs, or lists that only contain <br> or empty whitespace
    const cleaned = text
      .replace(/<p>\s*(<br\s*\/?>)?\s*<\/p>/gi, "")
      .replace(/<div>\s*(<br\s*\/?>)?\s*<\/div>/gi, "")
      .replace(/<li>\s*(<br\s*\/?>)?\s*<\/li>/gi, "")
      .replace(/<ul>\s*(<br\s*\/?>)?\s*<\/ul>/gi, "")
      .replace(/<ol>\s*(<br\s*\/?>)?\s*<\/ol>/gi, "")
      .trim()
      
    if (cleaned === "" || cleaned === "<br>" || cleaned === "<br/>" || cleaned === "<br />") {
      return "—"
    }

    const formatted = cleaned.replace(/\n/g, "<br />")
    return <div className="[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:text-blue-600 [&_a]:underline [&_p]:m-0 [&_ul]:m-0 [&_ol]:m-0 break-words [word-break:break-word]" dangerouslySetInnerHTML={{ __html: formatted }} />
  }

  return (
    <div className="w-full space-y-6 print:block print:p-0">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { 
            margin: 15mm 20mm;
            size: A4 portrait;
          }
          body { 
            margin: 0 !important; 
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
          }
        }
      `}} />
      {/* Main Header with Export to PDF button */}
      <div className="flex justify-end print:hidden pb-4 border-b border-border/50 -mb-4">
        <Button onClick={() => setIsPreviewOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 shrink-0">
          Export to PDF
        </Button>
      </div>

      {/* Editor Form Panel */}
      <div className="space-y-6 print:hidden">
        <Card className="glassmorphism p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Report Parameters</CardTitle>
            <CardDescription>Configure task rows, dates, and names below.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Scheduled Hours Today</label>
                <Input type="number" value={scheduledHours} onChange={e => setScheduledHours(e.target.value)} placeholder="e.g. 8" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Table Card */}
        <Card className="glassmorphism p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Task Sheet</CardTitle>
            <CardDescription>Enter task logs. Drag handles (⋮⋮) to reorder tasks.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-4">
            {/* Desktop view table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="py-1 text-left w-6"></th>
                    <th className="py-1 text-left px-1.5">Task Name / Work Update</th>
                    <th className="py-1 text-left px-1.5 w-32">Projected Comp.</th>
                    <th className="py-1 text-left px-1.5 w-52">Time Spent</th>
                    <th className="py-1 text-right w-12">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, idx) => (
                    <React.Fragment key={task.id}>
                      {/* Main parameters row */}
                      <tr
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(idx)}
                        className={`border-b-0 border-t border-border/20 group ${
                          draggedIndex === idx ? "opacity-40" : ""
                        } hover:bg-muted/5 transition-colors`}
                      >
                        <td className="py-1 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-foreground w-6">
                          ⋮⋮
                        </td>
                        <td className="py-1 px-1.5">
                          <Input
                            value={task.taskName}
                            onChange={(e) => updateRow(idx, "taskName", e.target.value)}
                            placeholder="Task Name (e.g. Follow Ups)"
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="py-1 px-1.5 w-32">
                          <Input
                            type="date"
                            value={task.projectedDate}
                            onChange={(e) => updateRow(idx, "projectedDate", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="py-1 px-1.5 w-52">
                          <div className="flex gap-1.5 items-center w-full">
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min={0}
                                step={1}
                                value={task.hours}
                                onChange={(e) => updateRow(idx, "hours", parseInt(e.target.value) || 0)}
                                className="h-8 w-16 text-xs text-center"
                              />
                              <span className="text-[10px] text-muted-foreground">hrs</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min={0}
                                max={45}
                                step={15}
                                value={task.minutes}
                                onChange={(e) => updateRow(idx, "minutes", parseInt(e.target.value) || 0)}
                                className="h-8 w-16 text-xs text-center"
                              />
                              <span className="text-[10px] text-muted-foreground">mins</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-1 text-right w-12">
                          <div className="flex items-center justify-end">
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive/60 hover:text-destructive hover:bg-destructive/10" onClick={() => deleteRow(idx)} disabled={tasks.length === 1}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>

                      {/* Work Update sub-row */}
                      <tr
                        className={`border-b border-border/20 group ${
                          draggedIndex === idx ? "opacity-40" : ""
                        } hover:bg-muted/5 transition-colors`}
                      >
                        <td></td>
                        <td colSpan={4} className="py-1 px-1.5 pb-2">
                          <RichTextEditor
                            value={task.updateText}
                            onChange={(val) => updateRow(idx, "updateText", val)}
                            placeholder="Work Update (Use toolbar to format bold, links, lists)"
                          />
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked card view */}
            <div className="md:hidden space-y-4">
              {tasks.map((task, idx) => (
                <div key={task.id} className="border border-border/50 rounded-xl p-4 bg-muted/5 space-y-3 relative">
                  <div className="absolute top-2 right-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => deleteRow(idx)} disabled={tasks.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-1 pt-4">
                    <label className="text-xs font-semibold text-muted-foreground">Task Name</label>
                    <Input value={task.taskName} onChange={(e) => updateRow(idx, "taskName", e.target.value)} placeholder="e.g. Chats" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground">Work Update</label>
                    <RichTextEditor
                      value={task.updateText}
                      onChange={(val) => updateRow(idx, "updateText", val)}
                      placeholder="Completed tasks..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Projected Comp.</label>
                      <Input type="date" value={task.projectedDate} onChange={(e) => updateRow(idx, "projectedDate", e.target.value)} className="text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Time Spent</label>
                      <div className="flex gap-1.5 items-center w-full">
                        <div className="flex items-center gap-1 flex-1">
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            value={task.hours}
                            onChange={(e) => updateRow(idx, "hours", parseInt(e.target.value) || 0)}
                            className="h-8 text-xs text-center flex-1"
                          />
                          <span className="text-[10px] text-muted-foreground">hrs</span>
                        </div>
                        <div className="flex items-center gap-1 flex-1">
                          <Input
                            type="number"
                            min={0}
                            max={45}
                            step={15}
                            value={task.minutes}
                            onChange={(e) => updateRow(idx, "minutes", parseInt(e.target.value) || 0)}
                            className="h-8 text-xs text-center flex-1"
                          />
                          <span className="text-[10px] text-muted-foreground">mins</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex pt-2">
              <Button onClick={addTask} className="w-full" variant="secondary">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Custom Additional Section Card */}
        <Card className="glassmorphism p-6 print:hidden">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Additional Sections</CardTitle>
            <CardDescription>Configure custom notes, reminders, or achievements to print beneath the sheet.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-6">
            {/* Section 1 */}
            <div className="space-y-3 pb-4 border-b border-border/40">
              <h4 className="text-sm font-bold text-foreground">Section 1</h4>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Section Title</label>
                <Input value={extraTitle} onChange={e => setExtraTitle(e.target.value)} placeholder="e.g. Additional Notes / Next Steps" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Section Content</label>
                <RichTextEditor
                  value={extraContent}
                  onChange={setExtraContent}
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Attach Image (Optional)</label>
                <div className="flex items-center gap-4">
                  {extraImage && (
                    <div className="relative w-16 h-16 border rounded bg-muted flex items-center justify-center overflow-hidden">
                      <img src={extraImage} alt="Preview" className="max-w-full max-h-full object-contain" />
                      <button 
                        type="button"
                        onClick={() => setExtraImage("")}
                        className="absolute top-0 right-0 bg-destructive text-white p-0.5 rounded-bl"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => setExtraImage(reader.result as string)
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="text-xs h-9 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-foreground">Section 2</h4>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Section Title</label>
                <Input value={extraTitle2} onChange={e => setExtraTitle2(e.target.value)} placeholder="e.g. Key Achievements" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Section Content</label>
                <RichTextEditor
                  value={extraContent2}
                  onChange={setExtraContent2}
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Attach Image (Optional)</label>
                <div className="flex items-center gap-4">
                  {extraImage2 && (
                    <div className="relative w-16 h-16 border rounded bg-muted flex items-center justify-center overflow-hidden">
                      <img src={extraImage2} alt="Preview" className="max-w-full max-h-full object-contain" />
                      <button 
                        type="button"
                        onClick={() => setExtraImage2("")}
                        className="absolute top-0 right-0 bg-destructive text-white p-0.5 rounded-bl"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => setExtraImage2(reader.result as string)
                        reader.readAsDataURL(file)
                      }
                    }}
                    className="text-xs h-9 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PDF / Print Preview Modal Dialog */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:static print:block print:w-full print:h-auto print:bg-white print:p-0 print:z-0 print:overflow-visible">
          <div className="absolute inset-0 print:hidden bg-transparent" onClick={() => setIsPreviewOpen(false)} />
          
          <div className="relative w-full max-w-4xl bg-card rounded-2xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden print:static print:block print:max-w-full print:border-none print:shadow-none print:bg-white print:h-auto print:max-h-none print:overflow-visible">
            {/* Modal Header Actions */}
            <div className="p-4 border-b flex items-center justify-between bg-muted/20 print:hidden">
              <h3 className="text-sm font-bold">Document Print Preview</h3>
              <div className="flex gap-2">
                <Button onClick={printPdf} size="sm" className="font-bold">
                  <Printer className="mr-1.5 h-4 w-4" /> Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsPreviewOpen(false)}>
                  Close
                </Button>
              </div>
            </div>

            {/* Modal Preview Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-muted/10 print:block print:p-0 print:bg-white print:overflow-visible">
              <div className="min-w-fit flex justify-center w-full print:block">
                {/* printable A4 paper container */}
                <div 
                  className="w-full max-w-[210mm] border border-black bg-white text-black p-10 shadow-sm print:shadow-none print:border-none print:p-0 font-sans min-h-[297mm] print:min-h-0 print:block flex flex-col justify-start"
                  style={{ fontSize: "11pt", lineHeight: "1.3" }}
                >
                  <div className="space-y-6">
                    {/* Header Row */}
                    <div className="text-center space-y-1">
                      <h2 className="font-bold text-black tracking-tight" style={{ fontSize: "14pt" }}>
                        Daily Task Tracker
                      </h2>
                      
                      <div className="flex justify-between" style={{ fontSize: "11pt" }}>
                        <span>Name: {name || "—"}</span>
                        <span>Date: {date || "—"}</span>
                      </div>

                      <div className="text-left" style={{ fontSize: "11pt" }}>
                        Scheduled hours today: {scheduledHours || "—"}
                      </div>
                    </div>

                    {/* Printable Table */}
                    <table className="w-full text-left border-collapse table-fixed border border-black" style={{ fontSize: "11pt" }}>
                      <thead>
                        <tr className="bg-gray-100 text-gray-800 font-bold border-b border-black">
                          <th className="py-1.5 px-2 border-r border-black w-[15%] break-words">Task Name</th>
                          <th className="py-1.5 px-2 border-r border-black w-[55%] break-words">Update</th>
                          <th className="py-1.5 px-2 border-r border-black w-[15%] break-words">Projected Comp.</th>
                          <th className="py-1.5 px-2 w-[15%] break-words">Time Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((task) => (
                          <tr key={task.id} className="border-b border-black last:border-b-0 break-inside-avoid">
                            <td className="py-1 px-2 border-r border-black font-semibold text-gray-900 vertical-align-top break-words [word-break:break-word]">
                              {task.taskName || "—"}
                            </td>
                            <td className="py-1 px-2 border-r border-black text-gray-700 whitespace-pre-wrap leading-relaxed break-words [word-break:break-word]">
                              {renderHtmlText(task.updateText)}
                            </td>
                            <td className="py-1 px-2 border-r border-black text-gray-600 break-words [word-break:break-word]">
                              {task.projectedDate || "—"}
                            </td>
                            <td className="py-1 px-2 text-gray-900 font-medium break-words [word-break:break-word]">
                              {formatDuration(task.hours, task.minutes)}
                            </td>
                          </tr>
                        ))}
                        {/* Highlighted Total Row */}
                        <tr className="bg-[#fefce8] text-black border-t border-black font-bold" style={{ fontSize: "11pt" }}>
                          <td colSpan={3} className="py-1.5 px-2 text-left">
                            Total
                          </td>
                          <td className="py-1.5 px-2 font-extrabold text-black">
                            {calculateTotals()}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Additional Notes Custom Section 1 */}
                    {(extraTitle || extraContent || extraImage) && (
                      <div className="text-left break-inside-avoid" style={{ fontSize: "11pt" }}>
                        {extraTitle && (
                          <h3 className="font-bold mb-1.5 uppercase text-xs">
                            {extraTitle}
                          </h3>
                        )}
                        <div className="text-gray-800 leading-relaxed">
                          {renderHtmlText(extraContent)}
                        </div>
                        {extraImage && (
                          <div className="mt-2.5">
                            <img src={extraImage} alt="Attachment" className="max-w-full max-h-64 object-contain rounded-sm border border-gray-100" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Additional Custom Section 2 */}
                    {(extraTitle2 || extraContent2 || extraImage2) && (
                      <div className="text-left break-inside-avoid" style={{ fontSize: "11pt" }}>
                        {extraTitle2 && (
                          <h3 className="font-bold mb-1.5 uppercase text-xs">
                            {extraTitle2}
                          </h3>
                        )}
                        <div className="text-gray-800 leading-relaxed">
                          {renderHtmlText(extraContent2)}
                        </div>
                        {extraImage2 && (
                          <div className="mt-2.5">
                            <img src={extraImage2} alt="Attachment" className="max-w-full max-h-64 object-contain rounded-sm border border-gray-100" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
