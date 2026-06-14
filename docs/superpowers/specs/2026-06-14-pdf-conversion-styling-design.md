# PDF Conversion Styling Fix

## Problem

TXT → PDF conversion produces poor output: oversized text, monospace-looking font, clipped lines. Root cause: `html2canvas` rasterizes HTML into a bitmap at `scale: 2`, causing a dimension mismatch with jsPDF's width calculation.

## Changes

### 1. New `downloadPdfFromText()` — TXT → PDF

Bypasses html2canvas entirely. Uses jsPDF native text API:

- **Font**: Helvetica 12pt (proportional, clean)
- **Margins**: 72pt (1 inch) all sides
- **Line spacing**: 18pt between baselines (1.5×)
- **Wrapping**: `doc.splitTextToSize()` for word-wrap
- **Pagination**: Auto page breaks, Y resets per page

Called from `handleConvert` when `file.type === "txt"` and `target === "pdf"`.

### 2. Fix `downloadPdf()` — DOCX/MD → PDF

Change `html2canvas.scale` from `2` to `1`. The scale=2 was intended for sharpness but causes oversized rendering and clipping because jsPDF's `width` parameter doesn't compensate for the doubled canvas dimensions.

DOCX/MD rich HTML formatting (headings, bold, lists, tables from mammoth/marked) preserved via existing container CSS.

### 3. Unchanged

- DOCX → PDF: mammoth → HTML → `downloadPdf()`
- MD → PDF: marked → HTML → `downloadPdf()`
- Container CSS styling for rich documents
- Fallback text-mode catch block

## Files Modified

- `src/components/tools/doc-converter.tsx` — add `downloadPdfFromText()`, update `handleConvert` TXT branch, fix html2canvas scale in `downloadPdf()`
