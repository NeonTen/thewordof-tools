# Changelog

## [1.2.9] - 2026-08-18

### Changed
- **AI Chat Model Migration (`openai/gpt-oss-20b`)**:
  - Migrated the Groq AI Chat assistant (`/api/ai/chat`) from the decommissioned `llama-3.1-8b-instant` to `openai/gpt-oss-20b` for ultra-fast, uninterrupted conversational navigation and higher rate limits.
- **AI Assistant Knowledge & Pricing Tiers**:
  - Enhanced system prompt in `/api/ai/chat` with detailed Free, Pro, and Business tier limits (e.g. 3 invoices/month on Free vs unlimited with branding on Pro, 20 vs 500 vs 2,000 AI credits, dynamic QR codes, batch limits).
  - Standardized AI response link formatting to use clean relative markdown paths (e.g. `[Pricing](/pricing)`, `[Invoice Generator](/tools/document-tools/invoice-generator)`) without host/domain prefixes.

## [1.2.8] - 2026-08-13

### Fixed
- **Canonical Domain & Sitemap URLs Standardization (`www` Subdomain)**:
  - Standardized all canonical website URLs, XML sitemap entries (`sitemap.ts`), `robots.txt` (`robots.ts`), metadata base (`layout.tsx`), JSON-LD Organization schema, email transactional fallbacks (`email.ts`), and AI documentation files (`public/llms.txt`, `public/llms-full.txt`) to include the `www` subdomain (`https://www.thewordof.com`).

## [1.2.7] - 2026-08-12

### Fixed
- **Category Index & Homepage Card Links**:
  - Updated broken tool card links across Image & Code (`/tools/image-code`), Design (`/tools/design`), Calculators (`/tools/calculators`), and the homepage to point directly to their nested category subpaths (e.g. `/tools/image-code/image-converter`).
- **AI CV Builder - Resume Parser Response & Authorization**:
  - Re-architected `/api/ai/cv-parser` endpoint to return structured JSON error objects for all status codes (401, 403, 400, 500) instead of plain text responses.
  - Resolved client-side `SyntaxError` during JSON parsing and replaced generic network error overlay with precise server error messages.
  - Enabled credit-based deduction (`verifyAndDeductCredits`) for AI resume parsing across user tiers.

## [1.2.6] - 2026-08-08

### Added
- **Financial Calculators (Loan EMI, SIP, Compound Interest) Overhaul**:
  - Added direct numeric `<Input>` fields next to sliders in Loan EMI, SIP Return, and Compound Interest calculators for precise manual value entry.
  - Added full year-by-year repayment/growth schedule tables with interactive expandable 12-month accordion reports.
  - Added "Expand All Years" / "Collapse All Years" quick toggle controls.
- **AI CV Builder - Free Tier Limits & Inline Website Field**:
  - Unlocked first 2 entries for Experience, Projects, and Education for Free users without ProGate overlays.
  - Added 50%-50% inline Location & Website/Portfolio field in Personal Details, supported in AI resume parser and rendered dynamically across all 10 CV templates.

### Fixed
- **Pricing & Payment UX**:
  - Updated unauthenticated pricing card CTA buttons to "Get Started with Pro" and "Get Started with Business" instead of "Upgrade to...".
  - Only show "Current Plan" on Free plan card when user is logged in.
  - Rendered clean "Sign In Required" prompt inside payment dialog for unauthenticated visitors without breaking button grid layout.
  - Lazy-loaded PayPal SDK script only when payment dialog is open, with fallback UI on network or script failure.
- **SEO & Routing**:
  - Removed obsolete 301 permanent redirects from `next.config.ts`.
  - Audited `sitemap.ts` to include all 54 public routes including `/forgot-password`.

## [1.2.5] - 2026-08-01

