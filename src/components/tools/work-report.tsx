"use client"

import React, { useState, useEffect } from "react"
import { Plus, Trash2, Printer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface TaskRow {
  id: string
  taskName: string
  updateText: string
  projectedDate: string
  durationVal: string
}

interface WorkReportProps {
  isPro?: boolean
}

const DURATION_PRESETS = [
  "15 mins",
  "30 mins",
  "45 mins",
  "1 hour",
  "2 hours",
  "3 hours",
  "4 hours",
  "All Day"
]

export function WorkReport({ isPro: _isPro = false }: WorkReportProps) {
  const [name, setName] = useState("")
  const [date, setDate] = useState("")
  const [scheduledHours, setScheduledHours] = useState("8")
  const [tasks, setTasks] = useState<TaskRow[]>([
    { id: "1", taskName: "Phone Calls", updateText: "Total addressed: 40\nReviewed callbacks", projectedDate: "", durationVal: "2 hours" },
    { id: "2", taskName: "Chats", updateText: "Attended support chats", projectedDate: "", durationVal: "1 hour" }
  ])
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
        if (parsed.tasks && Array.isArray(parsed.tasks)) setTasks(parsed.tasks)
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
    const state = { name, date, scheduledHours, tasks }
    localStorage.setItem("thewordof-work-report", JSON.stringify(state))
  }, [name, date, scheduledHours, tasks])

  // Totals calculation
  const calculateTotals = () => {
    let totalMins = 0
    tasks.forEach(t => {
      const val = t.durationVal.toLowerCase().trim()
      if (val === "all day") {
        totalMins += 8 * 60
      } else if (val.includes("hour") || val.includes("hr")) {
        const hours = parseInt(val)
        if (!isNaN(hours)) totalMins += hours * 60
      } else if (val.includes("min")) {
        const mins = parseInt(val)
        if (!isNaN(mins)) totalMins += mins
      } else {
        const valNum = parseFloat(val)
        if (!isNaN(valNum)) totalMins += valNum * 60 // fallback to hours
      }
    })

    const finalHours = Math.floor(totalMins / 60)
    const finalMins = totalMins % 60
    
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
        durationVal: "30 mins"
      }
    ])
  }

  const deleteRow = (index: number) => {
    if (tasks.length === 1) return
    setTasks(tasks.filter((_, i) => i !== index))
  }

  const updateRow = (index: number, field: keyof TaskRow, value: string) => {
    const newTasks = [...tasks]
    newTasks[index] = { ...newTasks[index], [field]: value }
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
    window.print()
  }

  return (
    <div className="w-full space-y-6 max-w-5xl mx-auto print:block print:p-0">
      {/* Editor Form Panel */}
      <div className="space-y-6 print:hidden">
        <Card className="glassmorphism p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Report Parameters</CardTitle>
            <CardDescription>Configure task rows, dates, and names below.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sajid Khan" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Date</label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Scheduled Hours Today</label>
              <Input type="number" value={scheduledHours} onChange={e => setScheduledHours(e.target.value)} placeholder="e.g. 8" />
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Table Card */}
        <Card className="glassmorphism p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Task Sheet</CardTitle>
            <CardDescription>Enter task logs. Drag handles to reorder tasks.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-4">
            {/* Desktop view table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="py-2 text-left w-6"></th>
                    <th className="py-2 text-left px-2">Task Name</th>
                    <th className="py-2 text-left px-2">Work Update</th>
                    <th className="py-2 text-left px-2 w-32">Projected Comp.</th>
                    <th className="py-2 text-left px-2 w-32">Time Spent</th>
                    <th className="py-2 text-right w-16">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, idx) => (
                    <tr
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(idx)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(idx)}
                      className={`border-b border-border/30 group ${
                        draggedIndex === idx ? "opacity-40" : ""
                      } hover:bg-muted/10 transition-colors`}
                    >
                      <td className="py-3 cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-foreground">
                        ⋮⋮
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          value={task.taskName}
                          onChange={(e) => updateRow(idx, "taskName", e.target.value)}
                          placeholder="e.g. Follow Ups"
                          className="h-9"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Textarea
                          value={task.updateText}
                          onChange={(e) => updateRow(idx, "updateText", e.target.value)}
                          placeholder="Bullet list or comments..."
                          rows={2}
                          className="min-h-[60px] text-xs py-1.5"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <Input
                          type="date"
                          value={task.projectedDate}
                          onChange={(e) => updateRow(idx, "projectedDate", e.target.value)}
                          className="h-9 text-xs"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <div className="space-y-1">
                          <Input
                            value={task.durationVal}
                            onChange={(e) => updateRow(idx, "durationVal", e.target.value)}
                            placeholder="e.g. 1 hour"
                            className="h-9 text-xs"
                          />
                          <select
                            value={DURATION_PRESETS.includes(task.durationVal) ? task.durationVal : ""}
                            onChange={(e) => updateRow(idx, "durationVal", e.target.value)}
                            className="w-full text-[10px] rounded border bg-background text-muted-foreground h-6 px-1"
                          >
                            <option value="">-- Choose --</option>
                            {DURATION_PRESETS.map(p => (
                              <option key={p} value={p}>{p}</option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end">
                          <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive/60 hover:text-destructive hover:bg-destructive/10" onClick={() => deleteRow(idx)} disabled={tasks.length === 1}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
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
                    <Textarea value={task.updateText} onChange={(e) => updateRow(idx, "updateText", e.target.value)} placeholder="Completed 30 tickets..." rows={3} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Projected Comp.</label>
                      <Input type="date" value={task.projectedDate} onChange={(e) => updateRow(idx, "projectedDate", e.target.value)} className="text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-muted-foreground">Duration</label>
                      <Input value={task.durationVal} onChange={(e) => updateRow(idx, "durationVal", e.target.value)} className="text-xs" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button onClick={addTask} className="flex-1" variant="secondary">
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
              <Button onClick={() => setIsPreviewOpen(true)} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg shadow-primary/20">
                Export to PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PDF / Print Preview Modal Dialog */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:absolute print:inset-0 print:bg-white print:p-0 print:block print:z-0 print:overflow-visible">
          <div className="absolute inset-0 print:hidden bg-transparent" onClick={() => setIsPreviewOpen(false)} />
          
          <div className="relative w-full max-w-4xl bg-card rounded-2xl border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden print:static print:max-w-full print:border-none print:shadow-none print:bg-white print:h-auto print:max-h-none print:overflow-visible">
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
            <div className="flex-1 overflow-y-auto p-8 bg-muted/10 flex justify-center print:p-0 print:bg-white print:overflow-visible">
              {/* printable A4 paper container */}
              <div 
                className="w-full max-w-[210mm] border border-border/80 rounded-sm bg-white text-black p-10 shadow-sm print:shadow-none print:border-none print:p-0 font-sans min-h-[297mm] flex flex-col justify-between"
                style={{ fontSize: "11pt" }}
              >
                <div className="space-y-6">
                  {/* Header Row */}
                  <div className="text-center space-y-3 pb-4 border-b border-black">
                    <h2 className="font-bold text-black tracking-tight" style={{ fontSize: "14pt" }}>
                      Daily Task Tracker
                    </h2>
                    
                    <div className="flex justify-between px-2" style={{ fontSize: "11pt" }}>
                      <span>Name: {name || "—"}</span>
                      <span>Date: {date || "—"}</span>
                    </div>

                    <div className="text-left px-2" style={{ fontSize: "11pt" }}>
                      Scheduled hours today: {scheduledHours || "—"}
                    </div>
                  </div>

                  {/* Printable Table */}
                  <div className="border border-black rounded-sm overflow-hidden">
                    <table className="w-full text-left border-collapse" style={{ fontSize: "11pt" }}>
                      <thead>
                        <tr className="bg-gray-100 text-gray-800 font-bold border-b border-black">
                          <th className="py-2.5 px-3 border-r border-black w-1/4">Task Name</th>
                          <th className="py-2.5 px-3 border-r border-black w-2/5">Update</th>
                          <th className="py-2.5 px-3 border-r border-black w-1/5">Projected Comp.</th>
                          <th className="py-2.5 px-3 w-1/5">Time Spent</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tasks.map((task) => (
                          <tr key={task.id} className="border-b border-black last:border-b-0 break-inside-avoid">
                            <td className="py-2 px-3 border-r border-black font-semibold text-gray-900 vertical-align-top">
                              {task.taskName || "—"}
                            </td>
                            <td className="py-2 px-3 border-r border-black text-gray-700 whitespace-pre-wrap leading-relaxed">
                              {task.updateText || "—"}
                            </td>
                            <td className="py-2 px-3 border-r border-black text-gray-600">
                              {task.projectedDate || "—"}
                            </td>
                            <td className="py-2 px-3 text-gray-900 font-medium">
                              {task.durationVal || "—"}
                            </td>
                          </tr>
                        ))}
                        {/* Highlighted Total Row */}
                        <tr className="bg-[#fefce8] text-black border-t border-black font-bold" style={{ fontSize: "11pt" }}>
                          <td colSpan={3} className="py-2.5 px-3 text-left">
                            Total
                          </td>
                          <td className="py-2.5 px-3 font-extrabold text-black">
                            {calculateTotals()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Printable footer stamp */}
                <div className="border-t border-gray-200 pt-4 text-[10px] text-gray-400 flex justify-between items-center mt-8">
                  <span>TheWordOf Tools | Daily Task Tracker</span>
                  <span>Generated on {new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
