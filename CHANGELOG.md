# Changelog

All notable changes to this project will be documented in this file.

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
