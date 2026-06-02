# Spec: Fix Missing Save and Load Modals in Invoice Generator

## Goal Description
In the Invoice Generator tool, clicking the 'Save Cloud' and 'Load' buttons currently does nothing because the modal dialogs are not rendered in the JSX. This spec restores full parity with the AI CV Builder's save/load features by adding the missing modal UI.

## Proposed Changes

### [invoice-generator.tsx](file:///Users/sajidkhan/.gemini/antigravity/scratch/thewordof-tools/src/components/tools/invoice-generator.tsx)

* Update `lucide-react` imports to include `X` and `Loader2`.
* Implement the Save Modal JSX (`isSaveModalOpen`) using identical layout/styling from CV Builder adapted for invoices.
* Implement the Load Modal JSX (`isLoadModalOpen`) listing saved invoices with load and delete buttons.

## Verification Plan

### Manual Verification
* Run the application and open the Invoice Generator page.
* Click **Save Cloud**, ensure the modal opens, enter a title, and submit.
* Verify the modal closes and the active invoice is saved.
* Click **Load**, ensure the list loads, load a saved invoice, and verify data updates.
* Delete a saved invoice from the list and ensure it removes successfully.
