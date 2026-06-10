# Design Spec: SEO Readability Grader Improvements

We will update the SEO Readability Grader to:
1. **Explain the Technique**: Rename UI headers to "Flesch Reading Ease Score" and add detailed explanations explaining the formula calculation and its indirect but critical impact on Google ranking factors.
2. **Improve Contrast in Dark Mode**: Update the CSS/Tailwind classes for difficult reading difficulty levels to use a high-contrast red theme (`text-red-600 dark:text-red-400 bg-red-500/10 dark:bg-red-500/20 border-red-500/20 dark:border-red-500/30`) instead of low-contrast destructive classes.

## Proposed Changes

### SEO Readability Grader

#### [MODIFY] [readability-grader.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/readability-grader.tsx)
- Modify `gradeLevel` color bindings for "Difficult" and "Very Difficult" to high-contrast red.
- Update header text inside the score card container to read "Flesch Reading Ease Score".
- Update the FAQ section to explain Flesch Reading Ease and its relationship to Google/search engine crawlers.

## Verification Plan

### Automated Verification
- Run typescript compilation (`npx tsc --noEmit`) to verify no compilation or type validation issues.