### Added
- **AI CV Builder - Full-Width Accordion & Live Preview Redesign**:
  - Re-architected editor layout from a cramped two-column grid into a clean full-width accordion interface (`w-full`) for focused section editing.
  - Added sticky top control toolbar consolidating template selection, profile photo uploader, skill display mode toggle (`Text` vs `Bars`), AI resume import, cloud actions (`Load` & `Save`), and `Export PDF`.
  - Added **Preview CV** button in top toolbar launching an instant full-screen A4 sheet live preview modal overlay (`z-[100]`) with template switcher and PDF export.
  - Added bullet list & paragraph auto-formatting helper tips underneath all editor `<Textarea>` input fields.

### Fixed
- **UI & Layout Alignment**:
  - Vertically centered accordion expand/collapse trigger arrows (`items-center`) and aligned item card headers with clean `Remove` action buttons across Experience, Projects, Education, Skills, and Custom Sections.
  - Elevated `@/components/ui/select` popover portal `z-index` to `z-[200]` so template selection dropdown menus render properly above modal overlays.

## [1.2.4] - 2026-07-30

### Added
- **AI CV Builder - Editable Headings & Pro Custom Sections**:
  - Made default section headings (Summary, Skills & Expertise, Experience, Projects, Education) inline-editable in the editor panel; updates reflect dynamically across all 10 CV templates and PDF exports.
  - Added "+ Add Custom Section" button for Pro/Business users under Summary to create custom content sections (e.g. Certifications, Key Achievements, Languages, Publications) rendered in all 10 templates.
- **AI CV Parser Integration**:
  - Updated Gemini parser schema and prompt to extract summary section headings (e.g. "Professional Summary", "Executive Profile") and detect structured custom sections after Summary.
  - Added Custom Sections preview block to `AIPreviewModal` and mapped parser output directly into CV Builder state upon import.
- **Dashboard Redesign & Credit Usage History**:
  - Expanded dashboard right main panel to full width across `/dashboard`, `/dashboard/billing`, and `/dashboard/settings`.
  - Added new `CreditUsageHistory` component displaying real-time activity logs from Prisma with filter pills (`All`, `AI Tools`, `Docs`, `Other`), quick search, and scrollable container.
  - Reorganized dashboard layout into a 2-column layout with Current Plan card positioned first and Priority Email Support moved under Tool Requests.

### Changed
- **Responsive Layout & Navigation**:
  - Updated sidebar navigation title from "Overview" to "Dashboard".
  - Updated layout breakpoint for sidebar navigation, header navigation, and multi-column grids from 768px (`md`) to 1280px (`xl`) across layout shells and tool pages.
  - Configured matching heights for left and right dashboard card stacks.

## [1.2.3] - 2026-07-27

### Added
- **ATS Score Checker Improvements**:
  - Automatically re-evaluates the improved resume against the job description to calculate and display the new ATS match score and score boost percentage.
  - Added a CTA banner in the "Improved Resume (ATS Optimized)" card linking directly to the AI CV Builder (`/tools/ai-tools/cv-builder`).
  - Integrated seamless `localStorage` handoff so clicking the CTA opens the AI Parser modal in the CV Builder pre-filled with the improved resume text.

## [1.2.2] - 2026-07-21

### Fixed
- **llms.txt Tool Improvements**:
  - Filtered query parameters, hash anchor links, static files (images, CSS, JS, PDFs, etc.), feeds/RSS, and technical/REST API endpoints from crawled website/sitemap URLs to ensure only clean content links are output in the generated `llms.txt` file.
  - Aligned client-side credit decrement logic to subtract `3` credits (matching the actual backend credit cost) instead of `1` credit.

## [1.2.1] - 2026-07-10

### Fixed
- **Security Headers & Image Converter**:
  - Allowed `blob:` URLs in the `Content-Security-Policy` image source (`img-src`) and worker source (`worker-src`) rules in `next.config.ts`. This fixes the broken image preview/drag-and-drop issue caused by the strict security headers introduced in v1.2.0.

## [1.2.0] - 2026-07-01

