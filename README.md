# TheWordOf Tools Suite (v0.2.0)

A highly optimized, premium utility and generator suite built using Next.js 16 (App Router), React 19, Tailwind CSS v4, and Prisma. The suite provides custom developer and productivity tools utilizing a glassmorphism design system.

![Tools Suite Dashboard Mockup](docs/screenshots/tools_suite_dashboard.png)

## Features & Included Tools

Our suite includes a collection of tools organized under cohesive layouts, utilizing debounced client-side usage limits and SEO tracking:

| Tool | Path | Description | Pricing tier | Key Features |
|------|------|-------------|--------------|--------------|
| **Product Description** | `/tools/product-description` | AI‑generated e‑commerce copy | Free (3/day) | Multi-feature inputs, file upload, copy output |
| **QR Code Generator** | `/tools/qr-code` | Custom QR codes with style sync | Free (5/day) | Custom HSL colors, live scale sizing, PNG download |
| **Word/Letter Counter** | `/tools/word-counter` | Real‑time text statistics | Free | Words, characters, line counting; spaces filter |
| **GST Calculator** | `/tools/gst-calculator` | Tax calculations for global regions | Free | Multi-region support (IN, AU, CA), Inclusive/Exclusive options |
| **HEX/RGB/HSL Converter** | `/tools/color-converter` | Real‑time color format converter | Free | Synced sliders and input fields, live preview box |
| **AI SEO Generator** | `/tools/seo-generator` | SEO title/description generator | Free (3/day) | Optimized character limits count, tone selection |

---

## Tech Stack & Architecture

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, SSR/CSR boundary split)
- **Runtime & Language**: Node.js, React 19, TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla CSS variables, premium glassmorphism classes (`.glassmorphism`)
- **Database & ORM**: PostgreSQL, Prisma (for usage logging & account persistence)
- **Analytics & Usage Tracking**: Debounced local storage fallback & Server API (`/api/usage`) with metadata payloads

---

## Development & Operations

### Getting Started

1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with `DATABASE_URL` and Auth details.
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) to view the application.

### Quality Assurance & Building

To verify code health, linting, and compile successfully, run the automated verification script:
```bash
npm run qa
```

To build for production:
```bash
npm run build
```
