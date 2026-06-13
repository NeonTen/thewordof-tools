# SEO Readability Grader and Keyword Density Analyzer Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a shared visual Tag Input component, update the Keyword Density tool to use it, add Gunning Fog, Dale-Chall, and ARI readability algorithms alongside Flesch Reading Ease to the Readability Grader, and enable protected keyword preservation for AI content simplification.

**Architecture:**
1. Create a reusable `TagInput` component that handles tags as an array of strings, displaying them in a flexbox with close buttons.
2. Integrate this `TagInput` in the Keyword Density Analyzer to replace target keywords comma-separated string input.
3. Integrate this `TagInput` in the Readability Grader to specify "Protected Keywords" and pass them to the AI endpoint.
4. Implement Gunning Fog, Dale-Chall, and ARI index calculation helpers inside the Readability Grader, displaying descriptions and scores dynamically based on the selected algorithm.

**Tech Stack:** React, Next.js, Lucide-React, Tailwind CSS.

---

### Task 1: Create Shared TagInput Component
**Files:**
- Create: `src/components/ui/tag-input.tsx`

- [ ] **Step 1: Write the TagInput component code**
  Create [tag-input.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/ui/tag-input.tsx) with the following content:
  ```tsx
  import React, { useState, KeyboardEvent } from "react"
  import { X } from "lucide-react"

  interface TagInputProps {
    tags: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
    className?: string
  }

  export function TagInput({ tags, onChange, placeholder = "Type tag and press Enter...", className }: TagInputProps) {
    const [inputValue, setInputValue] = useState("")

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault()
        addTag()
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        removeTag(tags.length - 1)
      }
    }

    const addTag = () => {
      const trimmed = inputValue.trim().replace(/,$/, "")
      if (trimmed && !tags.includes(trimmed)) {
        onChange([...tags, trimmed])
        setInputValue("")
      }
    }

    const removeTag = (indexToRemove: number) => {
      onChange(tags.filter((_, index) => index !== indexToRemove))
    }

    return (
      <div 
        className={`flex flex-wrap gap-1.5 p-2 bg-muted/30 border border-border rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all ${className || ""}`}
      >
        {tags.map((tag, idx) => (
          <span 
            key={idx} 
            className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-lg border border-primary/20"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-primary/70 hover:text-primary hover:bg-primary/25 rounded p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent border-0 outline-none focus:ring-0 p-0 text-sm min-w-[100px] text-foreground placeholder:text-muted-foreground/60"
        />
      </div>
    )
  }
  ```

- [ ] **Step 2: Commit TagInput Component**
  ```bash
  git add src/components/ui/tag-input.tsx
  git commit -m "feat: implement reusable shared TagInput component"
  ```

---

### Task 2: Update AI Readability Simplify API Route to Preserve Keywords
**Files:**
- Modify: `src/app/api/ai/improve-readability/route.ts`

