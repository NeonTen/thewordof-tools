# Multi-Color Gradient Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enhance the Gradient Generator tool to allow users to add, edit, position, and delete multiple color stops using an interactive visual slider track.

**Architecture:** Use React state to manage an array of color stop objects, render a interactive custom gradient slider bar using standard DOM mouse/touch event listeners for drag-and-drop, and sort stops before generating output CSS and Tailwind snippets.

**Tech Stack:** React, Next.js, Tailwind CSS, Lucide icons.

---

### Task 1: Type Definitions and Preset Converter

**Files:**
- Modify: [gradient-generator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/gradient-generator.tsx)

- [ ] **Step 1: Add interface definitions and mapping helper**
  Define `ColorStop` interface and `presetToStops` helper function inside `gradient-generator.tsx`:
  ```typescript
  interface ColorStop {
    id: string
    color: string
    position: number
  }

  function presetToStops(preset: GradientPreset): ColorStop[] {
    return preset.colors.map((color, index) => ({
      id: `stop-${index}-${Date.now()}`,
      color,
      position: Math.round((index / (preset.colors.length - 1)) * 100),
    }))
  }
  ```

- [ ] **Step 2: Update state hooks in GradientGenerator component**
  Initialize `stops` and `activeStopId` state hooks, replacing the old `colors` state:
  ```typescript
  const initialStops = presetToStops(PRESETS[0])
  const [stops, setStops] = useState<ColorStop[]>(initialStops)
  const [activeStopId, setActiveStopId] = useState<string>(initialStops[0].id)
  ```

- [ ] **Step 3: Update Preset Selector function**
  Modify `handleSelectPreset` to transform the new preset's colors to stops and set the active stop:
  ```typescript
  const handleSelectPreset = (preset: GradientPreset) => {
    setSelected(preset)
    const newStops = presetToStops(preset)
    setStops(newStops)
    setActiveStopId(newStops[0].id)
    setAngle(preset.angle)
    setType(preset.type)
  }
  ```

- [ ] **Step 4: Commit changes**
  ```bash
  git add src/components/tools/gradient-generator.tsx
  git commit -m "feat(gradient): update state model to support multi-color stops"
  ```

---

### Task 2: Code Generation and Preview logic

**Files:**
- Modify: [gradient-generator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/gradient-generator.tsx)

- [ ] **Step 1: Update code generator memos**
  Sort stops by position and output CSS/Tailwind:
  ```typescript
  const sortedStops = useMemo(() => {
    return [...stops].sort((a, b) => a.position - b.position)
  }, [stops])

  const cssCode = useMemo(() => {
    const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(", ")
    if (type === "radial") {
      return `background: radial-gradient(circle, ${stopsStr});`
    }
    return `background: linear-gradient(${angle}deg, ${stopsStr});`
  }, [sortedStops, angle, type])

  const tailwindCode = useMemo(() => {
    const stopsStr = sortedStops.map(s => `${s.color}_${s.position}%`).join(",")
    if (type === "radial") {
      return `bg-[radial-gradient(circle_at_center,_${stopsStr})]`
    }
    return `bg-[linear-gradient(${angle}deg,_${stopsStr})]`
  }, [sortedStops, angle, type])
  ```

- [ ] **Step 2: Update background previews in rendering**
  Replace instances of old preset color interpolation with the new computed CSS gradient styles for the preset items and live preview block.
  Preset gallery preview style:
  ```typescript
  background: `linear-gradient(${preset.angle}deg, ${preset.colors.join(", ")})`
  ```
  Live preview block style:
  ```typescript
  style={{ background: type === "radial" ? `radial-gradient(circle, ${sortedStops.map(s => `${s.color} ${s.position}%`).join(", ")})` : `linear-gradient(${angle}deg, ${sortedStops.map(s => `${s.color} ${s.position}%`).join(", ")})` }}
  ```

- [ ] **Step 3: Commit changes**
  ```bash
  git add src/components/tools/gradient-generator.tsx
  git commit -m "feat(gradient): update preview and generation logic with sorted stops"
  ```

---

### Task 3: Interactive Slider and Controls UI

**Files:**
- Modify: [gradient-generator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/gradient-generator.tsx)

- [ ] **Step 1: Add drag-and-drop and click-to-add handles**
  Add `useRef` import and track reference. Implement drag and click handler functions:
  ```typescript
  import { useState, useMemo, useRef } from "react"
  // Inside Component:
  const trackRef = useRef<HTMLDivElement>(null)

  const handleDragStart = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const isTouch = "touches" in e
    const startX = isTouch ? e.touches[0].clientX : e.clientX
    const initialPosition = stops.find(s => s.id === id)?.position ?? 0
    const trackEl = trackRef.current
    if (!trackEl) return

    const rect = trackEl.getBoundingClientRect()
    const trackWidth = rect.width || 1

    const handleDragMove = (moveEvent: MouseEvent | TouchEvent) => {
      const currentX = "touches" in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX
      const deltaX = currentX - startX
      const deltaPercent = (deltaX / trackWidth) * 100
      const nextPercent = Math.min(100, Math.max(0, Math.round(initialPosition + deltaPercent)))
      setStops(prev => prev.map(s => s.id === id ? { ...s, position: nextPercent } : s))
    }

    const handleDragEnd = () => {
      window.removeEventListener("mousemove", handleDragMove)
      window.removeEventListener("mouseup", handleDragEnd)
      window.removeEventListener("touchmove", handleDragMove)
      window.removeEventListener("touchend", handleDragEnd)
    }

    window.addEventListener("mousemove", handleDragMove)
    window.addEventListener("mouseup", handleDragEnd)
    window.addEventListener("touchmove", handleDragMove)
    window.addEventListener("touchend", handleDragEnd)
  }

  const handleTrackClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".slider-pin")) return

    const trackEl = trackRef.current
    if (!trackEl) return

    const rect = trackEl.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const position = Math.min(100, Math.max(0, Math.round((clickX / rect.width) * 100)))

    const activeStop = stops.find(s => s.id === activeStopId) ?? stops[0]
    const newColor = activeStop ? activeStop.color : "#3b82f6"

    const newStop: ColorStop = {
      id: `stop-${Date.now()}-${Math.random()}`,
      color: newColor,
      position,
    }

    setStops(prev => [...prev, newStop])
    setActiveStopId(newStop.id)
  }
  ```

