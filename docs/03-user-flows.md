# Nuvue MVP User Flows

Last updated: 2026-03-26

## 1. Purpose

This document translates the MVP PRD into concrete user flows that can guide screen design, routing, and implementation order.

The MVP focuses on four core experiences:

- first-time entry and onboarding
- menu deciding
- portion direction
- history review

## 2. Flow Map

The primary app flow is:

1. Launch app
2. Sign in or sign up
3. Complete onboarding
4. Land on main page
5. Choose one of:
   - Menu Deciding
   - Portion Direction
   - My History

From there:

- Menu Deciding leads to capture, guidance, and save
- Portion Direction leads to capture, guidance, and optional save
- My History leads to review of past decisions

## 3. Flow A: First-Time User Entry

### Goal

Get a new user from first launch to a usable personalized app state.

### Happy path

1. User opens the app
2. App shows welcome / entry screen
3. User taps `Sign Up`
4. User creates account
5. App routes user to onboarding
6. User completes profile questions
7. App saves onboarding data
8. App routes user to main page

### Required screens

- Welcome / auth entry
- Sign up
- Onboarding
- Main page

### Key decisions

- If auth is mocked for MVP, the flow still needs the same screen order
- Onboarding should be short enough to complete in one sitting

### Exit criteria

User reaches the main page with a saved profile and can begin one of the core guidance flows.

## 4. Flow B: Returning User Entry

### Goal

Let an existing user re-enter the app with minimal friction.

### Happy path

1. User opens the app
2. App checks auth state
3. If signed in and onboarding is complete, app routes directly to main page
4. User selects a mode

### Alternate path

1. User is authenticated
2. Onboarding is incomplete
3. App routes user back into onboarding
4. After completion, app routes to main page

## 5. Flow C: Menu Deciding

### Goal

Help the user choose between menu or food options using camera capture and recommendation guidance.

### Happy path

1. User lands on main page
2. User taps `Menu Deciding`
3. App opens camera permission gate if needed
4. User grants permission
5. App shows camera preview with framing guidance
6. User points camera at menu or visible options
7. User taps capture
8. App shows analyzing state
9. App returns recommendation result
10. User reviews suggested option and explanation
11. User confirms final decision
12. App saves decision
13. App shows success feedback
14. User can return home or view history

### Inputs

- user profile
- captured image
- selected mode = `Menu Deciding`

### Outputs

- recommendation summary
- nutrition or decision tags
- final chosen option
- saved history entry

### Required states

- permission needed
- camera preview
- capture ready
- analyzing
- result shown
- save success
- save failure

## 6. Flow D: Portion Direction

### Goal

Help the user interpret whether a visible portion looks appropriate for their goal.

### Happy path

1. User lands on main page
2. User taps `Portion Direction`
3. App opens camera permission gate if needed
4. User grants permission
5. App shows camera preview with simple framing guidance
6. User points camera at a plate or food item
7. User taps capture
8. App shows analyzing state
9. App returns portion guidance
10. User reviews the directional advice
11. User optionally saves the decision
12. App stores the history item if saved

### Inputs

- user profile
- captured food image
- selected mode = `Portion Direction`

### Outputs

- portion assessment
- short explanation
- optional saved history item

### Required states

- permission needed
- camera preview
- capture ready
- analyzing
- guidance shown
- save success
- save failure

## 7. Flow E: My History

### Goal

Let users review previous food decisions and guidance results.

### Happy path

1. User lands on main page
2. User taps `My History`
3. App shows decision log
4. User selects one history item
5. App opens decision detail
6. User reviews:
   - captured image
   - recommendation summary
   - final choice
   - mode used
   - timestamp

### Empty state

1. User opens `My History`
2. App finds no saved decisions
3. App shows empty state
4. User is prompted to try `Menu Deciding` or `Portion Direction`

## 8. Flow F: Save Final Decision

### Goal

Close the guidance loop by storing the user's actual choice.

### Happy path

1. User sees recommendation result
2. User taps `Save Decision`
3. App stores:
   - mode
   - timestamp
   - image reference if available
   - recommendation summary
   - final decision
4. App shows confirmation
5. User can go to history or return home

### Notes

This flow is important because it creates the feedback loop needed for long-term product value.

## 9. Error and Edge Flows

### 9.1 Camera permission denied

1. User enters a camera-based mode
2. App requests permission
3. User denies permission
4. App shows clear explanation
5. App offers:
   - retry permission
   - open settings
   - return home

### 9.2 Blurry or unreadable capture

1. User captures image
2. App cannot detect enough useful information
3. App shows "could not analyze clearly"
4. App prompts user to retake the image

### 9.3 No food or menu detected

1. User captures image
2. App analysis returns no meaningful content
3. App explains what was missing
4. App offers retake

### 9.4 Low-confidence guidance

1. App analyzes image
2. Confidence is too low for a clear suggestion
3. App returns cautious language
4. App offers either:
   - retake image
   - view partial tags only
   - skip saving

### 9.5 Save failure

1. User attempts to save decision
2. Save fails due to local or network issue
3. App informs user
4. App allows retry

## 10. Screen-to-Flow Mapping

### Auth and onboarding

- Welcome screen
- Sign in screen
- Sign up screen
- Onboarding questionnaire

### Main app

- Main page
- Menu Deciding camera screen
- Menu Deciding result screen
- Portion Direction camera screen
- Portion Direction result screen
- My History list screen
- History detail screen

## 11. Recommended Implementation Order

Build flows in this order:

1. First-time user entry
2. Returning user entry
3. Menu Deciding
4. Save Final Decision
5. My History
6. Portion Direction
7. Error and recovery states

This order keeps the strongest validation loop first:

- onboarding
- capture
- guidance
- save
- review

## 12. Open Questions

- Should first release require full sign-up, or allow guest mode?
- Should save be required after each guidance result, or optional?
- Should `Menu Deciding` support menus only in v1, or also visible food choices?
- Should `Portion Direction` show text only, or visual overlay plus text?
- How much of the result is recommendation versus raw detected nutrition tags?
