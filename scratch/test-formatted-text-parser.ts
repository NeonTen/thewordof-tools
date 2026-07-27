import assert from "assert";

type ParsedContent = 
  | { type: "bullets"; items: string[] }
  | { type: "paragraphs"; items: string[] }
  | { type: "plain"; text: string };

function parseTextStructure(text: string): ParsedContent {
  if (!text || !text.trim()) return { type: "plain", text: "" };
  
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const bulletRegex = /^([-*•]|\d+[.)])\s+/;
  
  const hasBullets = lines.some(l => bulletRegex.test(l));
  
  if (hasBullets) {
    const items = lines.map(l => l.replace(bulletRegex, "").trim()).filter(Boolean);
    return { type: "bullets", items };
  }
  
  if (lines.length > 1) {
    return { type: "paragraphs", items: lines };
  }
  
  return { type: "plain", text: text.trim() };
}

// Test cases
assert.deepStrictEqual(
  parseTextStructure("- Developed React app\n- Scaled DB by 50%"),
  { type: "bullets", items: ["Developed React app", "Scaled DB by 50%"] }
);

assert.deepStrictEqual(
  parseTextStructure("First paragraph\nSecond paragraph"),
  { type: "paragraphs", items: ["First paragraph", "Second paragraph"] }
);

assert.deepStrictEqual(
  parseTextStructure("Single line text"),
  { type: "plain", text: "Single line text" }
);

console.log("✅ parseTextStructure verified!");
