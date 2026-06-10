# Design Spec: Broken Links Auditor - Social Fallbacks and Scanning Notice

We will implement:
1. **Social Domain Fallback**: Prevent false positive broken statuses (400, 403, 503, 999) on major social media sites (Facebook, Instagram, LinkedIn, Twitter/X, YouTube) by mapping them to `200` success code.
2. **Scan Delay Alert**: Display a friendly status notice when a scan duration exceeds 8 seconds to improve user experience on large links audits.

## Proposed Changes

### Broken Links Auditor

#### [MODIFY] [route.ts](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/api/tools/scan-links/route.ts)
- Inside the scanned links parallel map function, test if hostname ends with `facebook.com`, `instagram.com`, `linkedin.com`, `twitter.com`, `x.com`, or `youtube.com`.
- If a match is found and status is `400`, `403`, `503`, or `999`, override the status to `200`.

#### [MODIFY] [broken-links.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/broken-links.tsx)
- Add state `showSlowScanNotice` (boolean).
- Initialize and clear a `setTimeout` timer in `handleScan` to toggle `showSlowScanNotice` after 8000ms.
- Render the info alert below the form in the UI.

## Verification Plan

### Automated Verification
- Run typescript compilation (`npx tsc --noEmit`) to verify type safety.