### Added
- **AI Search & GEO Readiness**:
  - Added a comprehensive `public/llms-full.txt` file containing detailed descriptions, documentation, and specs of all platform tool suites (AI Tools, Calculators, Design Tools, Document Tools, Image/Code Utilities, and Technical SEO Tools) for AI agent parsing.
  - Implemented Organization schema markup in the layout JSON-LD.
- **Agentic SEO Skills**:
  - Integrated the full custom agentic SEO skills framework under `.agents/skills` to automate on-page and technical SEO checks locally.

### Changed
- **SEO & Readability Improvements**:
  - Simplified landing page hero and feature descriptions in `src/app/page.tsx` to lower sentence complexity and improve Flesch reading ease scores.
  - Shortened default meta description length to under 160 characters in `src/app/layout.tsx` to prevent search engine truncation.
  - Injected Organization JSON-LD structured data in `src/app/layout.tsx` for entity credibility.
  - Configured 6 recommended security headers globally (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy) in `next.config.ts`.
  - Configured `robots: { index: false, follow: true }` metadata for the `/changelog` route to make it noindex.

## [1.1.9] - 2026-06-24

### Changed
- **Pricing & Marketing**:
  - Redesigned the "Detailed Feature Comparison" table on the pricing page into organized, value-focused categories (Usage & Limits, AI & Generative Tools, SEO & Document Suite, Support & Perks).
  - Updated the Pro tier pricing card to explicitly state the inclusion of "AI parser import".
- **AI Chatbot**:
  - Migrated the underlying AI provider from Google Gemini to Groq (`llama-3.1-8b-instant`) to ensure instantaneous responses and bypass rate-limiting bottlenecks.
  - Improved prompt guardrails: the assistant will intelligently answer questions related to featured platform technologies (e.g. QR Codes, ATS), but gracefully decline completely off-topic questions.
  - Fixed a UI state mutation bug that caused unanswered prompts to bleed into the next message.
  - Fixed the chat Send button click handler and z-index overlap issues.
- **UI/UX Polishes**:
  - Updated sidebar navigation so only the "All Tools" group is expanded by default.
  - Adjusted `<ProGate>` access to enable "Import with AI" for all Pro users in the AI CV Builder.
## [1.1.8] - 2026-06-23

### Added
- **AI Resume & ATS Tools**:
  - Launched **ATS Score Checker** to compare resumes against job descriptions.
  - Launched **Resume Analyzer** for AI-powered critique, scoring, and improvement tips.
  - Added **Resume Fixer/Improver** functionality to rewrite and optimize resume text automatically.
  - Added API routes supporting the new resume analysis features.
- **Developer Tools**:
  - Added public `llms.txt` file and generator following standard `llmstxt.org` rules.
  - Redesigned `llms.txt` UI to support scraping from sitemap or website URLs.

### Changed
- **Pricing & Marketing**:
  - Added "50% off first 100 users" badge to pricing cards.
- **UI/UX Polishes**:
  - Redesigned and improved layouts for ATS checker and Resume analyzer tools.
  - Added direct `.md` download button for the improved resume.
  - Cleaned up duplicate related tools links and improved SEO content for resume tools.
  - Updated tools sitemap to include all newly launched features.

## [1.1.7] - 2026-06-21

### Added
- **AI Chatbot**:
  - Implemented a fully functional floating AI assistant to help users navigate tools.
  - Added auto-scroll to latest messages and auto-send quick reply functionalities.
  - Upgraded the language model to `gemini-1.5-flash-latest`.
  - Made the bot dynamically aware of all available site tools.
- **Document Tools**:
  - Launched PDF Merger and PDF Watermarker tools.

### Changed
- **Pricing & Marketing**:
  - Redesigned landing page UI/UX to improve conversion and readability.
  - Updated hero banner text to highlight a "50% off lifetime access for the first 100 users" special.
  - Added explicit "50% Off (First 100)" badges directly into the Pricing Cards.
