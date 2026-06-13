# "Try an Example" SEO Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean all initial sample text/data from Broken Links Auditor, SEO Readability Grader, Keyword Density Analyzer, and SERP Previewer, replacing them with a clean-slate state and an interactive "Try an Example" load button.

**Architecture:** Use local React state handlers inside page components to initialize inputs to empty values, rendering a subtle action button that populates states with pre-defined examples upon user interaction.

**Tech Stack:** Next.js, React, Lucide Icons

---

### Task 1: Broken Links Checker Clean Slate & Loader

**Files:**
- Modify: `src/components/tools/broken-links.tsx`

- [ ] **Step 1: Update initial state to clean slate**
  Change line 17:
  ```typescript
  const [links, setLinks] = useState<ScannedLink[]>([])
  ```
  And initialize `url` to `""`.

- [ ] **Step 2: Add Try an Example button in the JSX**
  Locate the URL scanning form. Render a small action button next to the "Scrape Page URL" label:
  ```tsx
  <div className="flex justify-between items-center text-xs text-muted-foreground font-bold px-1">
    <span>Scan Webpage URL</span>
    <button
      type="button"
      onClick={() => {
        setUrl("https://tools.thewordof.com")
        setLinks([
          { href: "https://tools.thewordof.com", text: "Home Overview", type: "internal", status: 200 },
          { href: "https://tools.thewordof.com/tools", text: "All Utilities Directory", type: "internal", status: 200 },
          { href: "https://tools.thewordof.com/pricing", text: "Plans & Pro Billing", type: "internal", status: 200 },
          { href: "https://google.com/search-console", text: "Google Webmaster Console", type: "external", status: 200 },
          { href: "https://example.com/broken-page-demo", text: "Legacy Resource Document", type: "external", status: 404 },
          { href: "https://httpstat.us/301", text: "Redirected Target API", type: "external", status: 301 }
        ])
        setTotalFound(6)
      }}
      className="text-xs font-bold text-primary hover:underline cursor-pointer focus:outline-none"
    >
      Try an Example
    </button>
  </div>
  ```

- [ ] **Step 3: Verify & Commit**
  Run: `npm run build`
  Verify that the broken links tool loads with zero rows in the results table, and clicking "Try an Example" loads the 6 mock links.
  ```bash
  git add src/components/tools/broken-links.tsx
  git commit -m "feat: add Try an Example to Broken Links checker"
  ```

---

### Task 2: SEO Readability Grader Clean Slate & Loader

**Files:**
- Modify: `src/components/tools/readability-grader.tsx`

- [ ] **Step 1: Update initial text state to empty string**
  Change line 44:
  ```typescript
  const [text, setText] = useState("")
  ```

- [ ] **Step 2: Add Try an Example button in the JSX**
  Locate the raw text input title area. Render a "Try an Example" action link:
  ```tsx
  <div className="flex justify-between items-center text-xs text-muted-foreground font-bold px-1">
    <span>Raw Text Content</span>
    <button
      type="button"
      onClick={() => {
        setText("Search engine optimization is the practice of orienting your website to rank higher on a search engine results page, so that you receive more traffic. The difference between organic SEO and paid advertising is that SEO involves organic ranking, which means you do not pay to be in that space. To make it simple, search engine optimization means taking a piece of online content and optimizing it so search engines like Google show it at the top of the page when someone searches for something.")
      }}
      className="text-xs font-bold text-primary hover:underline cursor-pointer focus:outline-none"
    >
      Try an Example
    </button>
  </div>
  ```

- [ ] **Step 3: Verify & Commit**
  Verify that the grader starts empty with a score of 0, and clicking the button fills in the sample text.
  ```bash
  git add src/components/tools/readability-grader.tsx
  git commit -m "feat: clean slate and add Try an Example to Readability Grader"
  ```

---

### Task 3: Keyword Density Analyzer Clean Slate & Loader

**Files:**
- Modify: `src/components/tools/keyword-density.tsx`

- [ ] **Step 1: Update initial text state to empty string**
  Change line 28:
  ```typescript
  const [text, setText] = useState("")
  ```

- [ ] **Step 2: Add Try an Example button in the JSX**
  Locate the raw text textarea header and insert the action button:
  ```tsx
  <div className="flex justify-between items-center text-xs text-muted-foreground font-bold px-1">
    <span>Content to Analyze</span>
    <button
      type="button"
      onClick={() => {
        setText("Search engine optimization (SEO) is the process of improving the quality and volume of website traffic to a website or a web page from search engines. SEO targets unpaid traffic rather than direct traffic or paid traffic. Unpaid traffic may originate from different kinds of searches, including image search, video search, academic search, news search, and industry-specific vertical search engines. Optimizing a website involves editing content, adding HTML tags, and modifying code to increase its relevance to specific keywords.")
        setTargetKeywords(["SEO", "traffic", "search", "website"])
      }}
      className="text-xs font-bold text-primary hover:underline cursor-pointer focus:outline-none"
    >
      Try an Example
    </button>
  </div>
  ```

- [ ] **Step 3: Verify & Commit**
  Verify that keyword density analyzer loads clean and empty, and clicking the button works correctly.
  ```bash
  git add src/components/tools/keyword-density.tsx
  git commit -m "feat: clean slate and add Try an Example to Keyword Density Analyzer"
  ```

---

### Task 4: SERP Previewer Clean Slate & Loader

**Files:**
- Modify: `src/components/tools/serp-preview.tsx`

- [ ] **Step 1: Update initial preview states to empty strings**
  Change:
  ```typescript
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [slug, setSlug] = useState("")
  ```

- [ ] **Step 2: Add Try an Example button in the JSX**
  Locate the form title or details section header, and render the load example link:
  ```tsx
  <div className="flex justify-between items-center">
    <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Snippet Preview Configuration</h2>
    <button
      type="button"
      onClick={() => {
        setTitle("TheWordOf Tools - Free Online Developer & SEO Utilities")
        setDescription("Access a suite of essential free online tools for developers and SEO professionals. Generate schema, validate robots.txt, check contrast, and analyze keyword density instantly.")
        setUrl("https://tools.thewordof.com")
        setSlug("technical-seo/serp-preview")
      }}
      className="text-xs font-bold text-primary hover:underline cursor-pointer focus:outline-none"
    >
      Try an Example
    </button>
  </div>
  ```

- [ ] **Step 3: Verify & Commit**
  Verify that the SERP Previewer starts with empty values, and clicking the button populates the fields.
  ```bash
  git add src/components/tools/serp-preview.tsx
  git commit -m "feat: clean slate and add Try an Example to SERP Previewer"
  ```

---

### Task 5: Compilation & Graph Update

- [ ] **Step 1: Run final check**
  Run: `npm run build`
  Expected: Successful compilation without warnings.

- [ ] **Step 2: Update Codebase Graph**
  Run: `graphify update .`