- [ ] **Step 2: Add Delete and Flip stop functions**
  Implement stop deletion and color reversing:
  ```typescript
  const handleDeleteStop = (id: string) => {
    if (stops.length <= 2) return
    setStops(prev => prev.filter(s => s.id !== id))
    // Ensure active stop points to a valid stop
    setActiveStopId(prev => (prev === id ? stops.find(s => s.id !== id)!.id : prev))
  }

  const handleFlipGradients = () => {
    setStops(prev => prev.map(s => ({
      ...s,
      position: 100 - s.position
    })))
  }
  ```

- [ ] **Step 3: Update control rendering in UI**
  Replace the color inputs section with:
  1. The interactive track with draggable pins.
  2. The single stop control section displaying details of the `activeStopId`.
  
  Interactive track UI:
  ```tsx
  <div className="space-y-4">
    <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
      Interactive Gradient Track (Click to add stop, drag to move)
    </label>
    <div 
      ref={trackRef}
      onClick={handleTrackClick}
      className="relative h-6 rounded-xl border border-border cursor-pointer select-none"
      style={{ background: `linear-gradient(to right, ${sortedStops.map(s => `${s.color} ${s.position}%`).join(", ")})` }}
    >
      {stops.map(s => (
        <div
          key={s.id}
          onMouseDown={(e) => handleDragStart(s.id, e)}
          onTouchStart={(e) => handleDragStart(s.id, e)}
          onClick={(e) => {
            e.stopPropagation()
            setActiveStopId(s.id)
          }}
          className={`slider-pin absolute top-1/2 -translate-y-1/2 w-4 h-7 border rounded-md cursor-grab transition-colors ${
            s.id === activeStopId ? "border-primary bg-primary shadow-lg ring-2 ring-primary/20 scale-110" : "border-muted-foreground/30 bg-background shadow"
          }`}
          style={{ left: `${s.position}%`, transform: 'translate(-50%, -50%)', backgroundColor: s.color }}
        />
      ))}
    </div>
  </div>
  ```

  Selected stop control UI:
  ```tsx
  {(() => {
    const activeStop = stops.find(s => s.id === activeStopId)
    if (!activeStop) return null
    return (
      <div className="bg-muted/30 p-4 border rounded-xl space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">
            Edit Color Stop
          </span>
          {stops.length > 2 && (
            <button 
              onClick={() => handleDeleteStop(activeStop.id)}
              className="text-[10px] text-destructive font-black uppercase tracking-wider hover:underline"
            >
              Delete Stop
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="color" 
            value={activeStop.color} 
            onChange={(e) => {
              const val = e.target.value
              setStops(prev => prev.map(s => s.id === activeStopId ? { ...s, color: val } : s))
            }} 
            className="w-10 h-10 border border-border rounded-xl cursor-pointer bg-transparent" 
          />
          <div className="flex-1 space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span>Position</span>
              <span className="font-mono">{activeStop.position}%</span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={activeStop.position}
              onChange={(e) => {
                const val = parseInt(e.target.value)
                setStops(prev => prev.map(s => s.id === activeStopId ? { ...s, position: val } : s))
              }}
              className="w-full cursor-pointer accent-primary"
            />
          </div>
        </div>
      </div>
    )
  })()}
  ```

  Flip button modification:
  ```tsx
  <button 
    onClick={handleFlipGradients} 
    className="p-2 border border-border rounded-xl hover:bg-muted/50 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm w-fit"
  >
    <RefreshCw className="h-3.5 w-3.5" /> Flip Gradients
  </button>
  ```

- [ ] **Step 4: Commit changes**
  ```bash
  git add src/components/tools/gradient-generator.tsx
  git commit -m "feat(gradient): add interactive color track, custom pins, and stop controls"
  ```

---

### Task 4: Production Build & Verification

**Files:**
- None

- [ ] **Step 1: Test with build script**
  Run Next.js build:
  `npm run build`
  Expected: Success without errors.

- [ ] **Step 2: Update graphify**
  Run: `graphify update .`
  Expected: Update AST index files correctly.

- [ ] **Step 3: Commit**
  ```bash
  git add graphify-out/
  git commit -m "chore: update AST graphify index"
  ```
