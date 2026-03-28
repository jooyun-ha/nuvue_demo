# Nuvue Work Log

This file is the chronological history of product, documentation, and implementation work.

Use this file when you need to:

- understand what changed on a specific date
- recover earlier decisions or assumptions
- compare the current direction with previous discussions
- align docs with git history across devices

## Repo Reference

- Local project path on this machine: `/Users/jooyun/Desktop/codex/nuvue_demo`
- GitHub origin: `https://github.com/jooyun-ha/nuvue_demo.git`
- GitHub upstream: `https://github.com/Neiso/nuvue_demo.git`

## Logging Rule

For each work session, append:

- date
- summary of what changed
- important product decisions
- docs updated
- code updated
- git branch
- git commit at session start or end
- next recommended step

---

## 2026-03-27

### Summary

- Reviewed the existing Nuvue Expo app folder and confirmed it was a partially customized Expo starter project rather than a broken project.
- Identified that the app already had a custom home screen and camera preview flow, while other starter-template screens were still present.
- Verified that lint passed and that the app structure was currently more complete in concept than in implementation.

### Environment and Tooling Notes

- Confirmed the project path in use was `/Users/jooyun/Desktop/codex/nuvue_demo`.
- Confirmed `npx expo` should be used instead of the global legacy `expo` CLI.
- Confirmed `bun` was not installed in the checked environment.
- Confirmed `nvm` was not available in the checked environment.
- Noted that Node should ideally be on a stable LTS if runtime issues appear.

### Product and Documentation Decisions

- Decided to formalize the project with a structured docs set in `docs/`.
- Drafted the first core product document:
  - `docs/02-mvp-prd.md`
- Drafted the first flow document:
  - `docs/03-user-flows.md`

### Key MVP Direction Captured

- Nuvue is a camera-first food decision helper.
- The MVP should focus on:
  - onboarding and lightweight personalization
  - `Menu Deciding`
  - `Portion Direction`
  - `My History`
  - save final decision
- The product should feel supportive, not restrictive.

### Docs Updated

- `docs/02-mvp-prd.md`
- `docs/03-user-flows.md`

### Code Updated

- No major app code changes in this documentation-focused session.

### Git Reference

- Branch during later follow-up work in this thread family: `codex/comparison-guidance`
- Commit reference available later in the project log for synced sessions

### Next Recommended Step

- Create the rest of the docs package so the product direction, screen requirements, technical plan, and build order are all aligned.

---

## 2026-03-28

### Summary

- Completed the full MVP documentation set.
- Rewrote the handoff file into a reusable restart guide for future Codex sessions and cross-laptop continuity.
- Established a two-file memory system:
  - `NEXT_THREAD_CONTEXT.md` for the latest snapshot
  - `WORK_LOG.md` for chronological history

### Product and Documentation Decisions

- Added the remaining docs:
  - `docs/01-vision-brief.md`
  - `docs/04-screen-spec.md`
  - `docs/05-technical-spec.md`
  - `docs/06-build-plan.md`
- Replaced the older machine-specific handoff notes in:
  - `docs/NEXT_THREAD_CONTEXT.md`
- Decided that future sessions should always begin by reading the handoff file first, then the docs set as needed.
- Decided that dated history should live in `docs/WORK_LOG.md` rather than bloating the handoff file.

### Current MVP Reference Set

- `docs/01-vision-brief.md`
- `docs/02-mvp-prd.md`
- `docs/03-user-flows.md`
- `docs/04-screen-spec.md`
- `docs/05-technical-spec.md`
- `docs/06-build-plan.md`
- `docs/NEXT_THREAD_CONTEXT.md`
- `docs/WORK_LOG.md`

### Code Updated

- No major app code changes in this documentation-focused session.

### Git Reference

- Branch: `codex/comparison-guidance`
- Commit at that point: `790bba8f874dd145fa2cdd3433768d040316f38e`

### Next Recommended Step

- Start implementation by replacing leftover starter routes with MVP screen placeholders and the target route structure described in `docs/05-technical-spec.md`.

---

## 2026-03-28

### Summary

- Turned the camera prototype into a comparison-guidance flow with selectable focus modes.
- Added local decision-save behavior, `My History`, and a nutrient-facts detail page.
- Added a first FatSecret Vercel proxy route for real food lookup and nutrient normalization.

### Branch And Commit

- Branch: `codex/comparison-guidance`
- Latest commit during this handoff: `790bba8f874dd145fa2cdd3433768d040316f38e`

### Changed Files

- `app/(tabs)/index.tsx`
- `app/(tabs)/explore.tsx`
- `app/(tabs)/_layout.tsx`
- `app/history/[entryId].tsx`
- `types/detection.ts`
- `types/history.ts`
- `lib/comparison/scoring.ts`
- `lib/detection/mockRealtimeDetections.ts`
- `lib/history/storage.ts`
- `lib/nutrition/carbohydrate.ts`
- `api/fatsecret/search.ts`
- `package.json`
- `package-lock.json`
- `app.json`
- `docs/NEXT_THREAD_CONTEXT.md`
- `docs/WORK_LOG.md`

### Decisions Made

- comparison should recommend one best food option instead of only classifying foods by nutrient range
- comparison needs multiple focus modes:
  - balanced
  - carbohydrate
  - protein
  - low potassium
- history save should happen only on explicit `Choose this`, not on summary open
- `Saved to My History` should remain as a toast and become the navigation trigger into history
- history should be grouped by date
- nutrient facts should live on a deeper detail page reached from the explanation side of a history card
- the deeper page should show a broader nutrient set and identify FatSecret as the source
- FatSecret should be called through a secure server route, not directly from the Expo app

### Code State At Handoff

- scan screen supports comparison guidance and food selection
- decision history works locally, with in-memory fallback when AsyncStorage native support is unavailable
- history cards show left thumbnail / right explanation layout
- right-side explanation opens the nutrient-facts detail page
- nutrient detail page shows:
  - kcal
  - carbs
  - protein
  - fat
  - potassium
  - vitamin B
  - sodium
- FatSecret proxy route exists at `api/fatsecret/search.ts`

### Important Notes

- `nuvue-demo.vercel.app` likely points to the production branch, so the new FatSecret route may need to be tested via the branch preview deployment URL unless production branch settings are updated
- the handoff docs were updated after the latest code commit, so docs changes are currently uncommitted

### Next Recommended Task

1. confirm the correct Vercel preview deployment URL for `codex/comparison-guidance`
2. test `api/fatsecret/search.ts` with a real food query like `banana`
3. add an app-side FatSecret fetch helper
4. replace mock nutrient snapshots with live FatSecret data
5. add simple backend request logging to count FatSecret usage
