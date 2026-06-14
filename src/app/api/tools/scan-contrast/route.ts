import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Relative luminance calculation
function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// Convert any color (hex, rgb, common names) to RGB object
function parseColorToRgb(
  colorStr: string,
): { r: number; g: number; b: number } | null {
  if (!colorStr) return null;
  const cleaned = colorStr.trim().toLowerCase();

  // Hex shorthand: #f00
  const hex3 = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(cleaned);
  if (hex3) {
    return {
      r: parseInt(hex3[1] + hex3[1], 16),
      g: parseInt(hex3[2] + hex3[2], 16),
      b: parseInt(hex3[3] + hex3[3], 16),
    };
  }

  // Hex full: #ff0000
  const hex6 = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleaned);
  if (hex6) {
    return {
      r: parseInt(hex6[1], 16),
      g: parseInt(hex6[2], 16),
      b: parseInt(hex6[3], 16),
    };
  }

  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgb =
    /^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+)?\)$/i.exec(cleaned);
  if (rgb) {
    return {
      r: Math.min(255, parseInt(rgb[1], 10)),
      g: Math.min(255, parseInt(rgb[2], 10)),
      b: Math.min(255, parseInt(rgb[3], 10)),
    };
  }

  // Standard CSS basic names mapping
  const nameMap: Record<string, { r: number; g: number; b: number }> = {
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    yellow: { r: 255, g: 255, b: 0 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
    silver: { r: 192, g: 192, b: 192 },
    darkgray: { r: 169, g: 169, b: 169 },
    lightgray: { r: 211, g: 211, b: 211 },
    orange: { r: 255, g: 165, b: 0 },
    purple: { r: 128, g: 0, b: 128 },
    transparent: { r: 255, g: 255, b: 255 }, // fallback transparency to white
  };

  if (nameMap[cleaned]) {
    return nameMap[cleaned];
  }

  return null;
}

function calculateContrast(fg: string, bg: string): number {
  const rgbFg = parseColorToRgb(fg);
  const rgbBg = parseColorToRgb(bg);
  if (!rgbFg || !rgbBg) return 4.5; // safe fallback

  const lumFg = getLuminance(rgbFg.r, rgbFg.g, rgbFg.b);
  const lumBg = getLuminance(rgbBg.r, rgbBg.g, rgbBg.b);

  const brightest = Math.max(lumFg, lumBg);
  const darkest = Math.min(lumFg, lumBg);
  return (brightest + 0.05) / (darkest + 0.05);
}

