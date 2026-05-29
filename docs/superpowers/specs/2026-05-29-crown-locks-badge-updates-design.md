# Spec: Crown Icon, Premium Locks, and Sidebar Badge Updates

We are updating the visual cues for premium locks, feature gates, and subscription badges across all tools in the workspace.

## Goal
Make the premium subscription tier status indicators more appealing, clean, and consistent by replacing generic lock and sparkle icons with a premium `Crown` icon and colors, removing badges from the persistent sidebar, and adding them on the main dashboard cards where relevant.

## Proposed Changes

### 1. Sidebar Navigation (`src/components/layout/tools-nav.tsx`)
- Remove the inline `ProBadge` rendering from the persistent sidebar items to declutter the menu.
- Keep the main "Upgrade to Pro" banner CTA at the bottom of the sidebar to convert free users.

### 2. All Tools Dashboard (`src/app/tools/page.tsx`)
- Keep Pro badges on the dashboard cards so users scanning the catalog see which utilities have premium options/limits.
- Add the `pro: true` flag to the following tools:
  - **QR Code Generator** (dynamic link limits / 15-day expiration).
  - **Invoice Generator** (monthly invoice limits).
  - **SVG Compressor** (framework component exports and bulk limits).

### 3. Unified Locks & Badges (`src/components/ui/pro-gate.tsx`)
- **ProBadge**: Replace the `<Sparkles>` icon with `<Crown>`.
- **ProGate Overlay Locking**: Replace `<Lock>` with `<Crown className="text-amber-500 fill-amber-500" />` inside the absolute indicator.
- **Role/Tier Styling**:
  - **Pro Tier**: Amber/Gold scheme (`bg-amber-500/10 border-amber-500/20 text-amber-500 fill-amber-500`).
  - **Business Tier**: Purple/Indigo scheme (`bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400 fill-purple-600 dark:fill-purple-400`).
- **Modal Dialog Prompt**: Restyle the icon container and standard icons to display an animated `Crown` utilizing the appropriate color scheme.

### 4. QR Code Lock Screen Overlay (`src/components/tools/qr-code.tsx`)
- Replace the `<Layers>` icon with the large `<Crown>` icon inside the locked analytics overlay.
- Style the icon container and overlay with premium purple/indigo Business colors and change the CTA button to a purple gradient.

## Verification
- Compile and build checks (`npx tsc --noEmit` and `npm run build`).
- Verify visual styling transitions.