- **SEO & Architecture**:
  - Migrated all hardcoded page metadata to the centralized `generateSeoMetadata` helper for consistent SEO.
  - Reorganized Document Tools (moved doc-converter) and updated the sitemap accordingly.

### Fixed
- **UI/UX Polishes**:
  - Fixed RSC (React Server Components) import issue causing the AI bot to crash.
  - Adjusted AI bot Send button alignment to be perfectly centered.
  - Reduced hero title size by removing the overly large `md:text-8xl` class.
  - Enforced strict active state matching in the sidebar navigation.

## [1.1.6] - 2026-06-14

### Added
- **Document Converter**:
  - Launched new tool to seamlessly convert document formats like PDF, DOCX, and TXT entirely in the browser.

### Changed
- **Navigation & Routing**:
  - Reorganized sidebar navigation: Moved "Doc Converter" from "Image & Code" to "Document Tools".
  - Renamed category "Finance & Dev" to "Document Tools" and updated related URLs to use `/tools/document-tools` prefix.
  - Refactored `/tools/document-tools` page into a standalone category landing page instead of a filtered list.

### Fixed
- **Document Converter**:
  - Fixed DOCX→PDF double-margin bugs, right-edge text clipping, and blank page rendering issues using nested wrapper visibility strategies.
  - Switched to native jsPDF text rendering for TXT→PDF conversions.
  - Fixed multi-page margin handling, page break bands, and resolved garbled emoji remnants using DOM-level text node cleanup.
- **Links & SEO**:
  - Cleaned up internal routing links pointing to legacy `/finance-dev` paths.
  - Updated sitemap entries to reflect new `document-tools` routing structure.


## [1.1.5] - 2026-06-13
### Added
- **AI Resume & CV Builder**:
  - Added 5 new premium templates: **Executive** (formal serif layout), **Minimalist Pro** (clean asymmetrical design), **Developer Pro** (indigo-themed grid details), **Metro Grid** (boxed structural dividers), and **Accent Left** (emerald side-accent layout).
  - Added support for parsing and mapping projects during raw text/LinkedIn AI imports.

### Changed
- **Pricing & Marketing**:
  - Updated pricing plan feature lists and detailed comparison tables on both the Pricing page and Homepage to highlight 10 premium resume templates and AI parser improvements.
  - Updated the homepage features grid to highlight Dynamic QR Code parameter/export options, CV templates, and SEO Readability Grader capabilities.
- **AI CV Builder SEO**:
  - Added detailed educational and SEO paragraphs explaining CV building, ATS optimizations, and parser mechanics at the bottom of the page.
  - Adjusted bottom container padding to match other tools and align spacing cleanly before `Related Tools`.

### Fixed
- **AI Resume Parser**:
  - Fixed "Import with AI" to correctly extract and map contact details (`email` and `phone`).
- **AI CV Builder Print Styles**:
  - Hid breadcrumbs and `ToolHeader` titles globally during printing.
  - Set print margins to A4 portrait `15mm` top/bottom to prevent clipping on multi-page printouts, and added a `@page :first` top margin override to keep page 1 headers aligned with the top of the A4 paper.
  - Implemented client-side sync converting text skills to/from bars when switching edit tabs.

## [1.1.4] - 2026-06-12

### Added
- **Broken Link & Anchor Auditor**:
  - Added checkboxes/options to exclude `<header>`, `<footer>`, and `<nav>` elements from link scans.
  - Implemented client-side limits showing total page links vs the 30-URL free scan limit in an inline notice.

### Changed
- **Schema Generator**:
  - Redesigned and highlighted the AI Smart Generator section with amber gradients, borders, and shadows to prevent it from appearing faded or invisible in the free version.
- **Work Report Generator**:
  - Restyled delete and clear formatting actions to use higher-contrast red colors in dark mode.

### Fixed
- **Broken Link & Anchor Auditor**:
  - Added `shrink-0` layout sizing wrapper to prevent the `<ProGate>` element overlay from stretching and intercepting clicks on the URL text input.
