/**
 * Pure client-side SVG optimizer — no Node.js dependencies (no fs, os, path).
 * Works fully in the browser.
 */

export interface SVGOptions {
  minify: boolean;
  removeMetadata: boolean;
  removeComments: boolean;
  currentColor: boolean;
  pretty: boolean;
}

/**
 * Optimizes an SVG string using regex-based transformations.
 * Lightweight browser-safe alternative to svgo.
 */
export function optimizeSVG(code: string, options: SVGOptions): string {
  let result = code;

  // 1. Remove XML declaration
  if (options.removeMetadata) {
    result = result.replace(/<\?xml[^?]*\?>\s*/gi, '');
  }

  // 2. Remove HTML/XML comments
  if (options.removeComments) {
    result = result.replace(/<!--[\s\S]*?-->/g, '');
  }

  // 3. Remove metadata elements
  if (options.removeMetadata) {
    result = result.replace(/<metadata[\s\S]*?<\/metadata>/gi, '');
    result = result.replace(/<title[\s\S]*?<\/title>/gi, '');
    result = result.replace(/<desc[\s\S]*?<\/desc>/gi, '');
    // Remove editor-specific namespaces from <svg> tag
    result = result.replace(/\s+xmlns:(inkscape|sodipodi|dc|cc|rdf|sketch|xlink)[^"]*"[^"]*"/g, '');
    result = result.replace(/\s+(inkscape|sodipodi):[a-z-]+="[^"]*"/g, '');
  }

  // 4. Convert explicit colors to currentColor
  if (options.currentColor) {
    result = result.replace(/\b(fill|stroke)="(?!none|transparent|url)[^"]+"/g, '$1="currentColor"');
  }

  // 5. Remove empty attributes
  result = result.replace(/\s+[a-z-]+="\s*"/gi, '');

  // 6. Remove useless empty <g> groups
  result = result.replace(/<g>\s*([\s\S]*?)\s*<\/g>/g, '$1');

  // 7. Minify
  if (options.minify && !options.pretty) {
    result = result.replace(/>\s+</g, '><');
    result = result.trim();
    result = result.replace(/\s{2,}/g, ' ');
    result = result.replace(/\n\s*/g, ' ');
  }

  // 8. Pretty print
  if (options.pretty) {
    result = prettyPrintSVG(result);
  }

  return result;
}

function prettyPrintSVG(svg: string): string {
  let indent = 0;
  const lines: string[] = [];
  const flat = svg.replace(/>\s+</g, '><').trim();
  const tokens = flat.split(/(<[^>]+>)/);

  for (const token of tokens) {
    if (!token.trim()) continue;
    if (token.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      lines.push('  '.repeat(indent) + token.trim());
    } else if (token.startsWith('<') && !token.endsWith('/>') && !token.startsWith('<?')) {
      lines.push('  '.repeat(indent) + token.trim());
      indent++;
    } else {
      lines.push('  '.repeat(indent) + token.trim());
    }
  }

  return lines.filter(l => l.trim()).join('\n');
}

export function toPascalCase(str: string): string {
  const clean = str.replace(/\.svg$/i, '').replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export function convertSvgToReact(svgCode: string, isTsx: boolean = false, componentName: string = "Icon"): string {
  let jsx = svgCode;
  const attributeReplacements: Record<string, string> = {
    "class": "className",
    "stroke-width": "strokeWidth",
    "stroke-linecap": "strokeLinecap",
    "stroke-linejoin": "strokeLinejoin",
    "stroke-miterlimit": "strokeMiterlimit",
    "stroke-dasharray": "strokeDasharray",
    "stroke-dashoffset": "strokeDashoffset",
    "fill-rule": "fillRule",
    "clip-rule": "clipRule",
    "stop-color": "stopColor",
    "stop-opacity": "stopOpacity",
    "flood-color": "floodColor",
    "flood-opacity": "floodOpacity",
    "font-family": "fontFamily",
    "font-size": "fontSize",
    "xml:space": "xmlSpace",
    "fill-opacity": "fillOpacity",
    "stroke-opacity": "strokeOpacity",
  };

  for (const [key, value] of Object.entries(attributeReplacements)) {
    const regex = new RegExp(`\\b${key}=`, 'g');
    jsx = jsx.replace(regex, `${value}=`);
  }

  jsx = jsx.replace(/\bstyle="([^"]*)"/g, (match, styleStr) => {
    const rules = styleStr.split(';').filter((r: string) => r.trim());
    const reactStyle = rules.map((r: string) => {
      const parts = r.split(':');
      if (parts.length < 2) return '';
      const name = parts[0].trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      const val = parts.slice(1).join(':').trim().replace(/'/g, "\\'");
      return `"${name}": "${val}"`;
    }).filter(Boolean).join(', ');
    return `style={{${reactStyle}}}`;
  });

  jsx = jsx.replace(/(<svg\b[^>]*)(>)/i, '$1 {...props}$2');

  if (isTsx) {
    return `import React, { SVGProps } from "react";

export function ${componentName}(props: SVGProps<SVGSVGElement>) {
  return (
    ${jsx.split('\n').map(line => '    ' + line).join('\n').trim()}
  );
}
`;
  }

  return `import React from "react";

export function ${componentName}(props) {
  return (
    ${jsx.split('\n').map(line => '    ' + line).join('\n').trim()}
  );
}
`;
}

export function convertSvgToVue(svgCode: string): string {
  return `<template>
  ${svgCode.split('\n').map(line => '  ' + line).join('\n').trim()}
</template>

<script>
export default {
  name: 'SvgIcon'
}
</script>
`;
}

export function convertSvgToSvelte(svgCode: string): string {
  let svelte = svgCode.replace(/(<svg\b[^>]*)(>)/i, '$1 {...$$$props}$2');
  return `${svelte}`;
}
