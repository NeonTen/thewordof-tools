# Document Converter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 100% client-side Document Converter tool allowing users to convert DOCX, PDF, and Text/Markdown files with size limits and Pro tiers.

**Architecture:** Create a React file upload zone component that parses uploaded files via client-side libraries (`mammoth` for DOCX, `pdfjs-dist` for PDF, `marked` for Markdown) and exports them to PDF/DOCX (`jspdf`) in the browser.

**Tech Stack:** React, Next.js, Mammoth, PDF.js, jsPDF, Tailwind CSS.

---

### Task 1: Setup Dependencies and Navigation Linkage

**Files:**
- Create: [page.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/tools/image-code/doc-converter/page.tsx)
- Modify: [package.json](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/package.json), [tools-nav.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/layout/tools-nav.tsx)

- [ ] **Step 1: Install mammoth, jspdf, and pdfjs-dist packages**
  Run: `npm i mammoth jspdf pdfjs-dist`
  Expected: Installation completes successfully.

- [ ] **Step 2: Add navigation item in tools-nav.tsx**
  Add the "Doc Converter" route to the "Image & Code" section in [tools-nav.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/layout/tools-nav.tsx):
  ```typescript
  { title: "Doc Converter",   href: "/tools/image-code/doc-converter",   icon: FileText },
  ```

- [ ] **Step 3: Create the page routing entrypoint**
  Create [page.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/tools/image-code/doc-converter/page.tsx) to export metadata and render the new component:
  ```tsx
  import { DocConverter } from "@/components/tools/doc-converter"

  export const metadata = {
    title: "Document Converter - PDF, DOCX & Text Conversion",
    description: "Convert Word documents, PDFs, and text files client-side instantly.",
  }

  export default function DocConverterPage() {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight">Document Converter</h1>
          <p className="text-muted-foreground">
            Convert Word files, text documents, and PDFs entirely in the browser.
          </p>
        </div>
        <DocConverter />
      </div>
    )
  }
  ```

- [ ] **Step 4: Commit changes**
  ```bash
  git add package.json package-lock.json src/components/layout/tools-nav.tsx src/app/tools/image-code/doc-converter/page.tsx
  git commit -m "feat(doc-converter): set up packages, route, and sidebar navigation"
  ```

---

### Task 2: Create DocConverter Upload & State Component

**Files:**
- Create: [doc-converter.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/doc-converter.tsx)

- [ ] **Step 1: Create file upload dropzone structure**
  Implement file drop handler and states inside [doc-converter.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/doc-converter.tsx):
  ```tsx
  "use client"

  import { useState, useRef } from "react"
  import { FileText, ArrowRight, Loader2, Upload, Sparkles } from "lucide-react"

  interface UploadedFile {
    name: string
    size: number
    type: string
    content: ArrayBuffer | string
  }

  export function DocConverter() {
    const [file, setFile] = useState<UploadedFile | null>(null)
    const [converting, setConverting] = useState(false)
    const [error, setError] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (!selected) return
      setError("")

      const reader = new FileReader()
      reader.onload = () => {
        setFile({
          name: selected.name,
          size: selected.size,
          type: selected.name.split(".").pop()?.toLowerCase() || "",
          content: reader.result as ArrayBuffer || "",
        })
      }
      reader.readAsArrayBuffer(selected)
    }

    return (
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
        {!file ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-muted/20 cursor-pointer hover:bg-muted/40 transition-all space-y-4"
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".docx,.pdf,.txt,.md"
              onChange={handleFileChange}
              className="hidden" 
            />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <div>
              <p className="font-bold">Drag & Drop Document Here</p>
              <p className="text-xs text-muted-foreground mt-1">Supports .docx, .pdf, .txt, .md</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-muted/30 p-4 border rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-bold text-sm truncate max-w-md">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)} 
                className="text-xs font-bold text-destructive hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }
  ```

- [ ] **Step 2: Commit changes**
  ```bash
  git add src/components/tools/doc-converter.tsx
  git commit -m "feat(doc-converter): scaffold converter interface and file upload logic"
  ```

