# Nuvue MVP Technical Spec

Last updated: 2026-03-26

## 1. Purpose

This document translates the MVP product scope into an implementation plan for the current mobile app.

It focuses on the first version of:

- app structure
- routing
- data model
- camera workflow
- recommendation pipeline
- storage

## 2. Current App Context

The current codebase is an Expo Router React Native app with:

- Expo SDK
- React Native
- TypeScript
- `expo-camera`

The project already has an initial home screen and camera preview behavior, but the app still includes starter-template structure that will need to be replaced as the MVP is built out.

## 3. Technical Goals For MVP

- ship one stable mobile app flow
- support onboarding and basic persistence
- support camera-based capture flows
- display recommendation results quickly
- save and retrieve decision history
- allow mocked intelligence first, then swap in a real backend later

## 4. Proposed Architecture

### Frontend

- Expo Router for navigation
- React Native screens and shared components
- local UI state for in-progress flows
- shared domain types for user profile, captures, recommendations, and history

### Backend approach for MVP

Recommended staged approach:

1. local mocked data and fake analysis responses
2. thin backend endpoint for image analysis and recommendation
3. stronger recommendation and personalization logic after flow validation

This reduces early complexity and lets the team validate UX before model quality is fully solved.

## 5. Route Structure

Suggested route layout:

- `app/index.tsx` or auth entry route
- `app/sign-in.tsx`
- `app/sign-up.tsx`
- `app/onboarding.tsx`
- `app/(tabs)/index.tsx` for main page
- `app/menu-deciding/camera.tsx`
- `app/menu-deciding/result.tsx`
- `app/portion-direction/camera.tsx`
- `app/portion-direction/result.tsx`
- `app/history/index.tsx`
- `app/history/[id].tsx`

If the team prefers, `Menu Deciding`, `Portion Direction`, and `History` can also live under a tabs-based structure.

## 6. Recommended Feature Modules

Suggested internal structure:

- `components/auth`
- `components/onboarding`
- `components/camera`
- `components/results`
- `components/history`
- `lib`
- `types`
- `services`

Suggested service boundaries:

- `services/auth`
- `services/profile`
- `services/capture`
- `services/recommendation`
- `services/history`

## 7. Data Model

### UserProfile

Suggested fields:

- `id`
- `height`
- `weight`
- `age`
- `sexOrGender`
- `foodPreferences`
- `targetNutrients`
- `healthConstraints`
- `helpGoal`
- `createdAt`
- `updatedAt`

### CaptureRecord

Suggested fields:

- `id`
- `userId`
- `mode`
- `imageUri`
- `createdAt`

### RecommendationResult

Suggested fields:

- `id`
- `captureId`
- `mode`
- `summary`
- `explanation`
- `tags`
- `confidence`
- `rawStructuredOutput`
- `createdAt`

### DecisionHistoryItem

Suggested fields:

- `id`
- `userId`
- `mode`
- `captureId`
- `recommendationId`
- `finalDecision`
- `notes`
- `createdAt`

## 8. State Management

For MVP, keep state simple:

- component state for temporary UI state
- a lightweight shared store only if navigation handoff becomes awkward

Examples of temporary state:

- camera permission status
- current capture URI
- current recommendation result
- save status

Examples of persisted state:

- auth session
- onboarding profile
- decision history

## 9. Camera Workflow

### Menu Deciding

1. enter camera screen
2. request camera permission if needed
3. show preview
4. capture photo
5. persist temporary image URI
6. send image for analysis
7. navigate to result screen with response

### Portion Direction

1. enter camera screen
2. request permission if needed
3. show preview
4. capture photo
5. persist temporary image URI
6. send image for analysis
7. navigate to result screen with response

## 10. Recommendation Pipeline

### MVP v1

Use mocked or rule-based responses.

The app should support returning a normalized response shape like:

- `summary`
- `explanation`
- `tags`
- `confidence`
- `mode`

### MVP v2

Replace the mock layer with an API-backed service.

Potential backend responsibilities:

- image upload handling
- OCR for menus if needed
- food or nutrition inference
- personalized recommendation generation
- confidence scoring

## 11. Persistence Strategy

### Local-first MVP option

Use local persistence for:

- onboarding data
- saved decisions
- recent captures

This is useful if the team wants to validate the UI flow before backend setup.

### Backend-connected MVP option

Use a backend for:

- auth
- profile persistence
- decision history sync
- image analysis

A hybrid path is acceptable:

- local UI flow first
- backend integration second

## 12. Suggested Analytics Events

Track at least:

- `auth_started`
- `auth_completed`
- `onboarding_started`
- `onboarding_completed`
- `mode_opened`
- `camera_permission_requested`
- `camera_permission_granted`
- `camera_permission_denied`
- `capture_taken`
- `analysis_started`
- `analysis_succeeded`
- `analysis_failed`
- `decision_saved`
- `history_opened`

## 13. Error Handling Requirements

The app should gracefully handle:

- missing camera permission
- capture failure
- unreadable image
- analysis timeout or failure
- low-confidence output
- save failure
- missing persisted data

The user should always have a recovery action such as:

- retry
- retake
- go back
- open settings

## 14. Privacy and Safety Notes

- camera captures may include sensitive personal or health-related context
- profile data should be treated as sensitive
- recommendation language should avoid implying medical diagnosis
- if the product later expands into clinical use cases, the safety bar must increase significantly

## 15. Testing Scope

### Initial testing

- route navigation
- onboarding submission
- camera permission behavior
- image capture success and failure
- result rendering
- save decision flow
- history rendering

### Device testing

- at least one iPhone physical device
- at least one Android device if supported in the first release

Physical device testing is important because simulator camera behavior is limited.

## 16. Recommended Implementation Sequence

1. routing and screen skeletons
2. onboarding data model and local persistence
3. camera component and capture flow
4. mocked recommendation service
5. result screens
6. save decision flow
7. history list and detail view
8. analytics and polish

## 17. Open Technical Questions

- Will auth be real or mocked for the first internal version?
- Will history be local-only or synced?
- What service will handle image analysis in v2?
- Should results be passed through navigation params, local store, or persistence?
- How much structured output is needed beyond a human-readable summary?
