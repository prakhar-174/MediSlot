# MediSlot — UI Design System
## Implementation-Ready Component Guidelines

---

## 1. Context and Goals

MediSlot is a role-based patient appointment booking platform serving two distinct user types — patients and doctors/admins. The design system exists to ensure every interface component is consistent, accessible, and fast to implement across all surfaces: the patient booking flow, the doctor dashboard, and shared authentication screens.

**Design intent in one sentence:** Create a clean, trust-building medical interface where hierarchy is immediately clear, role-specific actions are unambiguous, and every interaction state is explicitly defined.

**Known page density (from audit):**
- Links: 116
- Buttons: 63
- Cards: 45
- Lists: 11
- Navigation: 3
- Inputs: 1

This density means component consistency is non-negotiable — one-off exceptions will compound visually across 63+ button instances.

---

## 2. Design Tokens and Foundations

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `font.family.primary` | `Figtree` | All UI text |
| `font.family.stack` | `Figtree, sans-serif` | CSS font-family declaration |
| `font.size.base` | `16px` | Body copy, default |
| `font.weight.base` | `400` | Regular text |
| `font.lineHeight.base` | `24px` | Body line height |
| `font.size.xs` | `13px` | Labels, badges, helper text |
| `font.size.sm` | `16px` | Body, secondary content |
| `font.size.md` | `18px` | Sub-headings, card titles |
| `font.size.lg` | `24px` | Section headings |
| `font.size.xl` | `30px` | Page headings |
| `font.size.2xl` | `48px` | Hero text |
| `font.size.3xl` | `60px` | Display / marketing only |

**MediSlot-specific typography rules:**
- Patient-facing headings use `font.size.xl` (30px) at `font.weight.base` (400) — keep them calm, not aggressive.
- Doctor dashboard headings use `font.size.lg` (24px) at weight 600 — denser information context warrants heavier hierarchy.
- Status labels (Pending, Approved, Rejected) must always use `font.size.xs` (13px) with weight 600 — they carry critical clinical meaning and must be legible at a glance.
- Never use `font.size.3xl` (60px) outside the marketing landing page hero.

---

### Color Palette

| Token | Value | Usage in MediSlot |
|-------|-------|-------------------|
| `color.text.primary` | `#0a0a0a` | All primary UI text |
| `color.text.secondary` | `#ffffff` | Text on dark/filled surfaces |
| `color.text.tertiary` | `#6e6d6d` | Helper text, placeholders, secondary labels |
| `color.text.inverse` | `#666977` | Muted text on light backgrounds |
| `color.surface.base` | `#000000` | Navigation bar, full-bleed hero sections |
| `color.surface.strong` | `#f8f7f7` | Page background, card backgrounds |

**Semantic color extensions (must be defined in your token system):**

| Token | Recommended Hex | Usage |
|-------|----------------|-------|
| `color.status.pending` | `#d97706` | Pending appointment badge |
| `color.status.approved` | `#059669` | Approved appointment badge |
| `color.status.rejected` | `#dc2626` | Rejected appointment badge |
| `color.status.completed` | `#6e6d6d` (= `color.text.tertiary`) | Completed appointment badge |
| `color.status.cancelled` | `#6e6d6d` | Cancelled appointment badge |
| `color.role.patient` | derived from brand | Patient-scoped UI accents |
| `color.role.doctor` | derived from brand | Doctor-scoped UI accents |

> **Rule:** Status colors must never be used for decoration. Reserve `color.status.*` tokens exclusively for appointment status indicators.

---

### Spacing Scale

| Token | Value | Common Usage |
|-------|-------|-------------|
| `space.1` | `1px` | Divider lines, borders |
| `space.2` | `4px` | Icon-to-label gap, tight inline spacing |
| `space.3` | `10px` | Input internal padding (vertical) |
| `space.4` | `12px` | Button padding (vertical), card internal spacing |
| `space.5` | `18px` | Section gaps, form field gaps |
| `space.6` | `22px` | Card padding |
| `space.7` | `23.2px` | Navigation height offset |
| `space.8` | `24px` | Layout column gaps, section padding |

