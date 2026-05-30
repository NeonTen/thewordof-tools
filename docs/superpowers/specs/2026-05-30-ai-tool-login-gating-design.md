# Design Specification: AI Tool Login Gating & Credit Displaying

## Background & Goal
Currently, both AI and non-AI tools use local storage daily limits. With the implementation of the database-backed credits system, AI tools require user sessions to track and deduct database credits. 

This spec details the logic to gate AI tools behind a registration/login requirement while preserving anonymous usage for client-side non-AI tools.

---

## Behavior Rules

### 1. AI Tools
- **Gated behind Login:** Users must be authenticated to use AI tools (Caption Generator, SEO Generator, Prompt Optimizer, Product Description, llms.txt Builder).
- **If Logged Out:** Render the tool page but overlay/replace the generation form with a signup/login prompt: *"AI Tool Requires Account. Sign up to get 20 free monthly AI credits."*
- **If Logged In:** Thread the user's `creditsRemaining` from the database to the component. Render a cost text: `"Costs 1 credit (${creditsRemaining} remaining)"`. If credits are 0, disable the generate button and link to `/pricing`.

### 2. Client-Side Non-AI Tools
- **Anonymous Usage:** No login required.
- **Limit Display:** Keep tracking daily usage via the client-side `useUsageLimit` hook, displaying `{MAX_FREE - usedToday} of {MAX_FREE} free generations left today`.

---

## Proposed Changes

### Page Routes (`src/app/tools/*/page.tsx`)
Thread database query for user session and credits:
```typescript
const session = await auth()
const dbUser = session?.user?.id ? await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { creditsRemaining: true }
}) : null
```
Pass `creditsRemaining={dbUser?.creditsRemaining ?? null}` and `isLoggedIn={!!session?.user}` to each tool component.

### Tool Components (`src/components/tools/*.tsx`)
- Update caption generator, SEO generator, prompt generator, product description, and llms-txt generator components to accept the new props.
- Render the custom lock overlay card if `isLoggedIn` is `false`.
- Render the credit cost label and block submission if credit quota is exhausted.

---

## Verification Plan

### Automated Tests
* Run `npx tsc --noEmit` to verify type safety.
* Run `npm run build` to verify production builds.

### Manual Verification
* Access `/tools/caption-generator` as a logged-out user and verify the lock card renders.
* Log in with a user that has credits and verify the `"Costs 1 credit"` text is displayed.
* Test accessing a non-AI calculator as a logged-out user and verify it works without a login overlay.
