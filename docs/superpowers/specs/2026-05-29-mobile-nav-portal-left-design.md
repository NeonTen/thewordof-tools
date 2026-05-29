# Spec: Left-Sliding Portalized Mobile Navigation Drawer

We are refactoring the mobile navigation menu to render as a left-sliding full-height drawer using React Portals.

## Goal
Fix transparency bleed issues caused by parent stacking contexts and filters, and change the drawer slide-in behavior to come from the left side of the viewport.

## Proposed Changes

### 1. Mobile Navigation Component (`src/components/layout/mobile-nav.tsx`)
- Import `createPortal` from `"react-dom"`.
- Implement `mounted` client-side hydration check state to safely render portal markup.
- Render the backdrop overlay and drawer container inside `document.body` via `createPortal`.
- Change position classes from `right-0 border-l` to `left-0 border-r`.
- Set backdrop z-index to `z-[100]` and drawer z-index to `z-[110]`.

## Verification
- Run typescript compilation checks (`npx tsc --noEmit`).
- Run production build checks (`npm run build`).
