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
