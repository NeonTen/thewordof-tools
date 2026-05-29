# Display Individual Calculators on Dashboard Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single "Calculators Suite" card in the Calculators section of `/tools` with 11 individual card links for every specific calculator.

**Architecture:** Update `/tools/page.tsx` categories list with imported icons and specific tool descriptions.

**Tech Stack:** React, Next.js, Lucide Icons.

---

### Task 1: Update Icons and Categories List

**Files:**
- Modify: `src/app/tools/page.tsx`

- [ ] **Step 1: Expand imports and add calculators**
  Import Lucide icons and update the `Calculators` section in `categories` array.
  ```tsx
  import {
    Image as ImageIcon,
    Zap,
    FileCode,
    Split,
    Calculator,
    Code,
    Cpu,
    FileText,
    Sparkles,
    PenLine,
    Search,
    Brain,
    Percent,
    Coins,
    Scale,
    Monitor,
    Type,
    TrendingUp,
    Briefcase,
    Palette
  } from "lucide-react"
  ```
  ```tsx
    {
      title: "Calculators",
      tools: [
        { title: "EMI Calculator",            desc: "Calculate your monthly EMI payments for home, car, or personal loans.",            icon: Percent,        href: "/tools/calculators/emi",             pro: false },
        { title: "SIP / Mutual Fund",         desc: "Project future returns of your Systematic Investment Plan (SIP) investments.",       icon: Coins,          href: "/tools/calculators/sip",             pro: false },
        { title: "Compound Interest",         desc: "Calculate compound interest returns with annual inflation adjustments.",            icon: TrendingUp,     href: "/tools/calculators/compound-interest", pro: false },
        { title: "Salary to Hourly Converter",desc: "Convert annual/monthly salary to hourly rates, daily rates, and vice-versa.",       icon: Briefcase,      href: "/tools/calculators/salary-to-hourly",  pro: false },
        { title: "GST Calculator",            desc: "Calculate Goods and Services Tax (GST) for baseline or gross sums.",                icon: Percent,        href: "/tools/gst-calculator",              pro: false },
        { title: "BMI Calculator",            desc: "Calculate your Body Mass Index (BMI) using metric or imperial units.",               icon: Scale,          href: "/tools/calculators/bmi",             pro: false },
        { title: "Aspect Ratio Calculator",   desc: "Compute dimension resizes and aspect ratios for layouts and images.",                icon: Monitor,        href: "/tools/calculators/aspect-ratio",    pro: false },
        { title: "Line-height Converter",     desc: "Convert line-height pixels, rems, or percentages into relative CSS values.",        icon: Type,           href: "/tools/calculators/line-height",       pro: false },
        { title: "PX to REM Converter",       desc: "Convert pixels to REM units bidirectionally with lookup sheets.",                    icon: FileCode,       href: "/tools/calculators/px-to-rem",       pro: false },
        { title: "Word Counter",              desc: "Get real-time statistics including word, character, and line counts.",               icon: Type,           href: "/tools/word-counter",                pro: false },
        { title: "HEX/RGB/HSL Converter",     desc: "Convert colors between spaces with sliders and a visual picker.",                    icon: Palette,        href: "/tools/color-converter",             pro: false }
      ]
    }
  ```
- [ ] **Step 2: Commit**
  ```bash
  git add src/app/tools/page.tsx
  git commit -m "feat: show individual calculators on dashboard page"
  ```

---

### Task 2: Verification

- [ ] **Step 1: Check Typescript compilation**
  Run: `npx tsc --noEmit`
- [ ] **Step 2: Check production Next.js build**
  Run: `npm run build`
