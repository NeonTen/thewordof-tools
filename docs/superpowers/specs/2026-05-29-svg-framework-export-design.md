# Design Specification: SVG Framework Component Export

## Goal
Provide a premium feature for Pro/Business users in the SVG Compressor tool to export and download optimized SVGs as framework components (React JSX, React TSX, Vue, Svelte), both individually and as a bulk batch ZIP.

## Proposed Changes

### SVG Utils
- In `src/lib/svg-utils.ts`, add:
  - `toPascalCase(str: string): string` to convert filenames to valid Component Names.
  - `convertSvgToReact(svgCode: string, isTsx: boolean, componentName: string): string`
  - `convertSvgToVue(svgCode: string): string`
  - `convertSvgToSvelte(svgCode: string): string`

### SVG Compressor Component
- In `src/components/tools/svg-compressor.tsx`:
  - Add single-item component export dialog modal triggered by an **"Export Component"** button. The modal will have tabs for React JSX, React TSX, Vue, and Svelte, displaying a preview and Copy action.
  - Add a **"Download All / Export Batch..."** option to the sidebar summary card that triggers a consolidated dialog modal with choices for Raw SVGs (ZIP), React JSX (ZIP), React TSX (ZIP), Vue (ZIP), and Svelte (ZIP).
  - Integrate Pro gates (`role` check) on all component export tabs and batch options. Show upgrade modal/prompt for free users.

---

## Verification Plan

### Automated Tests
- Run `npx tsc --noEmit` to verify type compilation.
- Run `npm run build` to verify the build output.

### Manual Verification
- Test that single-item export previews display correctly formatted React (JSX/TSX), Vue, and Svelte code.
- Test that batch ZIP exports package files into their corresponding extensions (.jsx, .tsx, .vue, .svelte) with correct PascalCase filenames.
- Verify Pro gates block free users and render upgrade paths.
