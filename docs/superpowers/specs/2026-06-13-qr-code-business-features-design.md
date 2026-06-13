# Design Specification: QR Code Generator Business Features

This document specifies the implementation of advanced marketing options (UTM campaign tagging) and analytical capabilities (CSV/PDF reporting) inside the dynamic QR Code utility, specifically reserved for the Business Tier.

## Proposed Changes

### 1. UTM Tracking Builder in QR Generator
* **File**: `src/components/tools/qr-code.tsx`
* **Behavior**:
  * An expandable section titled "UTM Tracking Parameters" is shown in the left card under the main redirect URL input.
  * Inputs:
    * `utm_source` (default empty, e.g., `qr`)
    * `utm_medium` (default empty, e.g., `print`)
    * `utm_campaign` (default empty, e.g., `spring_promo`)
    * `utm_term` (default empty)
    * `utm_content` (default empty)
  * As the user types, the target redirect URL dynamically appends these parameters.
  * When clicked, if `isBusiness` is false, it triggers the `ProGate` prompt (locked to `business` tier).

### 2. Export Scan Analytics (CSV / PDF)
* **File**: `src/components/tools/qr-code.tsx`
* **Behavior**:
  * Adds an "Export Report" button inside the dynamic QR scan insights dashboard.
  * The button supports two options:
    * **CSV Export**: Compiles the selected QR scan logs into a string format and downloads a local file (e.g., `qr-scans-id.csv`).
    * **Print/PDF Export**: Triggers standard window printing configured with print-optimized CSS that hides site navigation headers/footers and renders only the charts and statistics blocks.
  * Wrapped in `ProGate` with `tier="business"` to restrict usage to Business plan subscribers.

### 3. Pricing Matrix Sync
* **File**: `src/components/pricing/pricing-cards.tsx`
* **Behavior**:
  * Free plan list:
    * `{ label: "UTM campaign builder for QR codes", included: false }`
    * `{ label: "Export QR analytics as CSV/PDF", included: false }`
  * Pro plan list:
    * `{ label: "UTM campaign builder for QR codes", included: false }`
    * `{ label: "Export QR analytics as CSV/PDF", included: false }`
  * Business plan list:
    * `{ label: "UTM campaign builder for QR codes", included: true }`
    * `{ label: "Export QR analytics as CSV/PDF", included: true }`

## Verification Plan

### Manual Verification
1. Access the QR Code Generator and check the new UTM builder section.
2. Toggle role to Pro and Business and verify that ProGate overlays lock/unlock correctly for both features (UTM builder & CSV/PDF exports).
3. Generate a dynamic QR code with UTM parameters and verify the redirect URL correctly appends tags.
4. Perform mock scans and verify the CSV export generates clean tabular datasets.
