# Invoice Generator Save/Load Modals Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the missing Save and Load modals in the Invoice Generator to allow saving and loading invoices from the cloud.

**Architecture:** We will import the required icons (`X`, `Loader2`) and render the Save and Load modal markups (which check `isSaveModalOpen` and `isLoadModalOpen` respectively) right before the end of the return fragment in the Invoice Generator component. This matches the pattern in the CV Builder.

**Tech Stack:** React, Next.js, TailwindCSS (for utility classes), Lucide React (for icons)

---

### Task 1: Update Imports and Add Modal Markup in Invoice Generator

**Files:**
- Modify: `src/components/tools/invoice-generator.tsx`

- [ ] **Step 1: Add X and Loader2 to Lucide React imports**

In `src/components/tools/invoice-generator.tsx:3-5`, modify the import:
```tsx
import { Plus, Trash2, Download, Printer, Save, FolderOpen, X, Loader2 } from "lucide-react"
```

- [ ] **Step 2: Append Modal markups at the end of the JSX return fragment**

In `src/components/tools/invoice-generator.tsx`, right before the closing tag `</>` of the main component return statement (around lines 547-548), add the Save and Load Modal markup:

```tsx
    {isSaveModalOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300" 
          onClick={() => setIsSaveModalOpen(false)} 
        />
        <div className="relative w-full max-w-sm overflow-hidden rounded-3xl border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 h-8 w-8 rounded-full" 
            onClick={() => setIsSaveModalOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Save className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black">Save Invoice Progress</h3>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase font-black text-muted-foreground">Invoice Title</Label>
              <Input 
                value={saveTitle} 
                onChange={e => setSaveTitle(e.target.value)}
                placeholder="Invoice - Web Development"
                className="h-10 text-xs"
              />
            </div>
            <Button 
              onClick={() => handleSaveInvoice()} 
              disabled={isSavingInvoice || !saveTitle}
              className="w-full h-11 font-black"
            >
              {isSavingInvoice ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save to Cloud"}
            </Button>
          </div>
        </div>
      </div>
    )}

    {isLoadModalOpen && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-background/80 backdrop-blur-md animate-in fade-in duration-300" 
          onClick={() => setIsLoadModalOpen(false)} 
        />
        <div className="relative w-full max-w-md overflow-hidden rounded-3xl border bg-background p-6 shadow-2xl animate-in zoom-in-95 duration-300">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-4 right-4 h-8 w-8 rounded-full" 
            onClick={() => setIsLoadModalOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black">My Saved Invoices</h3>
            </div>
            
            {isLoadingInvoicesList ? (
              <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
            ) : savedInvoicesList.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No saved invoices found. Click Save to create one.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                {savedInvoicesList.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 border rounded-xl hover:bg-muted/40 transition-all">
                    <div className="truncate pr-4">
                      <p className="text-xs font-black truncate">{r.title}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(r.updatedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="secondary" onClick={() => handleLoadInvoice(r.id)} className="h-8 text-[10px] font-bold">
                        Load
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteInvoice(r.id)} className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
```

- [ ] **Step 3: Verify build compiles and run local dev validation**

Run a build validation command:
Run: `npm run build` or verify there are no compilation errors.

- [ ] **Step 4: Commit the changes**
```bash
git add src/components/tools/invoice-generator.tsx
git commit -m "feat: implement missing save and load modals in invoice generator"
```