// Standard Tailwind CSS color palette dictionary
const TAILWIND_PALETTE: Record<string, Record<string, string>> = {
  slate: {
    "50": "#f8fafc",
    "100": "#f1f5f9",
    "200": "#e2e8f0",
    "300": "#cbd5e1",
    "400": "#94a3b8",
    "500": "#64748b",
    "600": "#475569",
    "700": "#334155",
    "800": "#1e293b",
    "900": "#0f172a",
    "950": "#020617",
  },
  gray: {
    "50": "#f9fafb",
    "100": "#f3f4f6",
    "200": "#e5e7eb",
    "300": "#d1d5db",
    "400": "#9ca3af",
    "500": "#718096",
    "600": "#4a5568",
    "700": "#2d3748",
    "800": "#1a202c",
    "900": "#171717",
    "950": "#0a0a0a",
  },
  zinc: {
    "50": "#fafafa",
    "100": "#f4f4f5",
    "200": "#e4e4e7",
    "300": "#d4d4d8",
    "400": "#a1a1aa",
    "500": "#71717a",
    "600": "#52525b",
    "700": "#3f3f46",
    "800": "#27272a",
    "900": "#18181b",
    "950": "#09090b",
  },
  neutral: {
    "50": "#fafafa",
    "100": "#f5f5f5",
    "200": "#e5e5e5",
    "300": "#d4d4d4",
    "400": "#a3a3a3",
    "500": "#737373",
    "600": "#525252",
    "700": "#404040",
    "800": "#262626",
    "900": "#171717",
    "950": "#0a0a0a",
  },
  stone: {
    "50": "#fafaf9",
    "100": "#f5f5f4",
    "200": "#e7e5e4",
    "300": "#d6d3d1",
    "400": "#a8a29e",
    "500": "#78716c",
    "600": "#57534e",
    "700": "#44403c",
    "800": "#292524",
    "900": "#1c1917",
    "950": "#0c0a09",
  },
  red: {
    "50": "#fef2f2",
    "100": "#fee2e2",
    "200": "#fecaca",
    "300": "#fca5a5",
    "400": "#f87171",
    "500": "#ef4444",
    "600": "#dc2626",
    "700": "#b91c1c",
    "800": "#991b1b",
    "900": "#7f1d1d",
    "950": "#450a0a",
  },
  orange: {
    "50": "#fff7ed",
    "100": "#ffedd5",
    "200": "#fed7aa",
    "300": "#fdba74",
    "400": "#fb923c",
    "500": "#f97316",
    "600": "#ea580c",
    "700": "#c2410c",
    "800": "#9a3412",
    "900": "#7c2d12",
    "950": "#431407",
  },
  amber: {
    "50": "#fffbeb",
    "100": "#fef3c7",
    "200": "#fde68a",
    "300": "#fcd34d",
    "400": "#fbbf24",
    "500": "#f59e0b",
    "600": "#d97706",
    "700": "#b45309",
    "800": "#92400e",
    "900": "#78350f",
    "950": "#451a03",
  },
  yellow: {
    "50": "#fefce8",
    "100": "#fef9c3",
    "200": "#fef08a",
    "300": "#fde047",
    "400": "#facc15",
    "500": "#eab308",
    "600": "#ca8a04",
    "700": "#a16207",
    "800": "#854d0e",
    "900": "#713f12",
    "950": "#422006",
  },
  lime: {
    "50": "#f7fee7",
    "100": "#ecfccb",
    "200": "#d9f99d",
    "300": "#bef264",
    "400": "#a3e635",
    "500": "#84cc16",
    "600": "#65a30d",
    "700": "#4d7c0f",
    "800": "#3f6212",
    "900": "#365314",
    "950": "#1a2e05",
  },
  green: {
    "50": "#f0fdf4",
    "100": "#dcfce7",
    "200": "#bbf7d0",
    "300": "#86efac",
    "400": "#4ade80",
    "500": "#22c55e",
    "600": "#16a34a",
    "700": "#15803d",
    "800": "#166534",
    "900": "#14532d",
    "950": "#052e16",
  },
  emerald: {
    "50": "#ecfdf5",
    "100": "#d1fae5",
    "200": "#a7f3d0",
    "300": "#6ee7b7",
    "400": "#34d399",
    "500": "#10b981",
    "600": "#059669",
    "700": "#047857",
    "800": "#065f46",
    "900": "#064e3b",
    "950": "#022c22",
  },
  teal: {
    "50": "#f0fdfa",
    "100": "#ccfbf1",
    "200": "#99f6e4",
    "300": "#5eead4",
    "400": "#2dd4bf",
    "500": "#14b8a6",
    "600": "#0d9488",
    "700": "#0f766e",
    "800": "#115e59",
    "900": "#134e4a",
    "950": "#042f2e",
  },
  cyan: {
    "50": "#ecfeff",
    "100": "#cffafe",
    "200": "#a5f3fc",
    "300": "#67e8f9",
    "400": "#22d3ee",
    "500": "#06b6d4",
    "600": "#0891b2",
    "700": "#0e7490",
    "800": "#155e75",
    "900": "#164e63",
    "950": "#083344",
  },
  sky: {
    "50": "#f0f9ff",
    "100": "#e0f2fe",
    "200": "#bae6fd",
    "300": "#7dd3fc",
    "400": "#38bdf8",
    "500": "#0ea5e9",
    "600": "#0284c7",
    "700": "#0369a1",
    "800": "#075985",
    "900": "#0c4a6e",
    "950": "#082f49",
  },
  blue: {
    "50": "#eff6ff",
    "100": "#dbeafe",
    "200": "#bfdbfe",
    "300": "#93c5fd",
    "400": "#60a5fa",
    "500": "#3b82f6",
    "600": "#2563eb",
    "700": "#1d4ed8",
    "800": "#1e40af",
    "900": "#1e3a8a",
    "950": "#172554",
  },
  indigo: {
    "50": "#eef2ff",
    "100": "#e0e7ff",
    "200": "#c7d2fe",
    "300": "#a5b4fc",
    "400": "#818cf8",
    "500": "#6366f1",
    "600": "#4f46e5",
    "700": "#4338ca",
    "800": "#3730a3",
    "900": "#312e81",
    "950": "#1e1b4b",
  },
  violet: {
    "50": "#f5f3ff",
    "100": "#ede9fe",
    "200": "#ddd6fe",
    "300": "#c4b5fd",
    "400": "#a78bfa",
    "500": "#8b5cf6",
    "600": "#7c3aed",
    "700": "#6d28d9",
    "800": "#5b21b6",
    "900": "#4c1d95",
    "950": "#2e1065",
  },
  purple: {
    "50": "#faf5ff",
    "100": "#f3e8ff",
    "200": "#e9d5ff",
    "300": "#d8b4fe",
    "400": "#c084fc",
    "500": "#a855f7",
    "600": "#9333ea",
    "700": "#7e22ce",
    "800": "#6b21a8",
    "900": "#581c87",
    "950": "#3b0764",
  },
  fuchsia: {
    "50": "#fdf4ff",
    "100": "#fae8ff",
    "200": "#f5d0fe",
    "300": "#f0abfc",
    "400": "#e879f9",
    "500": "#d946ef",
    "600": "#c084fc",
    "700": "#a21caf",
    "800": "#86198f",
    "900": "#701a75",
    "950": "#4a044e",
  },
  pink: {
    "50": "#fdf2f8",
    "100": "#fce7f3",
    "200": "#fbcfe8",
    "300": "#f472b6",
    "400": "#f43f5e",
    "500": "#ec4899",
    "600": "#db2777",
    "700": "#be185d",
    "800": "#9d174d",
    "900": "#831843",
    "950": "#500724",
  },
  rose: {
    "50": "#fff1f2",
    "100": "#ffe4e6",
    "200": "#fecdd3",
    "300": "#fda4af",
    "400": "#fb7185",
    "500": "#f43f5e",
    "600": "#e11d48",
    "700": "#be123c",
    "800": "#9f1239",
    "900": "#881337",
    "950": "#4c0519",
  },
};

