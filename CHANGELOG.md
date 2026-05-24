# Changelog

All notable changes to this project will be documented in this file.

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
