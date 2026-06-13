# Design Specification: SEO Readability Grader and Keyword Density Analyzer Improvements

This document specifies the implementation of multiple readability formulas, a new shared premium Tag Input component, and protected keyword preservation for AI content simplification.

## Proposed Changes

### 1. Shared Tag Input UI Component
* **New File**: `src/components/ui/tag-input.tsx`
* **API**:
  ```typescript
  interface TagInputProps {
    tags: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
    className?: string
  }
  ```
* **Behavior**:
  * Renders a styled input container wrapping dynamic tag badges and a borderless inline text input.
  * Adding tags: Adds the input value on `Enter`, `,` (comma), or when the field loses focus.
  * Removing tags: Clicking the `X` icon on a tag badge, or pressing `Backspace` when the text input is empty.

### 2. SEO Readability Grader Enhancements
* **File**: `src/components/tools/readability-grader.tsx`
* **Behavior**:
  * **Protected Keywords**: Uses the new `TagInput` component to collect protected terms.
  * **AI prompt update**: Pass the protected keywords array to the POST request payload.
  * **Readability Algorithm Select**: Adds a dropdown select box above the score to toggle between Flesch Reading Ease, Gunning Fog, Dale-Chall, and ARI.
  * **Algorithm Explanations**: Renders a dedicated card explaining the selected algorithm's formula and best use cases.

### 3. AI Simplify Backend Update
* **File**: `src/app/api/ai/improve-readability/route.ts`
* **Behavior**:
  * Accept `protectedKeywords?: string[]` from the request body.
  * Update the system instructions for the generative model to strictly preserve these exact terms during sentence simplification.

### 4. Keyword Density Analyzer Upgrade
* **File**: `src/components/tools/keyword-density.tsx`
* **Behavior**:
  * Replace the plain comma-separated text input for target keywords with the new `TagInput` component.
  * Adapt the analysis calculation logic to use the `targetKeywords` string array directly.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify compilation and type checking.

### Manual Verification
1. Open the SEO Readability Grader, add protected keywords (e.g., "optimization", "organic SEO"), trigger "Simplify with AI", and verify that the output preserves those words verbatim.
2. Toggle between different readability formulas in the dropdown and verify that the score and explanation description update correctly.
3. Open the Keyword Density tool, verify the new visual tag input for target keywords, add/remove tags, and check that the statistics recompute correctly.