- **Color Contrast Checker**:
  - Added support for recursive CSS variable lookups and Tailwind utility class color resolution to prevent false positives.

## [1.1.3] - 2026-06-11

### Added
- **SEO Readability & Content Grader**:
  - Implemented paid (2 AI credits) **AI Readability Improver** utilizing Gemini models to simplify text.
  - Added a side-by-side comparative diff preview modal highlighting modifications (complex vs simplified sentences) with Markdown markers stripped.
  - Implemented **Export / Download** actions to download content in Markdown (`.md`), universal macOS Pages-compatible Rich Text Format (`.rtf`), and MS Word (`.docx`).
  - Built an interactive export dropdown button displaying options in the theme's blue color only after draft application.
  - Added a **PRO badge** on the Readability Grader card within the Technical SEO tools directory.

### Changed
- **Pricing & Copy Updates**:
  - Removed explicit tool count from "All 25 tools included" to show "All utility tools included" for continuous updates.
  - Removed `(shared pool)` label from AI credit features.
  - Synchronized Pricing Page and Homepage FAQs, adding explicit notes clarifying account requirements for AI credit utilization.

## [1.1.2] - 2026-06-10

### Added
- **Broken Link & Anchor Auditor**:
  - Implemented client-side pagination with page size selector, item range indicator, and navigation buttons.
  - Added slow scan user notification alert displaying after 8 seconds of active scanning.
- **SEO Readability & Content Grader**:
  - Added Flesch Reading Ease score guide text explaining readability relationships.

### Changed
- **Schema Generator Simplification**: Removed the 'Google Search Preview' option, preview mockup rendering engine, and tab states from the schema generator UI.
- **SEO Readability & Content Grader**:
  - Renamed score sections to Flesch Reading Ease.
  - Enhanced text color contrast for difficulty levels in dark mode (resolved illegible red text).

### Fixed
- **AI Schema Generation Decoupling**: Decoupled the AI Smart Generator from the manual Schema Type select dropdown, preventing AI output from modifying the form editor fields.
- **Broken Link & Anchor Auditor**:
  - Implemented bot-check bypass logic for major social network domains returning 400, 403, 503, or 999 status codes due to anti-scraping blocks.
- **Keyword Density & N-Gram Analyzer**:
  - Refactored matching algorithms using tokenized regex and a sliding window to correctly highlight arbitrary length multi-word keyword phrases.

## [1.1.1] - 2026-06-09

### Fixed
- **Yearly Subscription Credit Reset**: Fixed a bug where yearly subscribers only reset their AI credits once a year. Credits now correctly reset on a monthly basis for all subscription intervals.

## [1.1.0] - 2026-06-08

### Added
- **Technical SEO Suite**:
  - **SERP Previewer & Meta Tag Analyzer**: Live mobile and desktop Google Search snippet previews with high-contrast light mode cards.
  - **Keyword Density & N-Gram Analyzer**: Scrapes body text and parses 1/2/3-grams with stopword exclusions.
  - **SEO Readability & Content Grader**: Flesch-Kincaid reading ease grader with synonym recommendations and dynamic page content crawling.
  - **Broken Link & Anchor Auditor**: Scrapes page outbound links and audits status codes (404s/redirects).
  - **Schema Markup Generator**: Rich visual structured JSON-LD builder.
  - **Sitemap Validator**: Scrapes and audits XML sitemap paths.
  - **Robots.txt Generator**: Configure and test user-agent crawler directives.
- **Design & Color Utilities**:
  - **Color Contrast Checker**: WCAG 2.1 compliance checker with AA/AAA pass indicators.
  - **Color Palette Generator**: Harmonizes custom mathematical palettes.
  - **CSS Gradient Generator**: Visual designer for linear/radial gradients.
  - **Gradient Palette Generator**: Generates 5 coordinating visual gradients.
