# SEO Metadata Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Write and execute an automated script to migrate 50+ page/layout files to use the centralized `generateSeoMetadata` helper.

**Architecture:** We will create a temporary Node.js script in the `scratch/` directory. This script will recursively scan `src/app`, look for hardcoded `export const metadata = { title: "...", description: "..." }` blocks using regular expressions, and replace them with the helper syntax, along with injecting the proper import statement.

**Tech Stack:** Node.js (fs module), Regex.

---

### Task 1: Create the Transformation Script

**Files:**
- Create: `scratch/migrate-metadata.js`

- [ ] **Step 1: Write the transformation script**

```javascript
const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Matches basic static metadata object with title and description
const regex = /export\s+const\s+metadata(?:[\s:]*Metadata)?\s*=\s*\{[\s\S]*?title:\s*(["'])(.*?)\1,[\s\S]*?description:\s*(["'])(.*?)\3,?[^}]*?\};/g;

walkDir('src/app', function(filePath) {
  if (!filePath.endsWith('page.tsx') && !filePath.endsWith('layout.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if already using the helper
  if (content.includes('generateSeoMetadata')) return;
  
  // Check if it matches our basic static pattern
  if (regex.test(content)) {
    regex.lastIndex = 0; // reset
    
    let newContent = content.replace(regex, (match, q1, title, q2, desc) => {
      return `export const metadata = generateSeoMetadata({
  title: "${title}",
  description: "${desc}",
});`;
    });
    
    // Inject import at the top
    let finalContent = newContent;
    if (!finalContent.includes('import { generateSeoMetadata }')) {
      // Find the last import and insert after it, or just insert at the top
      finalContent = `import { generateSeoMetadata } from "@/app/lib/seo"\n` + finalContent;
    }
    
    fs.writeFileSync(filePath, finalContent);
    console.log(`Migrated: ${filePath}`);
  }
});
```

- [ ] **Step 2: Save the script**
Save the code above to `scratch/migrate-metadata.js`.

### Task 2: Execute Script and Verify Execution

**Files:**
- Modify: ~50 `page.tsx` and `layout.tsx` files across `src/app`

- [ ] **Step 1: Run the script**

Run: `node scratch/migrate-metadata.js`
Expected: A list of logged files that were migrated (e.g., `Migrated: src/app/tools/design/page.tsx`).

- [ ] **Step 2: Run Prettier to fix formatting**

Run: `npx prettier --write "src/app/**/*.{ts,tsx}"`
Expected: Files formatted cleanly.

- [ ] **Step 3: Build Verification**

Run: `npx tsc --noEmit && npm run build`
Expected: No type errors and a successful Next.js build.

### Task 3: Cleanup and Commit

**Files:**
- Modify: Workspace
- Delete: `scratch/migrate-metadata.js`

- [ ] **Step 1: Delete temporary script**

Run: `rm scratch/migrate-metadata.js`
Expected: File removed.

- [ ] **Step 2: Commit changes**

Run:
```bash
git add src/app/
git commit -m "chore: migrate all hardcoded metadata to generateSeoMetadata helper"
```
Expected: All modified files committed.
