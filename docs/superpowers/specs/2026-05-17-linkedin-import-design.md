# LinkedIn Profile Import — Design Spec

**Date:** 2026-05-17  
**Feature:** LinkedIn Profile Import for CV Builder  
**Status:** Approved  

---

## Overview

Allow Business-tier users to import their LinkedIn public profile into the CV Builder by pasting a profile URL. The server fetches the public HTML, passes the text to Gemini AI for extraction, and presents a preview modal before applying the data to the CV form.

---

## Decisions Made

| Question | Decision |
|---|---|
| Import mechanism | Paste URL → server-side fetch + Gemini AI extraction |
| Gate tier | Business only (not available on Free or Pro) |
| On import: what happens to existing data | Show preview first, user confirms before applying (full replace) |
| Error fallback | Surface specific error messages per failure type; no paid third-party API |

---

## Architecture

### New API Route

**`POST /api/ai/linkedin-import`**

- Accepts `{ url: string }` in the request body
- Validates URL format (must be a `linkedin.com/in/` URL)
- Fetches the profile page using realistic browser `User-Agent` and `Accept` headers; 10-second timeout
- Strips the HTML to readable text (removes `<script>`, `<style>`, nav/footer elements)
- Sends the text to Gemini with a structured extraction prompt
- Returns `LinkedInImportResult` on success, or `{ error: ErrorCode }` on failure
- Protected: requires `BUSINESS` or `ADMIN` role (checked server-side via `auth()`)

### New Components

**`LinkedInImportModal`** (`src/components/tools/linkedin-import-modal.tsx`)

- Client component
- State machine: `idle → loading → preview → error`
- `idle`: URL input field + "Fetch & Preview" button + public-profile reminder note
- `loading`: Spinner + "Fetching profile… AI is extracting your data"
- `preview`: Passes extracted `LinkedInImportResult` to `LinkedInPreviewModal`
- `error`: Friendly message per `ErrorCode`, "Try Again" resets to `idle`
- Props: `onApply: (data: LinkedInImportResult) => void`, `onClose: () => void`

**`LinkedInPreviewModal`** (`src/components/tools/linkedin-preview-modal.tsx`)

- Client component
- Displays extracted data in collapsible sections: Personal Details, Summary, Experience, Education, Skills
- Each section has a green checkmark if data was found
- "Apply to CV" button → calls `onApply(data)` and closes both modals
- "← Try Again" button → goes back to `LinkedInImportModal` URL input state

### Modified Files

**`src/components/ui/pro-gate.tsx`**

Add optional `tier?: 'pro' | 'business'` prop (default: `'pro'`). When `tier='business'`, the upgrade modal reads "Business Feature" with the description "requires a Business subscription". All other behaviour (lock overlay, `/pricing` link, animation) is unchanged. This is a backward-compatible change — all existing `<ProGate>` usages without `tier` continue to work.

**`src/components/tools/cv-builder.tsx`**

- Add `isBusiness?: boolean` prop (default: `false`)
- Add "Import from LinkedIn" button to the Personal Details card header
- Wrap button in `<ProGate tier="business" isPro={isBusiness} feature="LinkedIn Import">`
- Button opens `LinkedInImportModal` via local `useState` flag
- `onApply` handler maps `LinkedInImportResult` onto `cv`, `experience`, `education` state

**`src/app/tools/cv-builder/page.tsx`**

- Derive `isBusiness` from session: `role === 'BUSINESS' || role === 'ADMIN'`
- Pass `isBusiness={isBusiness}` to `<CvBuilder>`

---

## Data Contracts

### `LinkedInImportResult`

```ts
type LinkedInImportResult = {
  name: string
  title: string
  location: string
  summary: string
  skillsText: string          // comma-separated string → maps to cv.skillsText
  experience: Array<{
    company: string
    role: string
    period: string
    desc: string
  }>
  education: Array<{
    school: string
    degree: string
    period: string
  }>
}
```

Fields that Gemini cannot find are returned as empty strings `""` or empty arrays `[]`. The preview modal shows only sections where data was found.

### API Error Codes

| Code | Condition | User-facing message |
|---|---|---|
| `profile_not_public` | LinkedIn served a login wall or empty profile | "We couldn't read this profile. Make sure it's set to Public on LinkedIn." |
| `fetch_failed` | Network error or timeout (>10s) | "Couldn't reach LinkedIn. Check the URL and try again." |
| `parse_failed` | Gemini returned no usable fields | "AI couldn't extract your profile. Try a different URL format (e.g. linkedin.com/in/your-name)." |
| `invalid_url` | URL doesn't match `linkedin.com/in/` | "Please enter a valid LinkedIn profile URL (e.g. linkedin.com/in/your-name)." |
| `unauthorized` | User is not Business or Admin | 403 response — client should not reach this state |

---

## UI Flow

```
User (Business) → clicks "Import from LinkedIn" in Personal Details card header
  └─ LinkedInImportModal opens (idle state)
       └─ User pastes URL → clicks "Fetch & Preview"
            └─ loading state shown
                 ├─ success → LinkedInPreviewModal opens
                 │    ├─ "Apply to CV" → CV state updated, both modals close
                 │    └─ "← Try Again" → back to idle state in LinkedInImportModal
                 └─ error → error message shown, "Try Again" resets to idle

User (Free/Pro) → clicks "Import from LinkedIn"
  └─ ProGate intercepts → "Business Feature" upgrade modal → links to /pricing
```

---

## Error Handling

- **Login wall detection:** Check if fetched text contains known LinkedIn login-redirect markers (e.g. `"authwall"`, `"Join to see"`) — if so, return `profile_not_public`.
- **Timeout:** Use `AbortController` with 10-second timeout on the fetch call.
- **Gemini parse failure:** If the returned JSON has all empty values, return `parse_failed` rather than presenting an empty preview.
- **Rate limiting:** No additional rate limiting beyond what LinkedIn naturally provides. The feature is Business-only, so abuse surface is small.

---

## Pricing Page Update

Add "LinkedIn Profile Import" as a row to the feature comparison table:

| Feature | Free | Pro | Business |
|---|---|---|---|
| LinkedIn Profile Import | — | — | ✓ One-click import |

---

## Testing Plan

1. **Unit tests** for the Gemini extraction prompt using HTML fixtures:
   - Public profile HTML → expect populated `LinkedInImportResult`
   - LinkedIn login-wall HTML → expect `profile_not_public` error
   - 404 / empty page → expect `parse_failed` error

2. **Integration test** for `POST /api/ai/linkedin-import`:
   - Mock `fetch` to return each fixture
   - Assert correct response shape or error code

3. **Manual smoke test:** End-to-end with a real public LinkedIn URL — verify the preview modal populates correctly and "Apply to CV" pre-fills all CV fields.

---

## Out of Scope

- LinkedIn OAuth integration (not needed for this approach)
- Saving import history to the database
- Importing the profile photo from LinkedIn (LinkedIn blocks hotlinking; user can upload manually)
- Parsing LinkedIn's JSON-LD `<script>` tags as a structured data fallback (can be added later if plain-text extraction proves unreliable)
