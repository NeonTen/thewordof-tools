# Spec: Individual Calculators on Dashboard Page

We are updating the main tools dashboard directory page to list every individual calculator utility directly under the "Calculators" section.

## Goal
Improve usability and direct click-through rates by expanding the single generic "Calculators Suite" card on `/tools` into 11 separate cards for each specific finance, design, utility, and health calculator.

## Proposed Changes

### 1. Main Tools Directory (`src/app/tools/page.tsx`)
- Import additional Lucide icons: `Percent`, `Coins`, `Scale`, `Monitor`, `Type`, `TrendingUp`, `Briefcase`, `Palette`.
- Replace the single tool item in the "Calculators" category list with 11 distinct items for each of the available calculators.
- Set `pro: false` for all these calculator items since they are fully free tools.

## Verification
- Compile type checks (`npx tsc --noEmit`).
- Verify production Next.js build success.
