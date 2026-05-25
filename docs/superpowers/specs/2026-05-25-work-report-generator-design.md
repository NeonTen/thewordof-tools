# Work Report / Daily Task Tracker Design Spec

## Overview
Build a Daily Task Tracker & Work Report generator inside the existing tools suite project. It allows employees/freelancers to construct professional, print-ready daily reports of tasks completed, times, and completion estimates.

## File Structure & Routing
- **Server Page**: `src/app/tools/report/page.tsx`
  - Purpose: Serves SEO tags and houses page title, loading wrapper, and user authentication status checks.
- **Client Component**: `src/components/tools/work-report.tsx`
  - Purpose: Full layout rendering (Split-pane layout on desktop), local state management, native HTML5 drag-and-drop reordering, print formatting actions, and `localStorage` syncing.
- **Navigation Update**:
  - `src/components/layout/tools-nav.tsx`: Add "Work Report" under the **Finance & Dev** category group.
  - `src/app/tools/page.tsx`: Register "Daily Task Tracker" in the list of all tools cards.

## Data Persistence & State Schema
We will manage the workspace using a React state hooked to a sync utility:
```typescript
interface TaskRow {
  id: string
  taskName: string
  updateText: string
  projectedDate: string
  durationVal: string // e.g. "30 mins", "2 hours", "All Day"
}

interface WorkReportState {
  name: string
  date: string
  scheduledHours: string
  tasks: TaskRow[]
}
```

### Auto-Totaling Formula
Sum the duration column values:
- Parse `(\d+)\s*min` for minutes.
- Parse `(\d+)\s*hour` or `(\d+)\s*hr` for hours.
- Treat `All Day` as `8 hours`.
- Total time = Sum of hours + (Sum of minutes / 60). Remainder minutes are displayed alongside hours (e.g. `8 hours 45 minutes`).

## A4 Print Formatting (`@media print`)
When `window.print()` is executed:
- All screen layouts (sidebar, workspace headers, and the editor layout card) are hidden using `print:hidden`.
- The live preview layout container becomes a full-width flat page wrapper (`print:shadow-none print:border-none print:p-0`).
- Keeps table cells and text size legible using standard A4 sizing guidelines.
- Table rows use `break-inside: avoid` / `page-break-inside: avoid` to ensure tidy pagination.
- Includes a page footer matching: "Generated on YYYY-MM-DD HH:MM:SS".
