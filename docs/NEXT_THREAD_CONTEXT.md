# Nuvue Next Thread Context

Last updated: 2026-03-28

## 1. Restart Instruction

Start future sessions by reading:

- `docs/NEXT_THREAD_CONTEXT.md`
- `docs/WORK_LOG.md`
- `docs/01-vision-brief.md`
- `docs/02-mvp-prd.md`
- `docs/03-user-flows.md`
- `docs/04-screen-spec.md`
- `docs/05-technical-spec.md`
- `docs/06-build-plan.md`

Suggested prompt:

```text
Please read docs/NEXT_THREAD_CONTEXT.md first, then docs/WORK_LOG.md, then continue from the listed next recommended task.
```

## 2. Current Snapshot

- Project path: `/Users/jooyun/Desktop/codex/nuvue_demo`
- Active branch: `codex/comparison-guidance`
- Latest commit: `790bba8f874dd145fa2cdd3433768d040316f38e`
- GitHub origin: `https://github.com/jooyun-ha/nuvue_demo.git`
- GitHub upstream: `https://github.com/Neiso/nuvue_demo.git`

## 3. What The App Does Now

The current app is no longer just a camera preview prototype.

Implemented flows:

- camera scan screen with comparison-guidance overlays
- focus buttons:
  - `Balanced`
  - `Carbohydrate`
  - `Protein`
  - `Low Potassium`
- best option is highlighted in red, other options in white
- tapping a food box opens a summary card
- tapping the summary card closes it
- `Choose this` saves a local decision record
- `Saved to My History` toast appears after save
- tapping the toast opens `My History`
- `My History` groups entries by date
- each history entry shows a left thumbnail placeholder and right explanation area
- tapping the right explanation area opens a nutrient facts detail page
- nutrient detail page shows richer facts:
  - kcal
  - carbs
  - protein
  - fat
  - potassium
  - vitamin B
  - sodium
- nutrient detail page includes a small source notice:
  - `Food database source: FatSecret`

Current limitation:

- food detection and nutrient data are still mostly mock-driven in the app UI
- FatSecret proxy route exists, but the app is not yet wired to consume live FatSecret responses
- AsyncStorage may not be available in every local runtime, so the history layer includes an in-memory fallback

## 4. Key Product Decisions Made

- version 1 should work in Expo Go using capture-first behavior instead of true realtime model inference
- comparison UX should recommend one best option against other visible foods, not just color foods by nutrient ranges
- focus-specific comparison matters:
  - balanced comparison
  - carbohydrate-focused comparison
  - protein-focused comparison
  - low-potassium comparison
- decision logging should distinguish between:
  - inspecting a food
  - explicitly choosing a food
- history should feel like a food decision log, grouped by date
- nutrient fact detail pages should be deeper than history cards and show richer nutrient context

## 5. Important Files Changed In This Phase

Core app/UI:

- `app/(tabs)/index.tsx`
- `app/(tabs)/explore.tsx`
- `app/(tabs)/_layout.tsx`
- `app/history/[entryId].tsx`

Data/model helpers:

- `types/detection.ts`
- `types/history.ts`
- `lib/comparison/scoring.ts`
- `lib/detection/mockRealtimeDetections.ts`
- `lib/history/storage.ts`
- `lib/nutrition/carbohydrate.ts`

FatSecret backend route:

- `api/fatsecret/search.ts`

Project config changed earlier in the same thread family:

- `package.json`
- `package-lock.json`
- `app.json`

## 6. Current FatSecret State

FatSecret integration progress:

- developer credentials exist
- Vercel project exists
- server route added at `api/fatsecret/search.ts`
- route handles:
  - OAuth token exchange
  - `foods.search`
  - `food.get`
  - normalized nutrient response

Important current note:

- the route was committed and pushed on branch `codex/comparison-guidance`
- `nuvue-demo.vercel.app` likely points to the production branch, so the current route may need to be tested using the preview deployment URL for this branch unless production settings are changed

## 7. Known Environment / Tooling Notes

- use `npx expo start` or the package scripts from the repo root
- `react-native-vision-camera` requires native build support and will not run in Expo Go
- Expo Go currently uses the fallback camera path
- AsyncStorage can fail if the native module is unavailable in the current runtime; the app now degrades to in-memory storage instead of crashing

## 8. Recommended Next Task

The next best implementation step is:

Wire the mobile app to the real FatSecret backend route so saved history and nutrient facts stop depending on mock nutrient values.

Suggested order:

1. confirm the correct Vercel preview URL for `codex/comparison-guidance`
2. test `api/fatsecret/search.ts` with a real request like `banana`
3. add an app-side fetch helper for the FatSecret proxy
4. replace the mock nutrient snapshot builder with live nutrient lookup
5. add request logging so FatSecret usage can be counted cleanly

## 9. Session-End Checklist

Before ending a future session:

- update this file with the newest snapshot
- append the session to `docs/WORK_LOG.md`
- include branch, commit, changed files, decisions, and next task
