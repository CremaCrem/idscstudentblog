# Design System

---

# Purpose

This document defines the visual language of **IDSC Pulse – Infotech Development Systems College, Ligao City, Albay**.

It is the single source of truth for:

- Color palette
- Typography
- Spacing
- Layout
- Elevation
- Borders
- Components
- Responsive behavior
- Motion
- Tailwind implementation rules

Every UI component must follow this design system.

Do not invent new colors, spacing, typography, or component styles unless explicitly requested.

---

# Implementation Standard

The project uses:

- Tailwind CSS ONLY

Component-specific CSS files are prohibited.

The AI must NOT create:

- .css
- .module.css
- .scss
- styled-components
- Emotion
- Bootstrap styling

unless explicitly instructed.

Global CSS is limited to:

- Tailwind imports
- CSS variables
- Font declarations
- Browser reset

---

# Design Philosophy

The application should feel like a modern editorial publication.

Visual characteristics:

- Warm
- Minimal
- Elegant
- Calm
- Spacious
- Readable
- Professional

Inspired by:

- Medium
- Linear
- Notion
- Vercel
- Apple
- Essos

Every page should prioritize readability over decoration.

Whitespace is a feature.

---

# Color System

## Canvas

Purpose

Entire application background (Soft off-white leaning clean white).

Tailwind

```
bg-stone-50
```

Hex

```
#FAF9F5
```

---

## Surface

Purpose

Cards

Panels

Containers

Forms

Tailwind

```
bg-white
```

Hex

```
#FFFFFF
```

---

## Primary Text

Tailwind

```
text-zinc-900
```

Hex

```
#18181B
```

---

## Secondary Text

Tailwind

```
text-zinc-600
```

Hex

```
#52525B
```

---

## Borders

Tailwind

```
border-zinc-200
```

Hex

```
#E4E4E7
```

---

## Primary Accent (IDSC Emerald)

Purpose

Primary buttons

Links

Highlights

IDSC Brand Alignment

Tailwind

```
bg-emerald-800
hover:bg-emerald-900
```

Approximate Hex

```
#065F46
```

---

## Success

```
bg-emerald-600
```

---

## Warning

```
bg-amber-600
```

---

## Error

```
bg-red-600
```

---

# Typography

Primary Font

Inter

Fallback

System UI

Font weights

```
Regular
Medium
Semibold
Bold
```

---

# Typography Scale

Display

```
text-5xl
font-bold
tracking-tight
```

Hero

```
text-4xl
font-bold
```

Section Title

```
text-2xl
font-semibold
```

Card Title

```
text-xl
font-semibold
```

Body

```
text-base
leading-7
```

Small

```
text-sm
```

Caption

```
text-xs
uppercase
tracking-wide
```

---

# Border Radius

Small

```
rounded-md
```

Medium

```
rounded-xl
```

Large

```
rounded-2xl
```

Application Containers

```
rounded-3xl
```

Avoid sharp corners.

---

# Shadows

Cards

```
shadow-md
```

Feature Cards

```
shadow-lg
```

Floating Components

```
shadow-xl
```

Never use heavy shadows.

Shadows should be soft.

---

# Glassmorphism

Instead of CSS, implement using Tailwind utilities.

Standard Glass Card

```
bg-white/40

backdrop-blur-xl

border

border-white/30

shadow-lg
```

Never create CSS classes for glass effects.

---

# Spacing System

Base spacing

```
4px
```

Tailwind spacing scale

Use

```
p-2

p-4

p-6

p-8

gap-4

gap-6

gap-8

space-y-4

space-y-6

space-y-8
```

Never use arbitrary spacing values unless necessary.

---

# Layout Rules

Application Width

```
max-w-7xl
mx-auto
```

Standard Page Padding

```
px-6

lg:px-10
```

Section Spacing

```
py-12

lg:py-20
```

Cards should never touch screen edges.

---

# Buttons

Primary Button

Use

```
bg-emerald-800

hover:bg-emerald-900

text-white

rounded-xl

font-medium

transition-colors
```

Secondary Button

```
bg-white

border

border-zinc-300

hover:bg-zinc-50
```

Danger Button

```
bg-red-600

hover:bg-red-700

text-white
```

Buttons should never use gradients.

---

# Inputs

Standard

```
rounded-xl

border

border-zinc-300

bg-white

px-4

py-3

focus:ring-2

focus:ring-emerald-800

focus:border-emerald-800
```

---

# Cards

Editorial Card

```
rounded-2xl

bg-white

shadow-md

overflow-hidden
```

Hover

```
hover:-translate-y-1

hover:shadow-xl

transition-all
```

---

# Tags

Use

```
rounded-full

bg-stone-100

text-stone-700

px-3

py-1

text-sm

font-medium
```

Selected

```
bg-emerald-800

text-white
```

---

# Navigation

Navbar

```
sticky

top-0

backdrop-blur

bg-white/80

border-b
```

Navigation should remain minimal.

---

# Icons

Preferred Library

Lucide React

Icons should use

```
w-5

h-5
```

Avoid oversized icons.

---

# Animations

Allowed

Opacity

Translate

Scale

Shadow

Duration

```
duration-200

duration-300
```

Avoid:

- Bounce
- Spin
- Flashing
- Large transforms

Animations should support usability, not decoration.

---

# Responsive Design

Always build:

Mobile First

Breakpoints

```
sm

md

lg

xl

2xl
```

Never design desktop first.

---

# Accessibility

Every component must include:

- keyboard navigation
- visible focus states
- semantic HTML
- proper ARIA attributes where necessary

Color must never be the only indicator of state.

---

# Component Rules

Every component should:

Have one responsibility.

Be reusable.

Accept props instead of duplicated variants.

Avoid excessive nesting.

---

# Confirmation Modal Rule

The application **must not** use `window.confirm()`, `window.prompt()`, or `window.alert()`.

All user confirmations and destructive action flows must use the reusable `<ConfirmationModal />` component.

See `design/interaction-patterns.md` Section 4 for the full specification.

This applies to:

- Approving student registrations
- Rejecting student registrations
- Deleting user accounts
- Deleting blog posts
- Unpublishing content
- All future irreversible or state-altering actions

Native browser dialogs are a design system violation.

---

# Pre-Submission Review & Modal Anti-Stacking Rule

1. **Separation of Concerns:** Action confirmations (`<ConfirmationModal />`) must be separated from pre-submission data review (`<FormReviewModal />` or in-modal wizard).
2. **No Stacked Modals:** Modals must **never** stack on top of other modals (`z-index` stacking, multiple backdrops). If a form is inside a modal (e.g., `SubmitModal`), pre-submission review must occur via an internal step transition within that same modal shell.
3. **Sensitive Field Masking:** Password inputs must be masked (`••••••••`) in all review screens.

See `design/interaction-patterns.md` Section 6 for full specification.

# AI Compliance Checklist

Before completing any UI implementation verify:

✓ Tailwind CSS only

✓ No CSS Modules

✓ No component CSS files

✓ Uses project color tokens

✓ Uses project typography

✓ Responsive

✓ Accessible

✓ Reusable

✓ Matches documented layouts

✓ No `window.confirm()`, `window.prompt()`, or `window.alert()` — uses `<ConfirmationModal />` instead

✓ No stacked/nested modals — uses `<FormReviewModal />` for page forms and 2-step wizard for modal forms

If any rule is violated:

STOP

Report the violation instead of generating code.

---

# Guiding Principle

The interface should feel like software built by a professional product team.

Every screen should communicate:

clarity

simplicity

consistency

quality

When uncertain, prefer the simpler interface.