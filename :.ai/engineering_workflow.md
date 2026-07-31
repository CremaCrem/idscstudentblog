# Engineering Workflow
Version: 1.0

---

# Purpose

This document defines the engineering workflow for the Student Blog Showcase Hub.

Unlike the AI Constitution, which defines immutable rules, this document defines the process the AI must follow while developing the application.

Every task should follow this workflow unless the user explicitly instructs otherwise.

---

# Core Philosophy

The project values:

- Simplicity
- Predictability
- Maintainability
- Small iterations
- Documentation-first development
- Minimal code changes
- Production-quality code

Never generate code simply because it "might help."

Every change must have a clear reason.

---

# Development Lifecycle

Every feature follows seven stages.

## Stage 1 — Understand

Before writing code:

Read the relevant documentation.

Determine:

- Why this feature exists
- Which module owns it
- Which existing components are affected
- Which APIs are required
- Which database models are involved

If requirements are unclear:

STOP

Ask questions.

Never guess.

---

## Stage 2 — Planning

Before implementation:

Produce a short implementation plan.

Include:

Affected files

Dependencies

Potential risks

Architectural impact

If the change affects multiple modules, explain why.

---

## Stage 3 — Implementation

Only after planning.

Implementation rules:

- Write production-ready code.
- Never leave TODO comments.
- Never generate placeholder code.
- Keep functions small.
- Keep components focused.
- Reuse existing utilities whenever possible.

Avoid duplicate logic.

---

## Stage 4 — Verification

After implementation:

Verify:

Backend

- Routes
- Controllers
- Services
- Models

Frontend

- Components
- State
- API calls
- Routing

Then explain:

How to manually test.

Expected result.

---

## Stage 5 — Architecture Review

Review your own work.

Confirm:

- Project architecture still followed.
- No unnecessary abstractions.
- No duplicate code.
- No unnecessary files.
- No architectural drift.

---

## Stage 6 — Documentation

If implementation changes:

- API
- Database
- Components
- User flows
- Requirements

Update documentation.

Documentation is always part of implementation.

---

## Stage 7 — Summary

Provide:

Files created

Files modified

Files deleted

Breaking changes

Testing steps

Architecture impact

---

# Feature Workflow

For new features:

Read documentation.

↓

Explain implementation plan.

↓

Implement.

↓

Verify.

↓

Update documentation.

↓

Summarize.

Never skip planning.

---

# Bug Workflow

When debugging:

DO NOT immediately fix.

Instead:

## Step 1

Understand symptoms.

## Step 2

List possible causes.

Rank them from most likely to least likely.

## Step 3

Determine which files should be inspected.

Do NOT edit code.

## Step 4

Identify root cause.

Only after confirmation may implementation begin.

## Step 5

Implement the smallest possible fix.

## Step 6

Verify.

## Step 7

Review for unintended side effects.

---

# Refactoring Workflow

Refactoring requires explicit approval.

If approved:

1.

Explain why refactoring is needed.

2.

Describe expected benefits.

3.

Estimate affected files.

4.

Implement incrementally.

5.

Verify functionality.

Do not combine feature work with refactoring.

---

# Migration Workflow

Examples:

- Tailwind migration
- Database migration
- API version migration

Always:

Audit first.

↓

Produce migration plan.

↓

Wait for approval.

↓

Implement in phases.

↓

Verify each phase.

Never migrate the entire project in one response.

---

# Code Review Workflow

When reviewing code:

Look for:

Correctness

Architecture

Security

Performance

Readability

Maintainability

Duplication

Consistency

Do not rewrite code unless requested.

Provide recommendations first.

---

# UI Development Workflow

Every UI component should be developed in this order.

Layout

↓

Structure

↓

Responsiveness

↓

Accessibility

↓

Loading states

↓

Error states

↓

Animations

↓

Polish

Never start with animations.

---

# Backend Workflow

For every API endpoint:

Route

↓

Validation

↓

Controller

↓

Service

↓

Database

↓

Response

Never access the database directly from controllers.

---

# Database Workflow

Every schema should include:

Validation

Indexes

References

Defaults

Timestamps

Never create unnecessary collections.

---

# Documentation Workflow

Whenever architecture changes:

Update:

Requirements

Architecture

Database

API Contract

Component Library

User Flows

Project Index

Decisions

Documentation should evolve with the project.

---

# Commit Workflow

Each completed task should represent one logical commit.

Good examples:

feat(auth): implement JWT authentication

feat(tags): add autocomplete endpoint

fix(auth): resolve login token validation

refactor(feed): simplify filtering hook

docs(api): update authentication endpoints

Avoid combining unrelated work into one commit.

---

# Self-Verification Checklist

Before finishing any task:

✓ Documentation followed

✓ Architecture preserved

✓ Tailwind CSS used

✓ No CSS Modules

✓ No unnecessary dependencies

✓ No duplicated logic

✓ Proper error handling

✓ Validation added

✓ Security considered

✓ Testing steps provided

✓ Documentation updated if necessary

Only after all checks pass should the task be considered complete.

---

# Guiding Principle

Always prefer:

Small changes over large rewrites.

Incremental improvements over massive refactors.

Consistency over cleverness.

Maintainability over short-term speed.

The best code is the simplest code that fully satisfies the documented requirements.

# TypeScript Rules

## Type Imports

Always use:

```ts
import type { User } from './types';
```

or

```ts
import { type User } from './types';
```

Never import interfaces or type aliases as runtime imports.

This applies to:

- interface
- type
- Props
- Response DTOs
- API payloads

Reason:

The project uses Vite + ESM where TypeScript types are erased during compilation.

Using runtime imports for interfaces causes runtime module loading errors.