**MediSlot spacing conventions:**
- All form fields must use `space.3` (10px) vertical padding internally.
- All card components must use `space.6` (22px) internal padding.
- Dashboard stat cards must use `space.8` (24px) padding.
- Consistent `space.5` (18px) gap between stacked form fields.

---

### Radius, Shadow, and Motion

**Border Radius:**

| Token | Value | Usage |
|-------|-------|-------|
| `radius.xs` | `8px` | Input fields, small badges |
| `radius.sm` | `12px` | Buttons, secondary cards |
| `radius.md` | `16px` | Primary cards (appointment cards, doctor cards) |
| `radius.lg` | `32px` | Dashboard stat cards, feature highlights |
| `radius.xl` | `40px` | Hero containers, modal wrappers |
| `radius.2xl` | `10000000px` | Pill badges (status labels) |

**Shadows:**

| Token | Value | Usage |
|-------|-------|-------|
| `shadow.1` | `rgba(236,236,236,0.06) 0px 5.376px 5.376px 0px, rgba(165,165,165,0.06) 0px 1.344px 1.344px 0px` | Default card elevation |
| `shadow.2` | `rgba(25,33,61,0.1) 0px 1px 3.008px 0px` | Input focus ring elevation |
| `shadow.3` | `color(srgb 0.0392157 0.0392157 0.0392157 / 0.1) 0px 2px 4px 0px` | Button hover elevation |
| `shadow.4` | `rgba(25,33,61,0.1) 0px 2px 4px 0px` | Modal / drawer elevation |

**Motion:**

| Token | Value | Usage |
|-------|-------|-------|
| `motion.duration.instant` | `300ms` | Hover state transitions, focus rings, status badge transitions |
| `motion.duration.fast` | `800ms` | Page transitions, modal open/close, slide-in panels |

> **Rule:** All interactive state transitions (hover, focus, active) must use `motion.duration.instant` (300ms). Page-level transitions use `motion.duration.fast` (800ms). No custom durations.

---

## 3. Component-Level Rules

### 3.1 Buttons

**Design intent:** Buttons are the primary action drivers. With 63 instances across the platform, visual consistency is critical. Buttons must communicate role-appropriate actions clearly.

#### Anatomy
```
[ Icon? ] [ Label ] [ Loading spinner? ]
    ↑ optional      ↑ optional
```
- Minimum width: 80px
- Height: 44px (touch target compliance)
- Padding: `space.4` (12px) vertical, `space.8` (24px) horizontal
- Border radius: `radius.sm` (12px) for standard buttons; `radius.2xl` for pill variants
- Font: `font.size.sm` (16px), weight 600
- Icon size: 20px, gap to label: `space.2` (4px)

#### Variants

