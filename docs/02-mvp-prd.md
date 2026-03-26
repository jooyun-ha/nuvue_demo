# Nuvue MVP PRD

Last updated: 2026-03-26

## 1. Overview

Nuvue is a mobile food decision helper that gives users practical guidance in the moment they are deciding what to eat. The MVP focuses on a camera-first mobile experience that helps users:

- decide between menu options
- understand portion direction from what they see
- save their final decision and review past decisions later

The goal of the MVP is not to provide perfect nutrition coaching. The goal is to validate that users want lightweight, personalized guidance at the moment of choice.

## 2. Problem Statement

People often know they want to eat "better," but struggle to act on that intention in real-world moments such as:

- looking at a restaurant menu
- deciding whether a portion is too much or appropriate
- balancing taste, goals, and nutrition tradeoffs quickly

Current tools are often too manual, too generic, or too judgmental. Nuvue aims to provide adaptive guidance without making users feel restricted or overwhelmed.

## 3. Product Goal

Help users make food decisions in real time with a simple mobile workflow:

1. set up a personal profile
2. capture a menu or food scene
3. receive practical guidance
4. save the final decision
5. review decision history later

## 4. Target Users

### Primary users

- health-conscious adults who want easier food decisions
- users with specific nutrition priorities such as weight goals, macro balance, blood sugar awareness, or dietary restrictions
- users who want guidance in context instead of reading nutrition content later

### Early adopter profile

- comfortable using a camera-based mobile app
- willing to answer a short onboarding questionnaire
- interested in quick suggestions, not long-form coaching

## 5. MVP Success Criteria

The MVP is successful if we can validate the following:

- users complete onboarding and reach the main app experience
- users can successfully use camera-based guidance in at least one mode
- users understand the recommendation output without extra explanation
- users save decisions and return to review history
- users report that the app reduces decision friction

### Suggested MVP metrics

- onboarding completion rate
- first successful scan rate
- recommendation view rate
- saved decision rate
- 7-day return rate
- qualitative feedback on trust and usefulness

## 6. Core Product Principles

- guidance should feel supportive, not punishing
- outputs should be fast and easy to understand
- personalization should improve relevance without creating a heavy setup burden
- MVP should start simple and validate one strong loop before expanding

## 7. MVP Scope

### In scope

- sign in / sign up entry point
- onboarding questionnaire
- personal profile fields
- home screen with three primary modules
- menu deciding flow
- portion direction flow
- my history flow
- camera permission handling
- image capture
- recommendation or guidance result
- save final decision

### Out of scope for MVP

- live video call with a dietitian
- smart glasses integration
- real-time always-on guidance
- advanced pattern analysis and long-term coaching
- social/community features
- meal planning
- barcode scanning
- wearable integrations
- fully automated medical or clinical advice

## 8. User Needs

Users need to:

- get help quickly when deciding between foods
- receive guidance that reflects their goals and constraints
- understand the reason behind a suggestion
- feel in control of the final choice
- keep a record of previous decisions for reflection

## 9. Core MVP Flows

### Flow A: First-time user

1. User opens app
2. User signs in or signs up
3. User completes onboarding
4. User lands on main page
5. User selects a mode

### Flow B: Menu Deciding

1. User opens `Menu Deciding`
2. User points camera at menu or food options
3. User captures image
4. App analyzes visible items
5. App returns recommendation guidance
6. User chooses a final decision
7. App saves the decision to history

### Flow C: Portion Direction

1. User opens `Portion Direction`
2. User points camera at plate or food item
3. User captures image
4. App returns simple portion guidance
5. User accepts, ignores, or adjusts based on the suggestion
6. User saves final decision if desired

### Flow D: My History

1. User opens `My History`
2. User sees previous decision log
3. User opens a saved decision
4. User reviews recommendation, context, and final choice

## 10. Feature Requirements

### 10.1 Authentication

The app must provide:

- sign in screen
- sign up screen
- a clear path into onboarding after account creation

For MVP, auth can be simple email-based auth or even mocked auth if the team is validating product flow first.

