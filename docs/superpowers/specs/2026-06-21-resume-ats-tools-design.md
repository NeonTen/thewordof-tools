# Design Spec: Resume Analyzer & ATS Score Checker

## Overview
Two new AI-powered tools added to the "AI Tools" suite:
1. **Resume Analyzer**: Takes a resume and provides detailed qualitative feedback on impact, action verbs, formatting, and grammar.
2. **ATS Score Checker**: Takes a resume AND a job description, calculates a match percentage, and highlights missing keywords.

## Architecture & Data Flow
1. **Frontend Inputs**:
   - Both tools will offer a dual-input method: **File Upload (PDF/DOCX)** or **Manual Text Paste**.
   - If a file is uploaded, the frontend will securely parse the text using `pdfjs-dist` (for PDFs) and `mammoth` (for DOCX) in the browser. This extracted raw text is then sent to the API, preventing large binary payloads.
   - For the ATS Checker, there will be an additional text area for pasting the "Job Description".
2. **Backend APIs**:
   - `POST /api/ai/resume-analyzer`: Streams AI feedback based on the resume text.
   - `POST /api/ai/ats-score-checker`: Streams score and keyword analysis based on the resume text and job description.
   - Both routes will check for authentication and deduct **1 AI Credit** (or 2, depending on preference) via the existing `verifyAndDeductCredits` utility. This satisfies the "free limit then pro" requirement.
3. **AI Models**:
   - `gemini-2.5-flash` will be used via the Vercel AI SDK (`streamText`) to stream the markdown output directly to the UI for a fast, responsive user experience.

## File Structure Additions
- `src/components/tools/resume-analyzer.tsx` (Client component with UI/State)
- `src/components/tools/ats-score-checker.tsx` (Client component with UI/State)
- `src/app/tools/ai-tools/resume-analyzer/page.tsx` (Server page mapping to the component)
- `src/app/tools/ai-tools/ats-score-checker/page.tsx` (Server page mapping to the component)
- `src/app/api/ai/resume-analyzer/route.ts` (API Route)
- `src/app/api/ai/ats-score-checker/route.ts` (API Route)
- *Note: Both tools will also be added to `src/config/tools.ts` and `src/app/sitemap.ts` to ensure they appear in the navigation and search engines.*

## Edge Cases Handled
- **File Parsing Errors:** If a complex PDF fails to parse, the UI will gracefully fall back to prompting the user to manually paste their text.
- **Credit Limits:** If the user has 0 credits, the button will disable and show the "Upgrade to Pro" link using the standard `limitReached` state logic already present in the app.
