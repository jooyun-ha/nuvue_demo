# Nuvue Build Context (Handoff)

Last updated: 2026-02-12

## Product Direction
- Nuvue is a companion app that helps users decide what to eat based on what the camera sees.
- Current focus is validating the UX loop in small steps:
1. Home page concept and branding
2. Start scanning opens camera preview
3. Later: food detection + recommendation logic

## What Was Implemented

### 1) Home page design
- Built a custom static marketing-style home screen with:
  - Hero headline and concept copy
  - "The Concept" flow card
  - CTA buttons
- File: `/Users/djulian/project/nuvue/app/(tabs)/index.tsx`

### 2) Start Scanning functionality (initial scope)
- `Start Scanning` button is now functional.
- Behavior:
1. Requests camera permission
2. If granted, switches to live camera preview
3. Uses back camera (`facing="back"`)
4. Shows exactly what the camera sees
5. Includes a `Close` button to return to the home screen
- If permission is denied, shows an inline message telling user to enable camera access.
- File: `/Users/djulian/project/nuvue/app/(tabs)/index.tsx`

## Dependencies Added
- Added `expo-camera` (SDK-compatible install via Expo CLI).
- Files changed:
  - `/Users/djulian/project/nuvue/package.json`
  - `/Users/djulian/project/nuvue/bun.lock`

## Current UX Flow
1. User opens Home tab
2. User taps `Start Scanning`
3. Camera permission prompt appears (first time)
4. App enters full-screen camera preview mode
5. User taps `Close` to return to home

## Technical Notes
- Preview uses `CameraView` from `expo-camera`.
- Permissions use `useCameraPermissions()`.
- Screen state is local in `HomeScreen`:
  - `isScanning`: controls whether camera preview is shown
  - `permissionDenied`: controls inline permission error message
- Lint passes after the changes.

## Suggested Next Implementation Steps
1. Add scan overlay UI (framing box + helper text like "Center your plate").
2. Add "Capture frame" action and persist photo/preview for processing.
3. Add mock detection output panel (food items + confidence).
4. Add recommendation card (e.g., "better choice" suggestions) using mocked data first.
5. Refactor into components (`HomeHero`, `ConceptCard`, `CameraPreview`) as feature scope grows.

## Run Instructions
```bash
npm install
npx expo start
```

## Known Constraints
- iOS Simulator camera behavior can be limited; physical device is better for camera validation.
- No food recognition or backend integration is implemented yet.