### 10.2 Onboarding

The onboarding flow should collect enough information to personalize guidance without becoming too long.

#### Required fields

- height
- weight
- age range or age
- sex or gender input if used by recommendation logic
- food preferences / taste profile
- target nutrient focus or dietary concern
- optional health-related constraints relevant to food decisions
- what kind of help the user wants most

#### Onboarding output

The app should create a lightweight profile that influences recommendation logic and displayed guidance.

### 10.3 Main Page

The main page must surface the three core modes:

- `Menu Deciding`
- `Portion Direction`
- `My History`

The page should make it obvious what each mode does and let the user start within one tap.

### 10.4 Menu Deciding

This is the primary MVP feature.

The feature must allow users to:

- open the camera
- capture a menu, menu board, or food option
- receive simple recommendation guidance
- understand why one option may be better for their goals
- save the final decision

#### Recommendation output should include

- suggested best option or shortlist
- short explanation
- notable tags such as protein, carb, GI, potassium, allergy-related flags, or similar nutrition markers

For MVP, the output can be generated from mocked logic or a narrow AI pipeline if accuracy is still being validated.

### 10.5 Portion Direction

This feature helps users judge portion size or plate balance from a captured image.

The feature must allow users to:

- capture a food image
- receive simple visual or text guidance
- understand whether the portion appears high, balanced, or worth adjusting

#### Example output

- "This portion looks larger than typical for your goal."
- "Consider reducing the rice portion."
- "Protein looks low relative to the rest of the plate."

The guidance should be directional, not overly clinical.

### 10.6 My History

History should store a basic log of past decisions.

Each history item should include:

- date/time
- mode used
- captured image thumbnail if available
- recommendation summary
- final decision

Advanced analytics can be postponed until after MVP validation.

### 10.7 Save Final Decision

After viewing guidance, the user should be able to save:

- what they chose
- the context or mode
- key recommendation output
- optional notes later if desired

This is important because it closes the loop and makes `My History` meaningful.

## 11. Non-Functional Requirements

- app should feel fast enough for in-the-moment use
- camera permission flow should be clear and recoverable
- recommendation UI should be understandable within a few seconds
- copy should avoid shame-based language
- captured data should be handled with privacy in mind

## 12. Key Edge Cases

- camera permission denied
- blurry or unreadable capture
- no food or menu detected
- multiple unclear menu options
- recommendation confidence is low
- user profile is incomplete
- capture succeeds but save fails
- offline or poor network if cloud analysis is used

## 13. Risks and Open Questions

- How accurate does recommendation quality need to be for users to trust it?
- Should MVP use fully mocked outputs, a rule-based system, or an AI model?
- Is image capture enough, or do users expect true real-time analysis?
- How much personalization is required before guidance feels relevant?
- Does `Menu Deciding` deliver more value than `Portion Direction`, and should it be built first?

## 14. Recommended MVP Build Order

### Phase 1: Foundation

- auth screens
- onboarding flow
- profile storage
- main dashboard shell

### Phase 2: Menu Deciding v1

- camera permission
- camera preview
- capture flow
- mocked recommendation result
- save final decision

### Phase 3: My History v1

- list view of decision log
- decision detail view

### Phase 4: Portion Direction v1

- camera capture
- simple portion guidance output

### Phase 5: Intelligence Upgrade

- replace mocked logic with real model or backend-assisted analysis
- improve explanation quality and personalization

## 15. Release Criteria For MVP

The MVP is ready for testing when:

- a new user can sign up and complete onboarding
- the user can enter `Menu Deciding` and capture an image
- the app returns a recommendation result
- the user can save a final decision
- the saved decision appears in history
- the user can use `Portion Direction` at a basic level
- core flows work on target test devices without blocking issues

## 16. Future Expansion

Future directions captured in ideation but not required for MVP:

- live specialist or dietitian guidance
- smart glasses pairing
- live continuous guidance
- deeper trend and pattern analysis
- adaptive recommendations over time
- richer medical or dietary personalization
