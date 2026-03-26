# Nuvue MVP Build Plan

Last updated: 2026-03-26

## 1. Goal

Build the Nuvue MVP in a sequence that validates the core product loop early while keeping implementation risk manageable.

The strongest loop to validate is:

1. user profile setup
2. camera-based guidance
3. recommendation result
4. saved decision
5. history review

## 2. Build Principles

- ship the narrowest testable loop first
- use mocked intelligence before integrating a heavier backend
- keep each milestone demoable
- prioritize user understanding over feature count

## 3. Milestone Plan

### Milestone 1: Product Foundation

#### Goal

Set up the app structure needed for the MVP.

#### Deliverables

- route structure cleaned up from starter template
- shared layout and navigation
- basic design system tokens
- placeholder screens for main flows

#### Exit criteria

- all planned MVP screens exist as navigable placeholders

### Milestone 2: Auth and Onboarding

#### Goal

Get a new user into a personalized app state.

#### Deliverables

- welcome screen
- sign in screen
- sign up screen
- onboarding form
- local or backend profile persistence

#### Exit criteria

- a new user can enter the app and land on the main page after onboarding

### Milestone 3: Main Page

#### Goal

Create the home hub that introduces the three main modes.

#### Deliverables

- main page UI
- module entry points for:
  - Menu Deciding
  - Portion Direction
  - My History

#### Exit criteria

- user can navigate from the home page into each primary module

### Milestone 4: Menu Deciding v1

#### Goal

Deliver the strongest MVP loop first.

#### Deliverables

- camera permission flow
- camera preview screen
- capture action
- mocked analysis service
- result screen with recommendation summary and tags

#### Exit criteria

- user can capture a menu or option image and receive a recommendation result

### Milestone 5: Save Decision + History v1

#### Goal

Close the loop and make the app retain value beyond a single session.

#### Deliverables

- save final decision action
- history list screen
- history detail screen
- empty state for no saved decisions

#### Exit criteria

- user can save a decision and see it later in history

### Milestone 6: Portion Direction v1

#### Goal

Ship the second guidance mode after the first loop is working.

#### Deliverables

- portion camera flow
- mocked portion analysis
- portion result screen
- optional save into history

#### Exit criteria

- user can capture a food image and receive portion guidance

### Milestone 7: Error Handling + Polish

#### Goal

Make the MVP stable enough for real testing.

#### Deliverables

- permission denied states
- capture retry states
- analysis failure handling
- save failure recovery
- loading and empty states
- copy polish

#### Exit criteria

- all critical flows have a recovery path

### Milestone 8: Intelligence Upgrade

#### Goal

Replace mocked outputs with a real analysis pipeline.

#### Deliverables

- backend-connected recommendation service
- normalized result mapping
- confidence handling
- basic analytics instrumentation

#### Exit criteria

- real analysis responses work in the main flows

## 4. Recommended Sprint Order

If building in short cycles, use this order:

1. Sprint 1
   - Milestone 1
   - Milestone 2
2. Sprint 2
   - Milestone 3
   - Milestone 4
3. Sprint 3
   - Milestone 5
   - Milestone 6
4. Sprint 4
   - Milestone 7
   - Milestone 8 if ready

## 5. Suggested Roles

### Product

- finalize scope decisions
- approve recommendation framing
- define user testing questions

### Design

- refine onboarding flow
- define result card patterns
- create clear camera and error states

### Engineering

- implement routing and screen shell
- build shared camera flow
- define data types and storage
- integrate mocked then real analysis services

## 6. MVP Testing Plan

Test after Milestone 4 and again after Milestone 6.

Key questions:

- Do users understand what each mode is for?
- Is the camera flow easy to complete?
- Is the recommendation understandable?
- Does saving decisions feel useful?
- Is `Menu Deciding` clearly more valuable than `Portion Direction`, or not?

## 7. Risks To Watch

- onboarding may be too long
- recommendation quality may feel weak if outputs are too generic
- camera capture may feel awkward without good framing guidance
- history may feel unimportant if save flow is unclear
- trying to build real intelligence too early may slow product learning

## 8. Definition of MVP Ready

The MVP is ready for internal testing when:

- core screens are implemented
- onboarding works
- Menu Deciding works end to end
- user can save and review decisions
- Portion Direction works at a basic level
- error states are present for major failure paths

## 9. After MVP

Once the core loop is validated, the next likely expansions are:

- stronger personalization
- better nutrition tagging
- pattern insights in history
- specialist-assisted guidance
- wearable or smart-glasses exploration
