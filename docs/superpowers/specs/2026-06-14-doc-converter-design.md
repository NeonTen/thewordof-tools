# Design Spec - Client-Side Document Converter

## Goal
Implement a 100% client-side Document Converter tool that allows users to upload standard document formats (`.docx`, `.pdf`, `.txt`, `.md`) and convert them dynamically to other formats without uploading files to any external server.

## Features & Supported Conversions
1. **Word Document (`.docx`) Source**:
   * Convert to **PDF** (rendered dynamically via HTML preview).
   * Convert to **Markdown (`.md`)**.
   * Convert to **HTML** / **Plain Text (`.txt`)**.
2. **Text / Markdown (`.txt`, `.md`) Source**:
   * Convert to **PDF** (formatted layout).
   * Convert to **Word (`.docx`)** (flow layout).
3. **PDF Document (`.pdf`) Source (Pro-Only)**:
   * Convert to **Plain Text (`.txt`)** (extract characters page-by-page).
   * Convert to **Word (`.docx`)** (flowing extracted text).

## Limits & Subscription Tiers
* **File Size Limits**:
  * **Free Users**: Up to **2 MB** per file.
  * **Pro Users**: Up to **25 MB** per file.
* **Pro-Only Access**:
  * PDF file upload and parsing (PDF to Text / PDF to Word) is restricted to Pro users.
  * Free users see a standard premium gate (Pro Upgrade modal/badge) when trying to upload `.pdf` files.
* **Usage Credits**:
  * Each conversion consumes 1 usage credit for Free users.

## Technical Architecture & Client-Side Libraries
* **Mammoth.js (`mammoth`)**: Parses uploaded `.docx` array buffers and translates them into clean semantic HTML.
* **PDF.js (`pdfjs-dist`)**: Loaded dynamically in the browser to extract text content page-by-page from `.pdf` blobs.
* **jsPDF (`jspdf`) / html2pdf.js**: Generates formatted PDF documents directly from HTML strings.
* **marked**: Compiles markdown formatting into HTML previews.

## User Interface & Layout
* **Layout Style**: Mode-switching Upload & Convert UI (clean, high-aesthetics dropzone card).
* **Upload Card**: Drag-and-drop zone supporting `.docx`, `.pdf`, `.txt`, `.md`.
* **File Metadata Card**: Appears upon upload, showing filename, type, size, and page count estimate.
* **Options Actions**: Row of target conversion buttons (e.g. "Convert to PDF", "Convert to Word").
* **Pro Gate Badge**: Displayed next to PDF conversion options for Free users.
