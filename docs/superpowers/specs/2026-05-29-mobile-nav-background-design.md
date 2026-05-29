# Spec: Mobile Navigation Drawer Backdrop Fix

We are refactoring the mobile navigation drawer markup to prevent page background elements from bleeding through.

## Goal
Ensure the sliding mobile navigation menu drawer has a solid, completely opaque background and is not affected by parent opacity filters.

## Proposed Changes

### 1. Mobile Navigation Drawer Component (`src/components/layout/mobile-nav.tsx`)
- Un-nest the drawer container `div` from the overlay backdrop container `div`.
- Place both elements as sibling nodes inside a React Fragment (`<> ... </>`).
- Assign `z-40` to the overlay backdrop and `z-50` to the drawer container to ensure correct stacking order.
- Attach an `onClick` click-to-close handler to the backdrop overlay element.

## Verification
- Run typescript check: `npx tsc --noEmit`
- Run build check: `npm run build`
