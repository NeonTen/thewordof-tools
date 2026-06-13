# Specification: "Try an Example" SEO Tools Spacing & Sample Data Refactoring

## 1. Goal & Context
Currently, several SEO tools are initialized with hardcoded mock text or results. While this demonstrates functionality, it can confuse users who expect a clean canvas when first opening a tool.

To resolve this, we will transition these tools to a clean-slate state and introduce a subtle "Try an Example" action trigger to allow users to load sample data on demand.

## 2. Target Components & Default States

### A. Broken Links Checker (`broken-links.tsx`)
* **Current Initial State**: Pre-populated with 6 mock scanned links in the table.
* **Refactored Initial State**:
  * `links` starts as an empty array (`[]`).
  * `totalFound` starts as `null`.
* **Example Loader**:
  * Next to the URL input label, render a button button labeled "Try an Example".
  * Clicking it sets `url` to `"https://tools.thewordof.com"` and initializes the `links` state with the standard 6 mock scanned links.

### B. SEO Readability Grader (`readability-grader.tsx`)
* **Current Initial State**: Pre-populated with an SEO explanation paragraph.
* **Refactored Initial State**:
  * `text` starts as an empty string (`""`).
* **Example Loader**:
  * Next to the text area label, render a button labeled "Try an Example".
  * Clicking it populates the text area with the default SEO paragraph.

### C. Keyword Density Analyzer (`keyword-density.tsx`)
* **Current Initial State**: Pre-populated with an SEO explanation paragraph.
* **Refactored Initial State**:
  * `text` starts as an empty string (`""`).
* **Example Loader**:
  * Next to the text area label, render a button labeled "Try an Example".
  * Clicking it populates the text area with the default SEO paragraph.

### D. SERP Previewer (`serp-preview.tsx`)
* **Current Initial State**: Pre-populated with hardcoded metadata for "TheWordOf Tools".
* **Refactored Initial State**:
  * `title` starts as `""`.
  * `description` starts as `""`.
  * `url` starts as `""`.
  * `slug` starts as `""`.
* **Example Loader**:
  * Next to the main container header, render a button labeled "Try an Example".
  * Clicking it populates the fields with the default metadata.

## 3. UI Design Standards
* The "Try an Example" button will be styled as a small, secondary action link (e.g., `text-xs font-bold text-primary hover:underline cursor-pointer`).
* When clicked, the inputs are updated instantly, triggering calculations dynamically.

## 4. Verification Plan
* Ensure `npm run build` passes with zero compiler/TypeScript warnings.
* Verify that all 4 tools start with a clean UI, showing no mock links, density percentages, or readability scores on load.
* Verify that clicking the "Try an Example" action link correctly loads the mock content.