---

### Task 3: Implement Conversion Logic & Dynamic Libraries

**Files:**
- Modify: [doc-converter.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/doc-converter.tsx)

- [ ] **Step 1: Add mammoth.js and pdfjs dynamic imports**
  Add conversion functions for mammoth parser and PDF text extraction:
  ```typescript
  // Word to text/html
  const convertWord = async (fileBuffer: ArrayBuffer, type: "html" | "txt" | "md") => {
    const mammoth = await import("mammoth")
    const result = await mammoth.convertToHtml({ arrayBuffer: fileBuffer })
    const html = result.value
    if (type === "html") return html
    if (type === "txt") return html.replace(/<[^>]+>/g, "")
    // simple HTML to Markdown replacement
    return html
      .replace(/<h1>(.*?)<\/h1>/g, "# $1\n")
      .replace(/<h2>(.*?)<\/h2>/g, "## $1\n")
      .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
      .replace(/<li>(.*?)<\/li>/g, "* $1")
      .replace(/<[^>]+>/g, "")
  }

  // PDF page character extraction
  const convertPdfToText = async (fileBuffer: ArrayBuffer) => {
    const pdfjs = await import("pdfjs-dist")
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    const pdf = await pdfjs.getDocument({ data: fileBuffer }).promise
    let fullText = ""
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items.map((item: any) => item.str).join(" ")
      fullText += pageText + "\n\n"
    }
    return fullText
  }
  ```

- [ ] **Step 2: Add PDF generator exports via jsPDF**
  Generate clean PDF files from strings and trigger browser download:
  ```typescript
  const downloadPdf = async (text: string, filename: string) => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF()
    const margin = 10
    const pageHeight = doc.internal.pageSize.height
    const splitText = doc.splitTextToSize(text, 180)
    let y = 15

    for (let i = 0; i < splitText.length; i++) {
      if (y > pageHeight - 15) {
        doc.addPage()
        y = 15
      }
      doc.text(splitText[i], margin, y)
      y += 7
    }
    doc.save(filename.replace(/\.[^/.]+$/, "") + ".pdf")
  }
  ```

- [ ] **Step 3: Wire up options panel and download hooks**
  Add conversion action buttons under the uploaded file metadata card:
  - If DOCX uploaded: PDF, Markdown, Plain Text
  - If PDF uploaded (Pro check): Plain Text, Word (.docx blob)
  - If TXT/MD uploaded: PDF, Word (.docx blob)

- [ ] **Step 4: Commit changes**
  ```bash
  git add src/components/tools/doc-converter.tsx
  git commit -m "feat(doc-converter): implement client-side mammoth, pdfjs, and jspdf engines"
  ```

---

### Task 4: Subscription Limits & Usage Credits

**Files:**
- Modify: [doc-converter.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/doc-converter.tsx)

- [ ] **Step 1: Enforce Free/Pro file size limits**
  Wire up `useSession` to retrieve `session.user.role`. Restrict file uploads:
  - Free users: Block files > 2 MB.
  - Pro users: Block files > 25 MB.
  If blocked, show clear upgrade message and trigger Pro upgrade modals.

- [ ] **Step 2: Gate PDF conversions**
  Ensure PDF source conversions are Pro-only. If a Free user tries to upload or convert a PDF, intercept and show a pro upgrade banner.

- [ ] **Step 3: Deduct credits on success**
  Use the user's credits system to deduct a credit on successful conversion.

- [ ] **Step 4: Commit changes**
  ```bash
  git add src/components/tools/doc-converter.tsx
  git commit -m "feat(doc-converter): enforce free tier limits and pro gates"
  ```

---

### Task 5: Production Build & Verification

**Files:**
- None

- [ ] **Step 1: Run production build**
  Run: `npm run build`
  Expected: Compiles Next.js successfully with zero errors.

- [ ] **Step 2: Update graphify**
  Run: `graphify update .`
  Expected: Updates AST index references.
