# QA Checklist - Full Tool Suite Release (v0.2.0)

This checklist verifies the functionality, design, SEO, and tracking for the five new tools: Product Description Generator, QR Code Generator, Word/Letter Counter, GST Calculator, and HEX/RGB/HSL Converter.

## 1. General & UI Verification

- [ ] **Responsive Design**: Load the `/tools` index and each tool page on mobile, tablet, and desktop viewports. Ensure layouts scale gracefully without overflow.
- [ ] **Glassmorphism Theme**: Cards should have the correct semi-transparent backdrop blur, light/dark responsive borders, and smooth hover state transitions.
- [ ] **Shared Layout**: Confirm that the tools index, side navigation, header, and active page transition are consistent across all tools.
- [ ] **Error Handling**: Verify that failed API calls (e.g., generating QR with offline network) display descriptive inline alerts rather than crashing.

---

## 2. Tool-Specific Verification

### Product Description Generator (`/tools/product-description`)
- [ ] **Action**: Enter a title, add 2 key features, upload an image, and click "Generate Description".
- [ ] **Verification**: Confirm description is generated and displayed, copy button functions, and usage counter increments by 1.
- [ ] **Limit Check**: Verify that a non-PRO user is blocked after 3 generations and sees the upgrade CTA.

### QR Code Generator (`/tools/qr-code`)
- [ ] **Action**: Input a URL, change size to `320px`, change foreground color, and click "Generate QR Code".
- [ ] **Verification**: Live preview updates with custom colors and size, download button downloads the custom QR PNG, and usage limit increments.
- [ ] **Limit Check**: Verify that a non-PRO user is blocked after 5 generations and sees the upgrade CTA.

### Word/Letter Counter (`/tools/word-counter`)
- [ ] **Action**: Paste paragraph of text. Toggle "Include spaces in character count" on and off.
- [ ] **Verification**: Word, character, and line counters update instantly. Analytics payload is debounced and emitted.

### GST Calculator (`/tools/gst-calculator`)
- [ ] **Action**: Select "India (18% GST)", input amount `1000`, and toggle "inclusive" on and off.
- [ ] **Verification**: GST amount shows `$152.54` (inclusive) vs `$180.00` (exclusive) with total price correctly updated. Debounced analytics payload is emitted.

### HEX / RGB / HSL Converter (`/tools/color-converter`)
- [ ] **Action**: Change color via ColorPicker, HEX input, RGB sliders, and HSL sliders.
- [ ] **Verification**: All other formats sync instantly without causing infinite re-render loops. Color preview box updates dynamically.

---

## 3. SEO & Analytics Verification

- [ ] **HTML Title Tag**: Check that page titles show `<title>Tool Name | TheWordOf Tools</title>` in the browser.
- [ ] **Meta Description**: Check that meta descriptions are present and descriptive.
- [ ] **Analytics Payload**: Open Network tab, filter by `/api/usage`, trigger a generation, and verify the POST request payload contains the tracking metadata (size, region, colors, length).
