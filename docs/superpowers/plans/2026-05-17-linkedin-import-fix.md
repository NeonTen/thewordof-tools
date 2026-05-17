# LinkedIn Import Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the LinkedIn "Couldn't reach LinkedIn" connection error by using a whitelisted crawler User-Agent to bypass LinkedIn's 999 bot block, and accurately report HTTP 404 responses as private/restricted profile settings.

**Architecture:** Update the server fetch header in the API route, check specifically for response status 404 to return `profile_not_public`, and update the client-side error instructions to provide actionable steps for public visibility settings.

**Tech Stack:** Next.js API Routes, fetch headers, TypeScript, React components.

---

### Task 1: Update API Route User-Agent & 404 Status Handling

**Files:**
- Modify: `src/app/api/ai/linkedin-import/route.ts:40-56`

- [ ] **Step 1: Modify the fetch headers and status code check**
  Replace lines 40-56 in `src/app/api/ai/linkedin-import/route.ts` to use the crawler User-Agent and intercept 404 responses.

  ```typescript
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
          },
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (response.status === 404) {
          return NextResponse.json({ error: 'profile_not_public' }, { status: 400 })
        }

        if (!response.ok) {
          return NextResponse.json({ error: 'fetch_failed' }, { status: 500 })
        }
  ```

- [ ] **Step 2: Verify linting of modified route**
  Run: `npx eslint src/app/api/ai/linkedin-import/route.ts`
  Expected: Clean execution (0 errors).

- [ ] **Step 3: Commit Task 1**
  ```bash
  git add src/app/api/ai/linkedin-import/route.ts
  git commit -m "fix: update LinkedIn fetch User-Agent and intercept 404 private profile responses"
  ```

---

### Task 2: Enhance LinkedIn Import Modal Error Messages

**Files:**
- Modify: `src/components/tools/linkedin-import-modal.tsx:54-61`

- [ ] **Step 1: Update error mapping in the client modal**
  Replace the `errMap` in `src/components/tools/linkedin-import-modal.tsx` to return the highly descriptive, actionable instruction checklist for `profile_not_public`.

  ```typescript
        if (!res.ok || data.error) {
          const errMap: Record<string, string> = {
            invalid_url: "Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/your-name).",
            profile_not_public: "This profile appears to be private or restricted. To import, please ensure your profile's public visibility is turned ON in LinkedIn settings (Settings & Privacy -> Visibility -> Edit your public profile).",
            fetch_failed: "Couldn't reach LinkedIn. Check the URL or try again later.",
            parse_failed: "AI was unable to extract your profile info. Please verify your profile details."
          }
          setError(errMap[data.error] || "An unexpected error occurred during profile extraction.")
        }
  ```

- [ ] **Step 2: Verify linting of modified modal**
  Run: `npx eslint src/components/tools/linkedin-import-modal.tsx`
  Expected: Clean execution (0 errors).

- [ ] **Step 3: Commit Task 2**
  ```bash
  git add src/components/tools/linkedin-import-modal.tsx
  git commit -m "fix: update LinkedIn import modal error messages with public visibility guide"
  ```

---

### Task 3: Build Verification & Compilation Check

- [ ] **Step 1: Run production compiler check**
  Run: `npm run build`
  Expected: Compiled successfully with 0 errors.

- [ ] **Step 2: Commit plan changes**
  ```bash
  git add docs/superpowers/plans/2026-05-17-linkedin-import-fix.md docs/superpowers/specs/2026-05-17-linkedin-import-design.md
  git commit -m "docs: save and finalize design and plan files for LinkedIn import block fix"
  ```