- [ ] **Step 1: Accept protectedKeywords and update prompt builder**
  Modify [route.ts](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/ai/improve-readability/route.ts) to parse `protectedKeywords` from the body payload and append instructions to the Gemini prompt:
  ```typescript
  const { text, protectedKeywords = [] } = await req.json()
  ```
  And update the prompt rules:
  ```typescript
  const rules = [
    "- Simplify complex and multi-syllabic words with simpler synonyms.",
    "- Break up long, complex sentences into shorter, clear sentences.",
    "- Keep the original meaning, tone, and information intact.",
    "- Preserve or introduce clear formatting using standard Markdown. Use '#' or '##' for sections/headings, list blocks ('-' or '1.') for key items, and '**' for emphasis where it makes the text easier to scan.",
    "- Do NOT include HTML tag wrappers, code block backticks (like ```markdown), or other non-plain-text symbols. Just return the raw markdown content."
  ]

  if (Array.isArray(protectedKeywords) && protectedKeywords.length > 0) {
    rules.push(`- CRITICAL RULE: You MUST preserve the following terms exactly as they are without any modifications, simplification, or substitution: ${protectedKeywords.map(k => `"${k}"`).join(", ")}. Do NOT rewrite or simplify these words/phrases.`)
  }
  ```

- [ ] **Step 2: Commit API changes**
  ```bash
  git add src/app/api/ai/improve-readability/route.ts
  git commit -m "feat: add protected keywords support to AI readability improver prompt"
  ```

---

### Task 3: Update Readability Grader UI and Calculations
**Files:**
- Modify: `src/components/tools/readability-grader.tsx`

- [ ] **Step 1: Declare state and load TagInput component**
  Add state hooks for selected algorithm, protected keywords array, and import `TagInput` at the top of the file:
  ```typescript
  import { TagInput } from "@/components/ui/tag-input"
  ```
  Inside the component:
  ```typescript
  const [protectedKeywords, setProtectedKeywords] = useState<string[]>([])
  const [selectedAlgo, setSelectedAlgo] = useState<"flesch" | "gunning" | "dale" | "ari">("flesch")
  ```

- [ ] **Step 2: Implement readability algorithms helpers**
  Define formulas for Gunning Fog, Dale-Chall (approximate standard word familiarity), and ARI.
  We will add an approximate Dale-Chall word list set or use a simple logic checking word length/syllables:
  ```typescript
  // Simple check for Dale-Chall list approximation (familiar words are mostly <= 2 syllables and length <= 5)
  const isFamiliarWord = (word: string): boolean => {
    const cleanWord = word.toLowerCase()
    return cleanWord.length <= 5 || countSyllablesInWord(cleanWord) <= 2
  }
  ```
  Modify the `stats` useMemo hook to calculate multiple scores:
  ```typescript
  const stats = useMemo(() => {
    const cleanText = text.trim()
    if (!cleanText) {
      return { words: 0, sentences: 0, syllables: 0, characters: 0, readingTimeMin: 0, score: 0, gunningScore: 0, daleScore: 0, ariScore: 0 }
    }

    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1
    const wordsList = cleanText.match(/[a-zA-Z0-9'-]+/g) || []
    const words = wordsList.length || 1
    const characters = cleanText.length

    let syllables = 0
    let complexWords = 0
    let unfamiliarWords = 0
    wordsList.forEach(w => {
      const syl = countSyllablesInWord(w)
      syllables += syl
      if (syl >= 3) complexWords++
      if (!isFamiliarWord(w)) unfamiliarWords++
    })

    // Flesch Reading Ease
    const asl = words / sentences
    const asw = syllables / words
    const rawFlesch = 206.835 - (1.015 * asl) - (84.6 * asw)
    const score = Math.max(0, Math.min(100, Math.round(rawFlesch)))

    // Gunning Fog Index
    const percentComplex = (complexWords / words) * 100
    const rawGunning = 0.4 * (asl + percentComplex)
    const gunningScore = Math.max(1, Math.min(19, Math.round(rawGunning)))

    // Dale-Chall Readability Formula (approximate)
    const percentUnfamiliar = (unfamiliarWords / words) * 100
    let rawDale = 0.1579 * percentUnfamiliar + 0.0496 * asl
    if (percentUnfamiliar > 5) rawDale += 3.6365
    const daleScore = Math.max(1, Math.min(16, Math.round(rawDale)))

    // Automated Readability Index (ARI)
    const rawAri = 4.71 * (characters / words) + 0.5 * (words / sentences) - 21.43
    const ariScore = Math.max(1, Math.min(14, Math.round(rawAri)))

    const readingTimeMin = Math.max(1, Math.round(words / 200))

    return { words, sentences, syllables, characters, readingTimeMin, score, gunningScore, daleScore, ariScore }
  }, [text])
  ```

- [ ] **Step 3: Map interpretations and explanations of selected algorithm**
  Add a mapping object to interpret the selected algorithm score and display descriptions:
  ```typescript
  const algoDetails = useMemo(() => {
    switch (selectedAlgo) {
      case "gunning":
        return {
          title: "Gunning Fog Index",
          score: stats.gunningScore,
          interpretation: `Grade ${stats.gunningScore}`,
          desc: `Reflects the grade level needed to understand the text. Optimal web score is 8-10.`,
          explanation: "The Gunning Fog Index estimates the years of formal education needed to understand the text on a first reading. It combines sentence length and the percentage of complex words (three or more syllables)."
        }
      case "dale":
        return {
          title: "Dale-Chall Score",
          score: stats.daleScore.toFixed(1),
          interpretation: stats.daleScore <= 4 ? "4th Grade or below" : stats.daleScore <= 5.9 ? "5th-6th Grade" : stats.daleScore <= 7.9 ? "7th-8th Grade" : stats.daleScore <= 9.9 ? "9th-12th Grade" : "College level",
          desc: `Calculates readability based on word familiarity and sentence structure.`,
          explanation: "The Dale-Chall formula assesses readability by comparing words against a set of 3,000 familiar English words. Ideal for medical instructions, educational content, and general accessibility audits."
        }
      case "ari":
        return {
          title: "Automated Readability Index",
          score: stats.ariScore,
          interpretation: `Grade ${stats.ariScore}`,
          desc: `Reflects the US school grade level required to read.`,
          explanation: "ARI estimates the grade level based on characters per word and words per sentence. Since it calculates character density, it is highly suitable for technical coding manuals and developer docs."
        }
      default:
        return {
          title: "Flesch Reading Ease",
          score: stats.score,
          interpretation: gradeLevel.ease + " • " + gradeLevel.grade,
          desc: gradeLevel.desc,
          explanation: "Flesch Reading Ease scores content from 0 to 100 based on average sentence length and syllable count. A higher score indicates the text is easier to read (target is 60-70 for general public)."
        }
    }
  }, [selectedAlgo, stats, gradeLevel])
  ```

- [ ] **Step 4: Update Grader layout in JSX**
  - Replace the static Flesch Score card with a dynamic layout using `algoDetails` parameters.
  - Render a styled dropdown selector next to the score details.
  - Render the `TagInput` for Protected Keywords on the Raw Text panel.
  - Pass `protectedKeywords` during `handleImproveReadability` API fetch.

- [ ] **Step 5: Commit Readability Grader changes**
  ```bash
  git add src/components/tools/readability-grader.tsx
  git commit -m "feat: integrate multiple readability formulas and protected keywords in readability tool"
  ```

---

### Task 4: Upgrade Keyword Density UI and State
**Files:**
- Modify: `src/components/tools/keyword-density.tsx`

- [ ] **Step 1: Declare state and load TagInput component**
  Import `TagInput` at the top:
  ```typescript
  import { TagInput } from "@/components/ui/tag-input"
  ```
  Replace `targetKeywords` state string with a string array state hook:
  ```typescript
  const [targetKeywords, setTargetKeywords] = useState<string[]>(["SEO", "traffic", "search", "website"])
  ```

- [ ] **Step 2: Update Target Density Validator logic**
  Update `targetsAnalysis` calculations to use `targetKeywords` string array directly:
  ```typescript
  const targetsAnalysis = useMemo(() => {
    return targetKeywords.map(kw => {
      const parts = kw.match(/[a-zA-Z0-9'-]+/g) || []
      let count = 0
      
      if (parts.length > 0) {
        const matchLength = parts.length
        for (let i = 0; i <= parsedWords.length - matchLength; i++) {
          let match = true
          for (let j = 0; j < matchLength; j++) {
            const wordA = caseSensitive ? parsedWords[i + j] : parsedWords[i + j].toLowerCase()
            const wordB = caseSensitive ? parts[j] : parts[j].toLowerCase()
            if (wordA !== wordB) {
              match = false
              break
            }
          }
          if (match) count++
        }
      }
      
      const density = totalWordsCount > 0 ? (count / totalWordsCount) * 100 : 0
  ```

- [ ] **Step 3: Render TagInput component**
  Replace the standard `<input type="text">` inside `keyword-density.tsx` with:
  ```tsx
  <div className="space-y-1.5 pt-2">
    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Keywords</label>
    <TagInput 
      tags={targetKeywords} 
      onChange={setTargetKeywords} 
      placeholder="Type target keyword and press Enter..." 
    />
  </div>
  ```

- [ ] **Step 4: Commit Keyword Density changes**
  ```bash
  git add src/components/tools/keyword-density.tsx
  git commit -m "feat: upgrade Keyword Density Analyzer to use premium TagInput component"
  ```