const BASE_COLORS: Record<string, string> = {
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
};

function resolveTailwindColor(
  className: string,
  prefix: "text" | "bg",
): string | null {
  const regex = new RegExp(`^${prefix}-([a-z]+)(?:-([0-9]+))?$`, "i");
  const match = regex.exec(className);
  if (!match) return null;

  const colorName = match[1].toLowerCase();
  const shade = match[2];

  if (BASE_COLORS[colorName]) {
    return BASE_COLORS[colorName];
  }

  if (TAILWIND_PALETTE[colorName]) {
    const shadeKey = shade || "500";
    return TAILWIND_PALETTE[colorName][shadeKey] || null;
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let isPro = false;
    try {
      const session = await auth();
      if (session?.user?.id) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          include: { subscriptions: true },
        });
        isPro =
          user?.role === "PRO" ||
          user?.role === "BUSINESS" ||
          user?.role === "ADMIN" ||
          user?.subscriptions?.[0]?.plan === "PREMIUM" ||
          user?.subscriptions?.[0]?.plan === "BUSINESS";
      }
    } catch {
      isPro = false;
    }

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
    let base: URL;
    try {
      base = new URL(formattedUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL structure provided." },
        { status: 400 },
      );
    }

    const response = await fetch(formattedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch webpage: ${response.statusText}` },
        { status: response.status },
      );
    }

    const html = await response.text();

    const variablesMap: Record<string, string> = {};

    function resolveCssValue(value: string, depth = 0): string {
      if (depth > 5) return value;
      if (!value) return value;
      const varRefMatch = /var\((--[^)]+)\)/i.exec(value);
      if (varRefMatch) {
        const varName = varRefMatch[1].trim();
        const resolved = variablesMap[varName];
        if (resolved) {
          return resolveCssValue(resolved, depth + 1);
        }
      }
      return value;
    }

    // 1. Parse simple style blocks to build a rule mapping selector -> declarations
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    const cssMap: Record<string, { color?: string; bg?: string }> = {};
    let styleMatch;
    while ((styleMatch = styleRegex.exec(html)) !== null) {
      const cssContent = styleMatch[1];

      // Extract custom properties (variables)
      const varRegex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;}\n]+)/g;
      let varMatch;
      while ((varMatch = varRegex.exec(cssContent)) !== null) {
        variablesMap[varMatch[1].trim()] = varMatch[2].trim();
      }
      const rulesRegex = /([^{}]+)\s*\{\s*([^}]+)\s*\}/g;
      let ruleMatch;
      while ((ruleMatch = rulesRegex.exec(cssContent)) !== null) {
        const selectors = ruleMatch[1].split(",");
        const declarations = ruleMatch[2];

        let colorVal: string | undefined;
        let bgVal: string | undefined;

        // Parse declarations for color/background properties
        const colorMatch = /color\s*:\s*([^;]+)/i.exec(declarations);
        if (colorMatch) colorVal = colorMatch[1].trim();

        const bgMatch = /background(?:-color)?\s*:\s*([^;]+)/i.exec(
          declarations,
        );
        if (bgMatch) bgVal = bgMatch[1].trim();

        if (colorVal || bgVal) {
          for (let sel of selectors) {
            sel = sel.trim().toLowerCase();
            if (sel) {
              cssMap[sel] = {
                ...cssMap[sel],
                ...(colorVal && { color: colorVal }),
                ...(bgVal && { bg: bgVal }),
              };
            }
          }
        }
      }
    }

    // 2. Parse text-bearing elements
    const elementRegex =
      /<(h1|h2|h3|h4|h5|h6|p|a|button|span|div|li)\b([^>]*?)>([\s\S]*?)<\/\1>/gi;
    const failures: any[] = [];
    let totalScanned = 0;
    let match;

    while ((match = elementRegex.exec(html)) !== null) {
      const tag = match[1].toLowerCase();
      const attrs = match[2];
      const content = match[3]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();

      // Skip elements without substantial text
      if (!content || content.length < 2) continue;
      totalScanned++;

      // Parse ID, Classes, and Inline Style attributes
      const idMatch = /id=["']([^"']*)["']/i.exec(attrs);
      const id = idMatch ? idMatch[1].trim() : "";

      const classMatch = /class(?:Name)?=["']([^"']*)["']/i.exec(attrs);
      const classesStr = classMatch ? classMatch[1].trim() : "";
      const classes = classesStr.split(/\s+/).filter(Boolean);

      const styleAttrMatch = /style=["']([^"']*)["']/i.exec(attrs);
      const styleAttr = styleAttrMatch ? styleAttrMatch[1].trim() : "";

      // Resolve FG / BG colors
      let fgColor: string | undefined;
      let bgColor: string | undefined;

      // 1. Look in inline styles first
      const inlineColor = /color\s*:\s*([^;]+)/i.exec(styleAttr);
      const inlineBg = /background(?:-color)?\s*:\s*([^;]+)/i.exec(styleAttr);

      if (inlineColor) fgColor = resolveCssValue(inlineColor[1].trim());
      if (inlineBg) bgColor = resolveCssValue(inlineBg[1].trim());

      // 2. Look at Tailwind Utility classes if not resolved
      if (!fgColor || !bgColor) {
        for (const cls of classes) {
          if (!fgColor) {
            const resolvedText = resolveTailwindColor(cls, "text");
            if (resolvedText) fgColor = resolvedText;
          }
          if (!bgColor) {
            const resolvedBg = resolveTailwindColor(cls, "bg");
            if (resolvedBg) bgColor = resolvedBg;
          }
        }
      }

      // 3. Look in CSS selectors map if not resolved
      if (!fgColor || !bgColor) {
        const checkSelectors = [
          ...(id ? [`#${id.toLowerCase()}`] : []),
          ...classes.map((c) => `.${c.toLowerCase()}`),
          tag,
        ];

        for (const sel of checkSelectors) {
          if (cssMap[sel]) {
            if (!fgColor && cssMap[sel].color) {
              fgColor = resolveCssValue(cssMap[sel].color!);
            }
            if (!bgColor && cssMap[sel].bg) {
              bgColor = resolveCssValue(cssMap[sel].bg!);
            }
          }
        }
      }

      // Fallbacks
      fgColor = fgColor || "#0f172a";
      bgColor = bgColor || "#ffffff";

      // Extract font size and weight from inline style or tags
      let fontSizePx = 16; // default standard body font size
      let isBold = tag === "strong" || tag === "b";

      const inlineSizeMatch = /font-size\s*:\s*([\d.]+)(px|pt|rem|em)/i.exec(
        styleAttr,
      );
      const inlineWeightMatch = /font-weight\s*:\s*(bold|[789]00)/i.test(
        styleAttr,
      );

      if (inlineSizeMatch) {
        const val = parseFloat(inlineSizeMatch[1]);
        const unit = inlineSizeMatch[2].toLowerCase();
        if (unit === "px") fontSizePx = val;
        else if (unit === "pt") fontSizePx = val * 1.333;
        else if (unit === "rem" || unit === "em") fontSizePx = val * 16;
      }
      if (inlineWeightMatch) isBold = true;

      // WCAG large text standard: >= 18pt (24px) or >= 14pt (18.6px) + bold
      const isLargeText =
        tag === "h1" ||
        tag === "h2" ||
        tag === "h3" ||
        fontSizePx >= 24 ||
        (fontSizePx >= 18.6 && isBold);

      const ratio = calculateContrast(fgColor, bgColor);
      const aaPass = isLargeText ? ratio >= 3.0 : ratio >= 4.5;
      const aaaPass = isLargeText ? ratio >= 4.5 : ratio >= 7.0;

      if (!aaPass || !aaaPass) {
        // Build CSS Selector representation
        let selector = tag;
        if (id) selector += `#${id}`;
        if (classesStr) selector += `.${classes.join(".")}`;

        failures.push({
          tag,
          selector,
          text: content.substring(0, 80) + (content.length > 80 ? "..." : ""),
          fgColor,
          bgColor,
          ratio: Number(ratio.toFixed(2)),
          requiredRatio: isLargeText ? 3.0 : 4.5,
          isLargeText,
          aaFailed: !aaPass,
          aaaFailed: !aaaPass,
        });
      }
    }

    // Limit scanned items for free tier to prevent payload bloating
    const scanLimit = isPro ? failures.length : Math.min(failures.length, 30);
    const filteredFailures = failures.slice(0, scanLimit);

    return NextResponse.json({
      totalScanned,
      failuresCount: failures.length,
      failures: filteredFailures,
      isPro,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to audit page contrast ratios" },
      { status: 500 },
    );
  }
}
