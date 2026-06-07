# Footer and Policy Pages Update

Add a new Refund Policy page and update the Footer to include standard terms, privacy, and refund policy links.

## User Review Required

> [!NOTE]
> The Refund Policy details a 7-day money-back guarantee matching the current site FAQ.

## Open Questions

None. The user has approved the copy and footer layout.

## Proposed Changes

---

### Navigation & Layout

#### [MODIFY] [footer.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/layout/footer.tsx)
- Update links list to:
  - "Terms & Conditions" linking to `/terms`
  - "Privacy Policy" linking to `/privacy`
  - "Refund Policy" linking to `/refund`

### Static Content Pages

#### [NEW] [page.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/refund/page.tsx)
- Create a new `/refund` route displaying the approved Refund Policy text inside the standard page layout (with `Header` and `Footer`).

#### [MODIFY] [sitemap.ts](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/sitemap.ts)
- Add `/refund` to the sitemap file.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify there are no compilation/rendering errors.

### Manual Verification
- Access `/refund` directly and verify page layout and content.
- Inspect footer links to make sure they point to `/terms`, `/privacy`, and `/refund`.