- **AI-Powered Tools**:
  - **AI Social Caption Generator**: Platform-optimized captions powered by Gemini.
  - **AI Prompt Optimizer**: Tailor system-instructions for Claude, ChatGPT, and Gemini.
  - **AI SEO Meta Generator**: High-converting title and description suggestions.
  - **AI CV & Resume Builder**: Dynamic resume PDF generator with ATS parsing.
  - **AI Product Description Generator**: E-commerce copywriting builder.
- **Financial & Developer Utilities**:
  - **Invoice Generator**: Dynamic PDF business invoices with custom branding.
  - **Work Report Builder**: Daily task log sheet compiler.
- **Monetization & Limits**:
  - Gated tools under Pro/Business limits (3-5 monthly crawls/scrapes for free tier).
  - Integrated Razorpay/PayPal checkout logic.
  - Added original strike pricing indicators next to subscription cards.
- **Changelog timeline**: Public `/changelog` timeline rendering root markdown logs.

### Changed
- Relocated and consolidated all SEO Audit tools under `/tools/technical-seo/`.
- Optimized the tools directory filtering list to use a styled select dropdown menu.
- Expanded page inner content widths to `max-w-[1440px]` on marketing pages.

## [1.0.3] - 2026-06-07

### Added
- **QR Code Analytics tab toggle**: Added Browser & OS analytics tabs.
- **Device type parsing**: Added User-Agent device categorization (Mobile, Desktop, Tablet) for QR scan tracking.
- **Decimal ticks disabled**: Removed decimal steps from timeline charts and analytics BarCharts.
- **Policy Pages**: Created a new Refund Policy page and mapped it to the sitemap.

### Changed
- Updated landing page testimonial placeholders to use John Doe instead of Sajid Khan.
- Replaced Sajid Khan demo values with clean templates in the AI CV parser and Work Report generators.

## [1.0.2] - 2026-06-02

### Added
- **Password Reset Flow**: Implemented secure forgot-password and reset-password workflows with warning notices.
- **Invoice Modals**: Added Save and Load draft modals to the Invoice Generator.

### Changed
- Center-aligned form layouts for forgot-password and reset-password screens.

## [1.0.1] - 2026-06-01

### Added
- **Transactional Welcome Emails**: Automated welcome notifications sent via Resend upon successful PayPal and Razorpay subscription webhook activation.

## [1.0.0] - 2026-05-31

### Added
- **Pricing Core Config**: Added central `PLAN_PRICING` configurations mapping INR and USD tiers.
- **Multi-currency checkout support**: Enabled INR/USD toggle with automatic timezone detection and PayPal dialog fallbacks.
- **AI Credit System**: Integrated database credit fields, `verifyAndDeductCredits` API endpoints, and a `CreditOverview` dashboard component.
- **Pro Gating**: Integrated the `ProGate` and locks components using the Crown branding design.
- **Mobile Menu**: Added a sliding sidebar drawer for mobile devices.

## [0.2.0] - 2026-05-24

### Added
- **Product Description Generator**: AI-powered generator for e-commerce listings with dynamic feature additions and optional image context.
- **QR Code Generator**: Fully styleable QR code generator using colors and download functionality.
- **Word / Letter Counter**: Live word, character, and line counts with optional space inclusion toggling.
- **GST Calculator**: Global tax calculator covering India (IN), Australia (AU), and Canada (CA) tax rules.
- **HEX / RGB / HSL Converter**: Synced converter tool for color space transformations (HEX, RGB, HSL) with zero-loop feedback.
- **ColorPicker**: Shared premium color-picking component with manual HEX override.
- **SEO Helper**: Standardized server-side metadata generator (`generateSeoMetadata`).
- **QA Verification**: Added `docs/QA_CHECKLIST.md` and verification package script `npm run qa`.

### Changed
- Refactored all new tools to clean CSR/SSR splits using next-generation Next.js App Router architectures.
- Enhanced global styling system with extended Tailwind CSS theme brand colors and spacing.
- Fixed glassmorphism media-query selectors in `src/app/globals.css`.
- Extended `useUsageLimit` hook to support metadata tracking payloads.
