# Replace User Name with Generic Placeholder

We will replace the occurrences of "Sajid Khan" with "John Doe" across the public page testimonials and input/textarea placeholders in the tool views to ensure privacy and use a generic default.

## Proposed Changes

### Web Application

#### [MODIFY] [page.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/page.tsx)
- Change testimonial name from "Sajid Khan" to "John Doe".

#### [MODIFY] [work-report.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/work-report.tsx)
- Change report name input placeholder from "e.g. Sajid Khan" to "e.g. John Doe".

#### [MODIFY] [ai-parser-modal.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/ai-parser-modal.tsx)
- Change CV text input placeholder example name from "Sajid Khan" to "John Doe".

## Verification Plan

### Manual Verification
- Check the Landing Page testimonials section to verify the name is "John Doe".
- Check the Work Report Generator page to verify the name input has placeholder "e.g. John Doe".
- Check the AI Resume Parser modal to verify the textarea placeholder example shows "John Doe".
