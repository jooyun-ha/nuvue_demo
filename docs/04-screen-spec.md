# Nuvue MVP Screen Spec

Last updated: 2026-03-26

## 1. Purpose

This document defines the screens required for the Nuvue MVP and the key requirements for each screen.

It is intended to help product, design, and engineering align on:

- what each screen is for
- what content it must contain
- what actions it must support
- what empty, loading, and error states are required

## 2. Screen List

The MVP screen set is:

1. Welcome / Auth Entry
2. Sign In
3. Sign Up
4. Onboarding
5. Main Page
6. Menu Deciding Camera
7. Menu Deciding Result
8. Portion Direction Camera
9. Portion Direction Result
10. My History
11. History Detail

## 3. Screen Spec

### 3.1 Welcome / Auth Entry

#### Purpose

Introduce the app and direct the user into authentication.

#### Must include

- logo or wordmark
- short product promise
- `Sign In` CTA
- `Sign Up` CTA

#### Primary action

- `Sign Up`

#### Secondary action

- `Sign In`

#### States

- default

### 3.2 Sign In

#### Purpose

Allow returning users to authenticate.

#### Must include

- email field
- password field
- submit CTA
- link to sign up

#### Primary action

- `Continue`

#### Secondary action

- `Create account`

#### States

- default
- loading
- invalid credentials
- generic auth failure

### 3.3 Sign Up

#### Purpose

Allow new users to create an account and enter onboarding.

#### Must include

- email field
- password field
- submit CTA
- link to sign in

#### Primary action

- `Create account`

#### Secondary action

- `Already have an account? Sign in`

#### States

- default
- loading
- validation error
- generic auth failure

### 3.4 Onboarding

#### Purpose

Collect a lightweight profile used to personalize guidance.

#### Must include

- height input
- weight input
- age or age range
- sex or gender input if used
- food preference input
- target nutrient or dietary focus
- health-related constraint input if relevant
- "what help do you need most?" input
- submit CTA

#### Primary action

- `Submit`

#### Secondary action

- `Back`

#### States

- default
- partially completed
- validation error
- loading
- submit success

#### Notes

The screen may be split into steps if a single page feels too dense.

### 3.5 Main Page

#### Purpose

Act as the home hub for the three main product modes.

#### Must include

- welcome or lightweight profile-aware header
- entry card or button for `Menu Deciding`
- entry card or button for `Portion Direction`
- entry card or button for `My History`
- profile or settings access

#### Primary actions

- open `Menu Deciding`
- open `Portion Direction`
- open `My History`

#### States

- default
- loading profile
- partial failure if one module cannot load

### 3.6 Menu Deciding Camera

#### Purpose

Capture menu or food-option context for recommendation.

#### Must include

- camera preview
- permission prompt or recovery UI
- capture button
- close or back action
- helper text for framing

#### Primary action

- `Capture`

#### Secondary actions

- `Back`
- `Retry permission`

#### States

- permission needed
- permission denied
- live camera
- capture in progress
- analysis starting

### 3.7 Menu Deciding Result

#### Purpose

Show recommendation guidance after the image is analyzed.

#### Must include

- captured image preview
- recommendation summary
- short explanation
- useful tags such as protein, carb, GI, potassium, allergy notes, or similar
- final choice input or confirmation action
- save CTA
- retake CTA

#### Primary action

- `Save Decision`

#### Secondary actions

- `Retake`
- `Back to Home`

#### States

- loading analysis
- result available
- low-confidence result
- analysis failure
- save success
- save failure

### 3.8 Portion Direction Camera

#### Purpose

Capture a plate or food image for portion guidance.

#### Must include

- camera preview
- permission prompt or recovery UI
- capture button
- close or back action
- helper text for framing

#### Primary action

- `Capture`

#### Secondary actions

- `Back`
- `Retry permission`

#### States

- permission needed
- permission denied
- live camera
- capture in progress
- analysis starting

### 3.9 Portion Direction Result

#### Purpose

Show directional guidance about portion size or balance.

#### Must include

- captured image preview
- portion assessment
- short explanation
- optional visual guidance or highlighted area later
- save CTA
- retake CTA

#### Primary action

- `Save Decision`

#### Secondary actions

- `Retake`
- `Back to Home`

#### States

- loading analysis
- guidance available
- low-confidence result
- analysis failure
- save success
- save failure

### 3.10 My History

#### Purpose

Show the user a list of saved decisions.

#### Must include

- screen title
- chronological list of history items
- thumbnail if available
- short recommendation summary
- timestamp
- mode label

#### Primary action

- open decision detail

#### Secondary action

- back to home

#### States

- loading
- list with results
- empty state
- load failure

### 3.11 History Detail

#### Purpose

Show the full context of a saved decision.

#### Must include

- captured image if available
- mode used
- recommendation summary
- final decision
- timestamp
- optional note field later

#### Primary action

- return to history

#### Secondary actions

- back to home

#### States

- loading
- detail available
- missing data fallback

## 4. Cross-Screen Requirements

All screens should:

- use simple, non-judgmental language
- keep primary CTAs obvious
- make back or exit actions easy to find
- handle slow loading gracefully
- work on common mobile screen sizes

## 5. Design Priorities

- clarity over density
- fast scanability
- supportive tone
- confidence-building outputs

## 6. Open Questions

- Should onboarding be one screen or multi-step?
- Should results require explicit final-choice entry before saving?
- Should `Menu Deciding` and `Portion Direction` share a single camera component?
- How much explanation is enough before results feel too heavy?
