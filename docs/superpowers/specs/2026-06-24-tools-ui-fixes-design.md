# Tools UI Fixes Design

## Goal
To apply minor UI/UX adjustments to the tools sidebar and CV Builder to improve user experience, and to clarify the intended flow for the ATS Score Checker.

## Scope
1. **Sidebar Navigation Initialization**: Update the default expanded state of the tools sidebar categories.
2. **AI CV Builder Pro Access**: Expand access to the "Import with AI" feature from Business tier to all Pro tiers.
3. **ATS Score Checker Assessment**: Confirm that the login requirement on step 1 is necessary and correct.

## Detailed Design

### 1. Sidebar Navigation
**Current State:** `Image & Code` and `Technical SEO` are explicitly set to `true` in the initial `openGroups` state of `src/components/layout/tools-nav.tsx`. This causes multiple categories to be open on initial load, cluttering the sidebar.
**Change:** Change both to `false`. Only `All Tools` will remain `true`. The existing `useEffect` will naturally expand whichever category the user is actively viewing.

### 2. AI CV Builder
**Current State:** The "Import with AI" button in `src/components/tools/cv-builder.tsx` is wrapped in `<ProGate feature="AI Resume Parser" isPro={isBusiness} tier="business">`.
**Change:** Update to `<ProGate feature="AI Resume Parser" isPro={isPro}>`. This ensures the feature is accessible to anyone with `PRO`, `BUSINESS`, or `ADMIN` roles.

### 3. ATS Score Checker
**Current State:** Users see an "AI Tool Requires Account" gate before they can paste their resume.
**Assessment:** The first step (Analyze ATS Match) calls the `/api/ai/ats-score-checker` endpoint, which utilizes an AI model and deducts an AI credit. Because AI is invoked at step 1, the login requirement cannot be deferred to step 2 (Improve Resume).
**Decision:** No code changes are required for the ATS Score Checker. The current login gate is working exactly as intended.

## Self-Review Checklist
- [x] No placeholders or "TBD"s.
- [x] Internal consistency maintained.
- [x] Scope is well-defined and small.
- [x] Ambiguities (such as the ATS Score Checker question) resolved explicitly.
