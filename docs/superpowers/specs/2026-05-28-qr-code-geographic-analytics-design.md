# QR Code Geographic Analytics Design Spec

## Overview
This specification details the addition of **Geographic Analytics** (countries and cities tracking) to the Dynamic QR Code Generator. This feature is exclusive to the **Business** plan, offering users detailed insights into where their physical QR codes are being scanned.

## User Experience (UX)
1. **Business Plan Users**: Will see an interactive Geographic Analytics card on the QR Code stats dashboard displaying scan metrics aggregated by Country and City.
2. **Free / Pro Users**: Will see the card but it will be blurred with a locked overlay, featuring a lock icon and an "Upgrade to Business" button directing them to `/pricing`.

---

## Technical Architecture & Changes

### 1. Database Schema (`prisma/schema.prisma`)
Add two optional string fields to the `QrScan` model to save Country and City:
```prisma
model QrScan {
  id         String   @id @default(cuid())
  qrCodeId   String
  device     String   // "Mobile", "Tablet", "Desktop"
  os         String   // "iOS", "Android", "Windows", "macOS", "Linux", "Unknown"
  browser    String   // "Chrome", "Safari", "Firefox", "Edge", "Unknown"
  country    String?  // e.g., "US", "IN"
  city       String?  // e.g., "New York", "Mumbai"
  isUnique   Boolean  @default(true)
  createdAt  DateTime @default(now())

  qrCode     QrCode   @relation(fields: [qrCodeId], references: [id], onDelete: Cascade)
}
```

### 2. Geolocation Processing (`src/app/q/[id]/route.ts`)
We will use the offline database package `geoip-lite` to resolve the scanning client's IP to Country and City coordinates:
- Retrieve client IP via headers: `x-forwarded-for` (extracting first non-private IP), falling back to `x-real-ip` or standard connection socket IPs.
- During local development (IP resolves to `127.0.0.1` or `::1`), automatically mock lookups using a public IP (e.g., `8.8.8.8`) to verify location logging.
- Perform `geoip.lookup(ip)` and populate `country` and `city` fields during `prisma.qrScan.create` record creation.

### 3. API Statistics Aggregator (`src/app/api/tools/qr-code/stats/route.ts`)
- Group scans from `qrCode.scans` and return:
  - `countries`: `Record<string, number>`
  - `cities`: `Record<string, number>`

### 4. Client Component Gating (`src/components/tools/qr-code.tsx`)
- Introduce an `isBusiness` boolean prop.
- Render the new Geographic Analytics visual layout.
- If `isBusiness` is false, render the blurred lock overlay and redirect to `/pricing`.

---

## Verification Plan

### Automated Checks
- Run `npx prisma db push` to synchronize changes.
- Verify typescript compiles cleanly (`npx tsc --noEmit`).

### Manual Testing
1. Scan dynamic QR code locally and check Prisma records to verify `country` and `city` are saved properly.
2. Sign in with a Free/Pro user account, navigate to QR stats, and verify the locked/blurred Geographic Analytics overlay is displayed.
3. Sign in with a Business user account, navigate to QR stats, and verify the locations are rendered as charts.
