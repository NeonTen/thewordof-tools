# QR Code Generator Analytics Improvements

Improve the QR Code Generator analytics dashboard by fixing the Y-axis decimal values on the Scan Timeline, adding the missing OS statistics under the "Browsers & OS" card using a tabbed toggle, and enhancing User-Agent parsing to log specific device types (iPhone, iPad, Android Phone/Tablet, Mac, Windows, Linux) rather than generic classifications.

## User Review Required

> [!NOTE]
> Device tracking changes will apply to all *new* scans. Existing scans in the database will still display under their original classifications ("Mobile", "Tablet", "Desktop") in the Device Usage chart.

## Open Questions

None. The user has approved the tabbed design and the granular device tracking.

## Proposed Changes

---

### Redirect Handler & Analytics Dashboard

#### [MODIFY] [route.ts](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/app/q/%5Bid%5D/route.ts)
Update User-Agent parsing logic to extract specific device names:
- Mobile: `iPhone`, `Android Phone`, or `Other Mobile`
- Tablet: `iPad`, `Android Tablet`, or `Other Tablet`
- Desktop: `Mac`, `Windows PC`, `Linux PC`, or `Other Desktop`

#### [MODIFY] [qr-code.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/qr-code.tsx)
- Add a tabs/toggle UI in the "Browsers & OS" card to switch between "Browsers" and "OS" views.
- Render either the browser bar chart or OS bar chart based on the selected tab state.
- Add `allowDecimals={false}` to the `<YAxis>` element inside the Scan Timeline `<AreaChart>` component.

## Verification Plan

### Automated Tests
- Run `npm run build` to verify there are no compilation or syntax errors.

### Manual Verification
- Generate a dynamic QR code, perform scans using mock User-Agents (e.g., matching iPhone, Mac, Windows, Android) and verify that the "Device Usage" chart displays the specific device models.
- Verify that the Y-axis of the Scan Timeline displays whole numbers (no `.5` ticks).
- Verify that toggling the tab inside the "Browsers & OS" card successfully switches between Browsers and Operating Systems charts.
