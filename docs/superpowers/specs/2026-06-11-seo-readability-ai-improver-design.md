# Design Spec: SEO Readability AI Improver

We will add an "AI Readability Improver" feature to the SEO Readability Grader. This feature allows users to automatically rewrite difficult or very difficult content to improve its Flesch Reading Ease score, previewing the proposed changes in a side-by-side comparison modal before applying them.

This feature is paid and will cost **2 AI Credits** per rewrite.

We will also support preserving Markdown styling during the rewrite and exporting/downloading the analyzed content as `.md` or `.rtf` (Rich Text Format) which is natively compatible with macOS Pages, MS Word, and Google Docs.

---

## Proposed Changes

### Backend API

#### [MODIFY] [route.ts](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/ai/improve-readability/route.ts)
- Update the prompt to Gemini (`gemini-2.5-flash`) to preserve or introduce clear formatting using standard Markdown (`#`, `##`, `-`, `1.`, `**`), while keeping the score above 60.

---

### Frontend UI / UX

#### [MODIFY] [readability-grader.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/readability-grader.tsx)
- Integrate a premium button: **"Auto-Simplify with AI ✨ (2 Credits)"** that appears when the text readability is evaluated as "Difficult" or "Very Difficult".
- Handle authentication & credit checks:
  - If the user is logged out, show a prompt/modal inviting them to sign in or upgrade.
  - If the user is logged in but has insufficient credits, display a notice/link to the pricing/upgrade page.
- Implement a side-by-side comparison modal:
  - **Left column:** Original text, highlighting complex/modified sentences (with markdown characters stripped).
  - **Right column:** Proposed text, highlighting simplified/new sentences (with markdown characters stripped).
  - **Actions:** "Cancel" or "Apply and Replace".
- Add **Export / Download buttons** at the bottom of the Analytics/Score Card:
  - **Download .md**: Download the raw editor text (or raw markdown version in the background) as a Markdown file.
  - **Download .rtf**: Convert Markdown styling to Rich Text Format (RTF) and download it, providing native compatibility with macOS Pages, MS Word, and Google Docs.
- When applying simplified draft:
  - Save raw Markdown in a background state `formattedText`.
  - Save stripped plain text in `text` so the editor does not show raw markdown characters.

---

## Verification Plan

### Automated Verification
- Run typescript validation: `npx tsc --noEmit`
- Run linting check to ensure no new warnings or issues are introduced.

### Manual Verification
- Test with simple vs. complex text inputs.
- Verify user authentication and credit deduction logic (checks if 2 credits are deducted from database user).
- Verify preview modal rendering and the side-by-side highlights.
- Verify exporting to `.md` and `.rtf` saves files with correct naming and structure, checking pages compatibility.