| Variant | Surface | Text | Usage in MediSlot |
|---------|---------|------|-------------------|
| **Primary** | `color.surface.base` (#000) | `color.text.secondary` (#fff) | Book Appointment, Approve, Save |
| **Secondary** | `color.surface.strong` (#f8f7f7) | `color.text.primary` (#0a0a0a) | Cancel, Back, View History |
| **Destructive** | `color.status.rejected` | `color.text.secondary` | Reject Appointment, Delete Slot |
| **Ghost** | Transparent | `color.text.primary` | Inline actions, table row actions |
| **Link** | Transparent | `color.text.primary` with underline | Navigation-style actions |

#### States

| State | Visual Behavior |
|-------|----------------|
| **Default** | Base variant styles as above |
| **Hover** | `shadow.3` applied; background lightens by 8% (primary) or darkens by 4% (secondary); transition `motion.duration.instant` |
| **Focus-visible** | 2px solid outline, offset 2px, color `color.text.primary`; `shadow.2` applied; transition `motion.duration.instant` |
| **Active** | Scale transform `0.98`; shadow removed |
| **Disabled** | Opacity `0.4`; `cursor: not-allowed`; no hover/focus effects |
| **Loading** | Label hidden; spinner (20px) centered; `cursor: wait`; pointer events disabled |
| **Error** | Not applicable to buttons directly — use destructive variant for error-state actions |

#### Responsive Behavior
- On mobile (< 640px): full-width buttons in forms and modals.
- In table rows (doctor schedule view): ghost variant only, 36px height minimum.
- Approve / Reject buttons in the doctor dashboard must always appear as a paired group — Approve (primary) left, Reject (destructive) right — never individually placed.

#### Keyboard Behavior
- `Tab` / `Shift+Tab`: focusable in DOM order.
- `Enter` / `Space`: activates button.
- `Escape`: dismisses loading state if applicable.

#### Touch Behavior
- Minimum touch target: 44×44px (iOS/Android compliance).
- No hover state on touch — active state fires on `touchstart`.

#### MediSlot-specific rules
- The "Book Appointment" button must always be primary variant, full-width within its container on mobile.
- "Approve" must always use the primary variant (never green — semantic color is conveyed by the status badge, not the button).
- "Reject" must always use the destructive variant.
- Never use a ghost button as the sole action in a modal — pair it with a primary button.

---

### 3.2 Cards

**Design intent:** Cards are the primary container for doctor listings (45 instances) and appointment records. They must scale cleanly from a 3-column desktop grid to a single-column mobile stack.

#### Anatomy
```
┌─────────────────────────────────────┐
│  [ Avatar / Icon ]  [ Status badge ]│  ← Header
│  [ Primary title ]                  │
│  [ Secondary text ]                 │  ← Body
│  [ Meta: date, time, category ]     │
│─────────────────────────────────────│  ← Divider (space.1)
│  [ Primary action ]  [ Ghost action]│  ← Footer
└─────────────────────────────────────┘
```

- Background: `color.surface.strong` (#f8f7f7)
- Border radius: `radius.md` (16px)
- Shadow: `shadow.1`
- Padding: `space.6` (22px)
- Border: `space.1` (1px) solid, color `color.text.tertiary` at 20% opacity

#### Card Types in MediSlot

**Doctor Card (Browse Doctors page)**
- Avatar: 48×48px, `radius.2xl` (pill/circle)
- Primary title: Doctor name, `font.size.md` (18px), weight 600
- Secondary: Specialization, `font.size.sm` (16px), `color.text.tertiary`
- Meta row: Available days, `font.size.xs` (13px)
- Footer: Single "Book Appointment" button (primary, full-width on mobile)

**Appointment Card (Patient History / Doctor Schedule)**
- Status badge: top-right, `radius.2xl`, `font.size.xs`, `color.status.*` token
- Primary title: Doctor/Patient name
- Meta row: Date + time slot, visit reason (truncated at 60 chars with ellipsis)
- Footer: Context-dependent actions (Cancel for patient; Approve/Reject for doctor)

**Stat Card (Doctor Dashboard)**
- Single large number: `font.size.2xl` (48px), weight 700
- Label below: `font.size.sm` (16px), `color.text.tertiary`
- Border radius: `radius.lg` (32px)
- No footer/actions

#### States

| State | Visual Behavior |
|-------|----------------|
| **Default** | `shadow.1`; `color.surface.strong` background |
| **Hover** | `shadow.3`; slight upward translate (`transform: translateY(-2px)`); `motion.duration.instant` |
| **Focus-visible** | 2px outline on card container if card is fully interactive; individual child controls otherwise |
| **Active** | No animation — action handled by child button/link |
| **Disabled** | Opacity `0.5`; no hover effect; used for unavailable doctor slots |
| **Loading** | Skeleton shimmer on title, meta, and footer areas; background `color.surface.strong` |
| **Error** | Border `1px solid color.status.rejected`; error message below card |
| **Empty state** | Card replaced by empty-state component (see section 3.7) |

#### Responsive Behavior
- Desktop (≥1024px): 3-column grid with `space.8` (24px) gap.
- Tablet (640–1023px): 2-column grid.
- Mobile (<640px): Single column, full-width.
- Long doctor names: truncate at 2 lines with `line-clamp: 2`. Never let text overflow the card boundary.
- Cards with no available slots must display a "No slots available" sub-label in `color.text.tertiary` and disable the "Book Appointment" button (disabled state).

---

### 3.3 Form Inputs

**Design intent:** Only 1 input component is in the current audit, but every auth screen, booking form, and slot management form depends on it. Get this right.

#### Anatomy
```
[ Label ]                     ← font.size.sm, weight 500
[ Input field                ]  ← height 44px, radius.xs
[ Helper text / Error message]  ← font.size.xs, color.text.tertiary / color.status.rejected
```

- Height: 44px
- Border radius: `radius.xs` (8px)
- Border: `space.1` (1px) solid `color.text.tertiary` at 40%
- Padding: `space.8` (24px) horizontal, `space.3` (10px) vertical
- Font: `font.size.sm` (16px), `color.text.primary`
- Placeholder: `color.text.tertiary`

#### States

| State | Border | Background | Behavior |
|-------|--------|-----------|---------|
| **Default** | `color.text.tertiary` 40% | `color.surface.strong` | — |
| **Hover** | `color.text.tertiary` 80% | — | `motion.duration.instant` |
| **Focus-visible** | `color.text.primary` 100%, 2px | `color.surface.strong` | `shadow.2` applied |
| **Active** | Same as focus-visible | — | — |
| **Disabled** | `color.text.tertiary` 20% | `color.surface.strong` at 50% opacity | `cursor: not-allowed`; `user-select: none` |
| **Loading** | — | Shimmer skeleton | Pointer events disabled |
| **Error** | `color.status.rejected` 100%, 2px | `color.surface.strong` | Error message shown below; `aria-invalid="true"` set |

#### MediSlot-specific input rules
- Date/time inputs in the booking form must use native `<input type="date">` and `<input type="time">` — no custom pickers unless the native element fails accessibility requirements.
- The "Visit reason" textarea must cap at 300 characters with a visible live counter (`font.size.xs`, `color.text.tertiary`).
- All inputs must have an associated `<label>` — never use `placeholder` as the only label.
- Password inputs must include a show/hide toggle button (ghost, 20px eye icon) aligned to the right inner edge.

---

### 3.4 Navigation

**Design intent:** Three navigation contexts exist — the public marketing nav, the authenticated patient nav, and the authenticated doctor/admin nav. Role clarity is non-negotiable.

#### Anatomy
```
[ Logo ]  [ Nav links ]  [ Role indicator ]  [ CTA / Avatar ]
```

- Height: `space.7` × 3 (≈ 70px) on desktop; 56px on mobile
- Background: `color.surface.base` (#000000)
- Text: `color.text.secondary` (#ffffff)
- Border-bottom: `space.1` (1px) solid white at 10% opacity
- Logo: `font.size.lg` (24px), weight 700

#### Variants

**Public Nav** (landing page, login, register)
- Links: Home, Features, About
- CTA: "Sign in" (ghost, white border) + "Get started" (primary, white fill)

**Patient Nav** (authenticated patient)
- Links: Find Doctors, My Appointments, Profile
- Avatar: 32×32px circle with initials fallback

**Doctor/Admin Nav** (authenticated doctor)
- Links: My Schedule, Appointment Requests, Manage Slots, Dashboard
- Role badge: "Doctor" pill badge next to avatar, `color.status.approved` background

#### States

| State | Visual Behavior |
|-------|----------------|
| **Default** | As above |
| **Hover (link)** | Text opacity increases to 100%; 2px underline with `motion.duration.instant` |
| **Focus-visible (link)** | 2px solid white outline, 2px offset |
| **Active (current page)** | Underline persists; font weight 600 |
| **Mobile (hamburger)** | Hamburger icon (24px); clicking opens full-screen overlay nav |

#### Keyboard Behavior
- `Tab`: Move through nav links and CTA in order.
- `Enter` / `Space`: Activate link or button.
- `Escape`: Close mobile nav overlay.
- Landmark: Nav must be wrapped in `<nav aria-label="Main navigation">`.

#### Responsive Behavior
- Mobile (<768px): All nav links collapse into a hamburger menu. Logo and CTA remain visible.
- The mobile overlay must trap focus until closed.

---

### 3.5 Status Badges

**Design intent:** The appointment status flow (Pending → Approved → Rejected / Completed / Cancelled) is the core data of MediSlot. Badges must be instantly distinguishable.

#### Anatomy
```
[ Icon ] [ Label ]
```
- Border radius: `radius.2xl` (pill)
- Padding: `space.2` (4px) vertical, `space.4` (12px) horizontal
- Font: `font.size.xs` (13px), weight 600, uppercase tracking
- Icon: 14px, aligned left

| Status | Background | Text | Icon |
|--------|-----------|------|------|
| Pending | `color.status.pending` at 12% | `color.status.pending` | clock |
| Approved | `color.status.approved` at 12% | `color.status.approved` | check-circle |
| Rejected | `color.status.rejected` at 12% | `color.status.rejected` | x-circle |
| Completed | `color.text.tertiary` at 12% | `color.text.tertiary` | check |
| Cancelled | `color.text.tertiary` at 12% | `color.text.tertiary` | minus-circle |

#### States
- Status badges are **non-interactive** in the patient view — no hover, no click.
- In the doctor's appointment list, badges are **non-interactive** — status is changed via the Approve / Reject buttons, not by clicking the badge.
- Transition between statuses uses `motion.duration.instant` (300ms) fade.

---

### 3.6 Lists

**Design intent:** 11 list instances, primarily used for appointment history (patient), daily schedule (doctor), and slot management.

#### Appointment List Row Anatomy
```
[ Status badge ]  [ Doctor/Patient name ]  [ Date · Time ]  [ Actions ]
```
- Row height: 64px minimum
- Divider: `space.1` (1px) solid `color.text.tertiary` at 15%
- Hover: `color.surface.strong` background on row; `motion.duration.instant`
- Padding: `space.5` (18px) vertical, `space.6` (22px) horizontal

#### States

| State | Visual Behavior |
|-------|----------------|
| **Default** | White/surface background, no decoration |
| **Hover** | `color.surface.strong` row background |
| **Focus-visible** | 2px inset outline on row |
| **Active** | Used only if the row itself is clickable (links to detail page) |
| **Disabled** | Opacity 0.5; row is not a completed appointment in context |
| **Loading** | Skeleton rows (3 placeholder rows) |
| **Error** | Error message replaces list content |
| **Empty** | Empty state component (see 3.7) |

#### Responsive Behavior
- Mobile: Date and time stack below the name; actions move to a `⋯` overflow menu.
- Long patient/doctor names: single-line truncation with ellipsis at 200px max-width.

---

### 3.7 Empty States

Required for: appointment history (no bookings), doctor listing (no results), slot management (no slots defined), daily schedule (no appointments today).

#### Anatomy
```
[ Illustration / Icon ]
[ Heading ]
[ Sub-text ]
[ CTA Button (optional) ]
```

- Icon: 48px, `color.text.tertiary`
- Heading: `font.size.md` (18px), weight 600
- Sub-text: `font.size.sm` (16px), `color.text.tertiary`
- CTA: Primary button if an action resolves the empty state

| Context | Heading | Sub-text | CTA |
|---------|---------|----------|-----|
| No appointments (patient) | "No appointments yet" | "Browse available doctors to book your first appointment." | "Find a Doctor" |
| No results (search) | "No doctors found" | "Try a different name or specialization." | — |
| No slots (doctor) | "No slots configured" | "Add your availability so patients can book with you." | "Add Slots" |
| No appointments today (doctor) | "Clear schedule today" | "No appointments are booked for today." | — |

---

## 4. Accessibility Requirements

### WCAG 2.2 AA Compliance — Testable Acceptance Criteria

#### Contrast

- `color.text.primary` (#0a0a0a) on `color.surface.strong` (#f8f7f7): **passes** at 18.7:1.
- `color.text.secondary` (#ffffff) on `color.surface.base` (#000000): **passes** at 21:1.
- `color.text.tertiary` (#6e6d6d) on `color.surface.strong` (#f8f7f7): **must be verified** — this combination approaches the 4.5:1 threshold. Only use `color.text.tertiary` for non-essential helper text, never for required labels or status text.
- Status badge text must achieve minimum 4.5:1 against its pill background. Verify each `color.status.*` token against its 12% opacity background.

**Pass/Fail check:** Use a contrast checker against actual rendered colors (the 12% opacity backgrounds produce real hex values — test those, not the raw tokens).

#### Keyboard Navigation

- Every interactive element must be reachable via `Tab` in logical DOM order.
- Focus must never be trapped outside of intentional trapping contexts (modals, mobile nav overlay).
- `focus-visible` must produce a 2px solid outline on all interactive elements. `outline: none` is **prohibited** without a custom focus style replacement.
- The booking flow steps must be navigable end-to-end with keyboard alone — no step should require a pointer.

**Pass/Fail check:** Navigate the entire booking flow (login → find doctor → select slot → confirm) using keyboard only. Every action must be completable.

#### Screen Reader

- All images and icons must have `alt` text or `aria-label`. Decorative icons get `aria-hidden="true"`.
- Status badges must use `role="status"` or be wrapped in an `aria-live="polite"` region so status changes are announced.
- The appointment status change (when a doctor approves) must trigger an `aria-live` announcement.
- Form inputs must have programmatically associated labels (`for` / `id` pairing or `aria-labelledby`).
- Error messages must be associated with their input via `aria-describedby`.
- Modals must use `role="dialog"` with `aria-modal="true"` and `aria-labelledby` pointing to the modal heading.

**Pass/Fail check:** Navigate appointment history with a screen reader. Every status badge must be announced with its text label.

#### Touch and Pointer

- Minimum touch target: 44×44px for all interactive elements.
- Appointment action buttons (Approve / Reject) in doctor dashboard must maintain 44px height even in dense list views.

---

## 5. Content and Tone Standards

**Voice:** Calm, clinical confidence. MediSlot is a medical-adjacent product — language must be precise and reassuring, never casual or salesy.

### Approved Patterns

| Context | Use | Avoid |
|---------|-----|-------|
| Empty booking state | "No appointments yet" | "You haven't booked anything!" |
| Confirmation message | "Appointment request sent" | "Woohoo! You're booked!" |
| Approval action label | "Approve" | "Accept", "Confirm", "Yes" |
| Rejection action label | "Reject" | "Decline", "No", "Cancel" |
| Doctor availability | "Available Mon, Wed, Fri" | "Free on some days" |
| Error message | "This time slot is no longer available. Please choose another." | "Oops! Something went wrong." |
| Loading state | "Loading appointments…" | "Hang tight!" |
| Success toast | "Appointment confirmed for [date] at [time]." | "Done!" |

### Labels and Action Standards

- Buttons must describe the action, not the object: "Book Appointment" not "Submit".
- Destructive actions (Reject, Cancel) must be clearly labeled — never use neutral labels like "OK" for a destructive action.
- Status labels must be nouns (Pending, Approved, Rejected), not verbs.
- Doctor specializations must be title-cased: "General Physician", "Cardiologist".
- Dates must follow the format: "Mon, 29 May 2026" — never "05/29/26" or "29/5".
- Times must follow 12-hour format with AM/PM: "10:30 AM" — never "10:30".

---

## 6. Anti-Patterns and Prohibited Implementations

### Prohibited

- **Never** use `color.status.*` tokens for decoration, category labels, or anything outside appointment status.
- **Never** use `outline: none` without a custom `focus-visible` replacement.
- **Never** place placeholder text as the only label for a form input.
- **Never** render the Approve and Reject buttons in different visual weight — they must be distinguishable only by variant (primary vs destructive), not by size or position asymmetry.
- **Never** hardcode spacing values outside the `space.*` token scale.
- **Never** use `font.size.3xl` (60px) on any authenticated page (patient or doctor) — marketing only.
- **Never** use the status badge colors (green, red, amber) on buttons — buttons use primary/secondary/destructive, not semantic status colors.
- **Never** use `motion.duration.fast` (800ms) for hover or focus transitions — reserve it for page-level events only.

### Common Mistakes to Avoid

- Making "Cancel Appointment" look like "Reject Appointment" — they are different actions for different roles (patient cancels, doctor rejects).
- Placing the doctor role badge and the patient avatar in the same nav location without role differentiation.
- Using a card hover effect on non-interactive stat cards in the dashboard.
- Truncating the visit reason field without a tooltip or expand affordance.
- Showing the Approve / Reject buttons to patients (role-based rendering must be enforced at both frontend and backend).

---

## 7. QA Checklist

Use this before marking any component or page as ready for review.

### Typography
- [ ] All text uses `font.family.primary` (Figtree)
- [ ] No font sizes outside the defined scale are used
- [ ] `font.size.3xl` only appears on marketing landing page
- [ ] Status badge labels use `font.size.xs` (13px) weight 600

### Color
- [ ] No hardcoded hex values — only semantic tokens referenced
- [ ] `color.status.*` tokens are only used on status badges
- [ ] `color.text.tertiary` is not used for required labels
- [ ] Contrast ratios verified for all text/background combinations

### Spacing
- [ ] All padding/margin values use `space.*` tokens
- [ ] No one-off spacing exceptions
- [ ] Card padding uses `space.6` (22px)
- [ ] Form field gap uses `space.5` (18px)

### Interaction States
- [ ] Every button has all 7 states defined (default, hover, focus-visible, active, disabled, loading, error)
- [ ] Every input has all 7 states defined
- [ ] Every card has all 7 states defined
- [ ] No `outline: none` without focus replacement

### Accessibility
- [ ] All interactive elements reachable via keyboard
- [ ] `focus-visible` 2px outline present on all interactive elements
- [ ] All images and icons have `alt` / `aria-label` / `aria-hidden`
- [ ] Status badges use `role="status"` or `aria-live`
- [ ] All form inputs have programmatically associated labels
- [ ] Error messages linked via `aria-describedby`
- [ ] Modals use `role="dialog"` + `aria-modal` + `aria-labelledby`
- [ ] Minimum 44×44px touch targets on all interactive elements
- [ ] Full booking flow completable by keyboard alone

### Role-Based Rendering
- [ ] Approve / Reject actions only visible to Doctor / Admin role
- [ ] Cancel action only visible to Patient role
- [ ] Doctor nav links not shown to patients (and vice versa)
- [ ] Role badge visible in Doctor nav

### Content
- [ ] No "Oops!" or casual error messaging
- [ ] Dates formatted as "Mon, 29 May 2026"
- [ ] Times formatted as "10:30 AM"
- [ ] Approve / Reject buttons labeled exactly as specified
- [ ] All empty states have heading, sub-text, and CTA where applicable

### Motion
- [ ] Hover/focus transitions use `motion.duration.instant` (300ms)
- [ ] Page/modal transitions use `motion.duration.fast` (800ms)
- [ ] No custom transition durations used

---

*MediSlot Design System v1.0 — Authored for Assessment submission. All rules are implementation-ready and token-driven.*