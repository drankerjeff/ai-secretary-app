# UI Component Visual Specification
## AI Secretary — Apple HIG Dark Theme

**Design System Version:** 1.1
**Last Updated:** 2026-05-12
**Theme:** Always-dark (OLED-optimized, Apple Human Interface Guidelines)
**Audience:** Developers implementing these components

### Changelog (v1.0 → v1.1)
- Alert `info` type corrected: was `bg-primary/10 border-primary/30 text-primary`; must now use `--info` (#64D2FF System Cyan) tokens
- `--overlay` token documented as the canonical value for modal backdrops
- Animation utility classes (`animate-fade-in`, `animate-slide-up`, `animate-scale-in`, `animate-slide-in-left`) mapped to specific components
- `--info` / `--info-foreground` color tokens added to design system token table
- Apple HIG compliance checklist added at end of document

---

## Design System Foundations (Quick Reference)

Before implementing any component, internalize these constraints:

- **Minimum interactive target:** 44×44pt (Apple HIG non-negotiable)
- **Base transition:** `duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]` — always apply this to interactive elements; do not use `ease-in-out` or `ease` as substitutes
- **Focus ring:** `outline outline-2 outline-offset-2 outline-ring` on `:focus-visible` — already set globally but components must not suppress it
- **No raw color values in components.** Every color must come from a design token (CSS variable via Tailwind class). No `#0A84FF`, `#64D2FF`, or any hex value hardcoded in JSX.
- **Typography:** Use the Apple HIG type scale classes (`text-caption2` through `text-largetitle`). Do not use raw `text-sm`, `text-base`, etc.
- **Spacing grid:** 4px base unit. All padding/margin/gap values must be multiples of 4px (Tailwind: `p-1`=4px, `p-2`=8px, `p-3`=12px, `p-4`=16px, etc.)
- **Font rendering:** The body already sets `-webkit-font-smoothing: antialiased`. No need to reapply per-component.

---

## Color Token Reference

All tokens are CSS variables defined in `globals.css`. Tailwind classes map to these via `tailwind.config.ts`. **Never use raw hex values.**

| Token | CSS Variable | Value | Semantic meaning |
|-------|-------------|-------|-----------------|
| `bg-background` | `--background` | `#000000` | OLED black page base |
| `bg-background-elevated` | `--background-elevated` | `#1C1C1E` | Cards, sheets, popovers |
| `bg-background-secondary` | `--background-secondary` | `#2C2C2E` | Grouped content, sidebars |
| `bg-background-tertiary` | `--background-tertiary` | `#3A3A3C` | Inset groups, input areas |
| `text-foreground` | `--foreground` | `rgba(255,255,255,1.00)` | Primary label |
| `text-foreground-secondary` | `--foreground-secondary` | `rgba(235,235,245,0.60)` | Secondary label |
| `text-foreground-tertiary` | `--foreground-tertiary` | `rgba(235,235,245,0.30)` | Tertiary label |
| `text-foreground-quaternary` | `--foreground-quaternary` | `rgba(235,235,245,0.18)` | Quaternary label |
| `text-primary` / `bg-primary` | `--primary` | `#0A84FF` | System Blue — primary actions |
| `text-success` / `bg-success` | `--success` | `#30D158` | System Green — success states |
| `text-warning` / `bg-warning` | `--warning` | `#FFD60A` | System Yellow — warnings |
| `text-destructive` / `bg-destructive` | `--destructive` | `#FF453A` | System Red — errors, destructive |
| `text-info` / `bg-info` | `--info` | `#64D2FF` | System Cyan — informational; distinct from primary blue |
| `bg-fill` | `--fill` | `rgba(120,120,128,0.36)` | Control fills |
| `bg-fill-secondary` | `--fill-secondary` | `rgba(120,120,128,0.32)` | Secondary fills |
| `bg-fill-tertiary` | `--fill-tertiary` | `rgba(118,118,128,0.24)` | Tertiary fills |
| `bg-fill-quaternary` | `--fill-quaternary` | `rgba(116,116,128,0.18)` | Quaternary fills |
| `bg-overlay` | `--overlay` | `rgba(0,0,0,0.60)` | Modal/sheet backdrops |
| `border-border` | `--border` | `rgba(84,84,88,0.65)` | Standard separator |
| `border-border-subtle` | `--border-subtle` | `rgba(84,84,88,0.36)` | Subtle separator |
| `bg-muted` | `--muted` | `#2C2C2E` | Disabled backgrounds |

### Info vs. Primary: When to Use Each

`--primary` (#0A84FF System Blue) and `--info` (#64D2FF System Cyan) are intentionally distinct:

- Use `--primary` for interactive elements that demand action: CTA buttons, active tab indicators, focus rings, selected states.
- Use `--info` for passive informational content: informational alerts, status badges, help tooltips, contextual callouts. The user reads info but is not required to act on it.
- Never substitute one for the other. The visual distinction (blue vs. cyan) communicates intent.

---

## Animation Token Reference

All animation utilities are defined in `globals.css` under `@layer utilities` and as keyframes at the document level. Apply them as Tailwind class names.

| Class | Keyframe | Duration | Easing | Purpose |
|-------|----------|----------|--------|---------|
| `animate-fade-in` | `fade-in` | 200ms | `cubic-bezier(0.25,0.46,0.45,0.94)` (apple-ease) | Subtle appearance: tooltips, inline alerts, badge additions |
| `animate-slide-up` | `slide-up` | 300ms | `cubic-bezier(0.16,1,0.3,1)` (spring) | Upward entry: bottom sheets, toast notifications, dropdown panels |
| `animate-scale-in` | `scale-in` | 200ms | `cubic-bezier(0.34,1.56,0.64,1)` (overshoot spring) | Popover/modal panel entry, scale-up reveals |
| `animate-slide-in-left` | `slide-in-left` | 220ms | `cubic-bezier(0.25,0.46,0.45,0.94)` (apple-ease) | Sidebar and drawer entry from left edge |

### Animation Assignment by Component

| Component | Recommended Animation | Trigger |
|-----------|----------------------|---------|
| Alert (inline, appearing) | `animate-fade-in` | Mount / show |
| Alert (dismissible, exit) | Reverse via `opacity-0 max-h-0` CSS transition (not a keyframe animation) | Dismiss button |
| Modal overlay | `animate-fade-in` | Open |
| Modal panel (desktop) | `animate-scale-in` | Open |
| Modal panel (mobile bottom sheet) | `animate-slide-up` | Open |
| Select dropdown panel | `animate-slide-up` (shortened — override duration to 200ms inline) | Open trigger |
| Badge (appear) | `animate-scale-in` | Dynamic addition |
| Badge dismissible (exit) | CSS `opacity-0 scale-75 duration-200` transition | Dismiss |
| Tabs content panel | CSS `opacity-0 → opacity-100 duration-200` transition (not a keyframe) | Tab change |
| Sidebar / drawer | `animate-slide-in-left` | Open on mobile |
| Toast notification | `animate-slide-up` | Appear |

**Rules for animation usage:**
- Do not stack multiple animation classes on a single element simultaneously.
- Exit animations must always be CSS transitions (not keyframe `animation` classes) because keyframes cannot run in reverse on unmount without JavaScript orchestration.
- For elements that enter and exit repeatedly (alerts, toasts), prefer CSS `transition` + toggled classes over `animation` utilities to avoid re-triggering on re-render.
- Motion reduction: wrap all animations in a `prefers-reduced-motion` check. In Tailwind, use the `motion-safe:` prefix variant: `motion-safe:animate-fade-in`.

---

## 1. Button

### Overview
Buttons are the primary call-to-action surface. They come in five behavioral variants and three size tiers. Apple HIG requires all buttons meet the 44×44pt minimum touch target — for `sm` size, achieve this with invisible padding extension rather than visual size increase.

### Variants

#### Primary
The highest-emphasis action on any surface. Reserved for a single dominant action per view.

- **Background:** `bg-primary` (`--primary`, #0A84FF)
- **Text:** `text-primary-foreground` (`#FFFFFF`), `text-callout font-semibold`
- **Shape:** Full pill — `rounded-full`
- **Shadow:** `shadow-primary-glow` at rest; remove on press
- **Hover:** `opacity-90` with `shadow-primary-glow` retained
- **Active/Pressed:** `opacity-75`, scale down to `scale-[0.97]`, shadow removed
- **Transition:** `transition-all duration-250 ease-apple-ease`
- **Animation on mount:** None — buttons do not animate in; they are always present

Apple HIG note: The `rounded-full` pill shape is the canonical Apple CTA shape (see SF Symbols buttons, iOS action buttons). Use it only for Primary. All other variants use `rounded-lg`.

#### Secondary
Supporting actions alongside a Primary button. Can appear multiple times on a screen.

- **Background:** `bg-fill` (rgba(120,120,128,0.36)) — this is the "fill" material, not a solid surface
- **Text:** `text-foreground`, `text-callout font-medium`
- **Shape:** `rounded-lg`
- **Border:** None (the fill material implies boundary)
- **Hover:** `bg-fill-secondary`
- **Active/Pressed:** `bg-fill-tertiary`, `scale-[0.97]`

#### Outline
Low-emphasis variant. Use in areas where even a fill would feel too heavy, such as filter toolbars or table row actions.

- **Background:** `bg-transparent`
- **Border:** `border border-border`
- **Text:** `text-foreground`, `text-callout font-medium`
- **Shape:** `rounded-lg`
- **Hover:** `bg-fill-quaternary`, `border-border` remains
- **Active/Pressed:** `bg-fill-tertiary`, `scale-[0.97]`

#### Ghost
Invisible at rest. For tertiary inline actions (e.g. "View all", icon-only toolbar buttons).

- **Background:** `bg-transparent`
- **Border:** None
- **Text:** `text-primary`, `text-callout font-medium`
- **Shape:** `rounded-lg`
- **Hover:** `bg-fill-quaternary`
- **Active/Pressed:** `bg-fill-tertiary`, `scale-[0.97]`
- **Note:** Ghost buttons with only an icon should still hit the 44×44pt minimum via padding

#### Destructive
Irreversible or dangerous actions: delete, remove, revoke. Visually distinct at all times.

- **Background:** `bg-destructive` (`--destructive`, #FF453A)
- **Text:** `text-destructive-foreground` (`#FFFFFF`), `text-callout font-semibold`
- **Shape:** `rounded-full` (same as Primary — it is a primary-weight action, just dangerous)
- **Shadow:** None at rest (avoids glamorizing a destructive action)
- **Hover:** `opacity-90`
- **Active/Pressed:** `opacity-75`, `scale-[0.97]`
- **Confirmation pattern:** Destructive buttons should be preceded by a confirmation modal for non-reversible actions. This is a behavioral spec; see Modal component.

### Sizes

| Size | Height (visual) | Min touch target | Padding (H) | Padding (V) | Icon size | Font class |
|------|----------------|-----------------|-------------|-------------|-----------|------------|
| `sm` | 32px | 44×44pt via invisible area | `px-3` (12px) | `py-1.5` (6px) | 14px | `text-footnote font-medium` |
| `md` | 44px | 44×44pt native | `px-5` (20px) | `py-2.5` (10px) | 16px | `text-callout font-semibold` |
| `lg` | 52px | 52×52pt | `px-7` (28px) | `py-3.5` (14px) | 18px | `text-body font-semibold` |

For `sm`, wrap the visible button in a container with `min-h-[44px] min-w-[44px] flex items-center justify-center` to pad out the touch target without affecting visual size.

### Loading State
- Replace button label with a `Spinner` component (size `sm`, color `current`)
- Button remains the same width (prevent layout shift — set `min-w` equal to default label width)
- `pointer-events-none` + `opacity-70`
- Do NOT remove the button from the DOM during loading

### Disabled State
- `opacity-40`
- `pointer-events-none` (use `cursor-not-allowed` on wrapper if hover feedback is needed)
- `bg-muted` replaces variant-specific background for Primary and Destructive
- Text remains in its default weight and color (just dimmed by opacity)
- No hover or press effects

### Icon Support
- Icons can appear left or right of label with `gap-2` between icon and text
- Icon-only buttons: equal padding on all sides to form a square hit target; add `aria-label`
- Icon size scales with button size (see table above)

### Apple HIG Notes
- Never place two Primary buttons side-by-side. Use Primary + Secondary.
- Full-width buttons (`w-full`) are acceptable on mobile sheets and card footers.
- Avoid text longer than ~24 characters on any button label.

---

## 2. Input

### Overview
Text inputs allow single-line text entry. They follow Apple's "inset" material approach — the field background is darker than the card surface, creating depth without a visible border at rest.

### Base Anatomy
- **Container:** Full-width `w-full`
- **Label:** Floats above the field, `text-footnote text-foreground-secondary`, `mb-1.5` below label
- **Field background:** `.apple-inset` utility (`bg-background-tertiary`, inner shadow, `rounded`)
- **Field padding:** `px-4 py-3` (16px/12px)
- **Text:** `text-callout text-foreground`
- **Placeholder:** `text-foreground-tertiary` (use CSS `::placeholder` styling)
- **Height:** `min-h-[44px]` to meet touch target requirement
- **Border:** `border border-border-subtle` at rest — subtle 1px separator

### States

**Rest:**
Background `.apple-inset`. Border `border-border-subtle`. No glow.

**Focus:**
- Border becomes `border-primary`
- Add `ring-2 ring-primary/20` (a soft 2px blue halo using primary at 20% opacity — mimics iOS keyboard focus)
- Transition: `duration-250 ease-apple-ease`
- Label stays in place (no floating animation needed for this design system)

**Filled (has value):**
Identical to rest. No visual change.

**Error:**
- Border: `border-destructive`
- Add `ring-2 ring-destructive/20`
- Error message appears below field: `text-caption1 text-destructive`, `mt-1.5`
- Optionally prepend a warning icon (16px) before the error text

**Disabled:**
- `opacity-40`, `pointer-events-none`
- Background: `bg-muted` (removes the depth effect — disabled fields should feel "flat")
- Placeholder and label also dim via inherited opacity

### Types

#### Default (text)
Standard single-line text entry. No icons.

#### Search
- Prefix icon: magnifying glass at 16px, `text-foreground-tertiary`, `pl-10` on field to accommodate
- Optional clear (X) icon-button appears on right when field has value — `text-foreground-tertiary`, Ghost variant icon button
- Background: `.apple-inset`

#### Password
- Suffix toggle icon: eye / eye-slash at 16px, `text-foreground-tertiary`
- `pr-10` on field to accommodate icon
- Toggle switches `type` between `password` and `text`
- Icon button is Ghost variant, not styled as a Button component — it is a `<button>` with icon inside the field

### Label Behavior
- Always render a `<label>` element connected via `htmlFor` / `id`
- Label text: `text-footnote font-medium text-foreground-secondary`
- Required fields: append `text-destructive ml-0.5` asterisk after label text (do not add "(required)" as text)
- Optional fields: append `text-foreground-tertiary ml-1 font-normal` "(optional)" after label text

### Helper Text
- Below field, `text-caption1 text-foreground-tertiary`, `mt-1`
- Replaced entirely by error message when in error state (do not show both)

### Apple HIG Notes
- Do not use visible borders as the only affordance for a text field. The `.apple-inset` depth effect is the primary signal; border is a secondary reinforcement.
- Autofill: do not disable it with `autocomplete="off"` unless there is a strong functional reason. Apple's password manager and autofill are trust-building features.

---

## 3. Card

### Overview
Cards are the primary content-grouping surface in this design system. They use the elevated background layer to lift content off the page background. Cards can be purely presentational or interactive (clickable).

### Base Anatomy
- **Surface:** `.apple-card` utility (`bg-background-elevated`, `rounded-lg`, `border border-border-subtle`, `shadow`)
- **Internal structure:** Three optional slots — Header, Body, Footer — separated by `border-t border-border-subtle` dividers where both adjacent slots are present

### Header Slot
- Padding: `px-5 pt-5 pb-4` (20px sides, 20px top, 16px bottom)
- Title: `text-headline text-foreground` (17px, font-weight 600)
- Subtitle: `text-footnote text-foreground-secondary`, `mt-0.5`
- Optional trailing action (icon button or text link): aligned right via `flex justify-between items-start`
- Divider below header: `border-t border-border-subtle` — only render if body or footer slot is also populated

### Body Slot
- Padding: `p-5` (20px all sides)
- If header is present, reduce top padding to `pt-0` and let header divider create visual separation
- Body content is freeform — the spec does not constrain what goes inside

### Footer Slot
- Padding: `px-5 pb-5 pt-4` (20px sides, 16px top, 20px bottom)
- Always separated from body by `border-t border-border-subtle`
- Typical contents: action buttons (right-aligned with `flex justify-end gap-3`), or metadata text (`text-caption1 text-foreground-tertiary`)

### Hover Effect (non-clickable cards)
Cards that display hoverable content (e.g. a data summary) may use a subtle hover lift:
- `hover:shadow-lg` (escalates shadow level)
- `hover:border-border` (elevates from subtle to standard border)
- Transition: `transition-all duration-250 ease-apple-ease`
- Do NOT change background color on hover for non-clickable cards

### Clickable Variant
Cards that navigate to another view or trigger an action should feel pressable:
- All hover styles from above, PLUS:
- `active:scale-[0.99]` (very slight shrink — mirrors iOS press feel)
- `cursor-pointer`
- `active:shadow-sm` (shadow deflates on press)
- `active:bg-background-secondary` (very slightly darker surface on press)
- The entire card is the hit target; do not add a nested "click here" button inside a clickable card
- `tabIndex={0}` + `role="button"` + keyboard Enter/Space handlers for accessibility

### Animation
- When a card appears as part of a list being populated (e.g. search results, task list render): `motion-safe:animate-fade-in`
- Do not animate cards that are always present on page load

### Sizing
Cards have no fixed width — they expand to fill their container. Use grid or flex on the parent to control layout. Internal content controls height.

### Nesting
Cards can be nested. An inner card inside an outer card should use `bg-background-secondary` instead of `bg-background-elevated` to maintain the elevation hierarchy (inner surfaces appear lower, not higher).

### Apple HIG Notes
- Rounded corners at `rounded-lg` (14px) match iOS list row grouping style.
- Cards should not have drop shadows visible at the corner — the `shadow` value in the design system is already calibrated for OLED dark backgrounds.
- Avoid putting more than one primary action in a card footer.

---

## 4. Modal

### Overview
Modals (sheets) interrupt the user's current task to present focused content or require a decision. In Apple HIG terms, they map to "sheets" and "alerts". They float above the overlay on the `bg-background-elevated` surface with `rounded-xl` corners.

### Overlay
- **Color:** `bg-overlay` — use the `--overlay` token (`rgba(0,0,0,0.60)`), **not** a raw `bg-black/60`. The token is the canonical value; using it ensures any future overlay adjustment propagates everywhere.
- **Backdrop:** `backdrop-blur-apple` (20px blur) — gives the frosted "everything behind is still visible but muted" feel
- **z-index:** Overlay at `z-40`, modal panel at `z-50`
- **Dismiss on click:** Clicking the overlay dismisses the modal (standard sheet behavior). This must be togglable via a prop for critical confirmations.

### Panel Surface
- **Background:** `bg-background-elevated` (`#1C1C1E`)
- **Border:** `border border-border-subtle`
- **Radius:** `rounded-xl` (20px — Apple's modal/sheet radius)
- **Shadow:** `shadow-xl`
- **Positioning:** Horizontally centered, vertically centered on desktop. On mobile (< 640px), anchored to bottom of screen as a bottom sheet with `rounded-t-xl rounded-b-none` and `w-full`.

### Animation

**Open (enter):**
- Overlay: `motion-safe:animate-fade-in` (`duration-250 ease-apple-ease`)
- Panel (desktop): `motion-safe:animate-scale-in` (`duration-200`, overshoot spring — gives the "plop down" feel)
- Panel (mobile bottom sheet): `motion-safe:animate-slide-up` (`duration-300`, spring easing)

**Close (exit):**
- Reverse of enter via CSS transitions (not keyframe animations). Use `duration-200` (exit is faster than enter — Apple convention).
- Panel (desktop): `opacity-100 scale-100` to `opacity-0 scale-95`
- Panel (mobile): `translateY(0)` to `translateY(100%)`

### Sizes

| Size | Max width | Use case |
|------|-----------|----------|
| `sm` | `max-w-sm` (384px) | Confirmations, alerts, simple prompts |
| `md` | `max-w-lg` (512px) | Forms, settings panels, detail views |
| `lg` | `max-w-2xl` (672px) | Complex forms, preview panels, editors |

On screens narrower than the `max-w`, the modal goes full-width with `mx-4` (16px) side margins.

### Internal Structure

**Header:**
- `px-6 pt-6 pb-4` (24px sides, 24px top, 16px bottom)
- Title: `text-title3 font-semibold text-foreground`
- Subtitle (optional): `text-footnote text-foreground-secondary mt-1`
- Close button: top-right corner, Ghost icon button (X icon, 20px), `absolute top-4 right-4`

**Close Button:**
- Ghost icon-only button, 44×44pt target
- Icon: `text-foreground-secondary` at rest, `text-foreground` on hover
- Background: `bg-fill-quaternary` on hover, `rounded-lg`

**Body:**
- `px-6 pb-4` (24px sides)
- Scrollable if content overflows: `overflow-y-auto max-h-[60vh]`
- Content is freeform

**Footer:**
- `px-6 pb-6 pt-4`
- Separated from body by `border-t border-border-subtle`
- Buttons right-aligned with `flex justify-end gap-3`
- Destructive confirmation modals: destructive action on the RIGHT (Apple convention — "Delete" is the rightmost, confirming button)
- Cancel is always the leftmost button, Secondary variant

### Scrolling
When body content overflows `max-h-[60vh]`, the body area becomes independently scrollable. Header and footer remain sticky (do not scroll). Add a subtle `shadow-sm` on the bottom edge of the header when scrolled > 0 to indicate more content below.

### Apple HIG Notes
- Modals should always have a clear, single dismiss path (the X button). Do not rely solely on the overlay tap.
- Do not stack modals. If a secondary modal is needed, consider a panel within the existing modal instead.
- For destructive confirmation specifically: use a `sm` modal with a two-button footer (Cancel left, Destructive action right). The title should name the action explicitly ("Delete Meeting?" not "Are you sure?").

---

## 5. Alert

### Overview
Alerts surface contextual feedback within the page — inline below a form, at the top of a section, or in a global notification area. They do not block interaction (that is the Modal's role).

### Base Anatomy
- **Container:** `rounded-lg border px-4 py-3` (14px radius, 16px/12px padding)
- **Layout:** `flex items-start gap-3`
- **Left accent bar:** `absolute left-0 top-0 bottom-0 w-1 rounded-l-lg` — color driven by the type's accent token (see below)
- **Icon:** 18–20px, vertically aligned with first line of text (`mt-0.5 shrink-0`)
- **Content:** `flex-1 min-w-0`, contains title and description
- **Dismiss button:** Optional, right-aligned Ghost icon-only button (X, 16px), `min-w-[44px] min-h-[44px]`

### Types

#### Info — UPDATED IN v1.1
The `info` type previously used `--primary` (System Blue). **It must now use `--info` (System Cyan, #64D2FF).** The distinction matters: primary blue signals an actionable element; cyan signals a passive informational message. Do not revert this.

- **Background:** `bg-info/10`
- **Border:** `border-info/30`
- **Left accent bar:** `bg-info`
- **Icon color:** `text-info`
- **Icon:** Info circle (SVG), `width="18" height="18"`
- **Title:** `text-subheadline font-semibold` — color inherits from the container's `text-info` class
- **Description:** `text-footnote opacity-90` — inherits color; the opacity reduction ensures the description reads as secondary to the title
- **ARIA role:** `role="status"` + `aria-live="polite"` (info is non-urgent)

**What changed in the implementation:**
The current `Alert.tsx` sets `container: 'bg-primary/10 border-primary/30 text-primary'` for the `info` type. The implementing agent must change this to `bg-info/10 border-info/30 text-info` and update the accent from `bg-primary` to `bg-info`. No other structural changes are needed.

#### Success
- **Background:** `bg-success/10`
- **Border:** `border-success/30`
- **Left accent bar:** `bg-success`
- **Icon color:** `text-success`
- **Icon:** Checkmark circle (SVG), `width="18" height="18"`
- **Title/Description:** same pattern as Info
- **ARIA role:** `role="status"` + `aria-live="polite"` (success is non-urgent)

#### Warning
- **Background:** `bg-warning/10`
- **Border:** `border-warning/30`
- **Left accent bar:** `bg-warning`
- **Icon color:** `text-warning` — note: the warning icon itself uses the yellow token; the container class should use `text-warning-foreground` for body text to ensure contrast on the dark background
- **Icon:** Exclamation triangle (SVG), `width="18" height="18"`
- **Title:** `text-subheadline font-semibold text-foreground` (explicitly white — `--warning` yellow text on dark would pass contrast, but using `text-foreground` ensures higher contrast ratio)
- **Description:** `text-footnote opacity-90 text-foreground-secondary`
- **ARIA role:** `role="alert"` + `aria-live="assertive"` (warning is urgent)

#### Error
- **Background:** `bg-destructive/10`
- **Border:** `border-destructive/30`
- **Left accent bar:** `bg-destructive`
- **Icon color:** `text-destructive`
- **Icon:** X circle (SVG), `width="18" height="18"`
- **Title/Description:** same as Info pattern
- **ARIA role:** `role="alert"` + `aria-live="assertive"` (error is urgent)

### Color Token Summary for Alert Types

| Type | Background | Border | Accent bar | Icon + text | ARIA role |
|------|-----------|--------|------------|-------------|-----------|
| `info` | `bg-info/10` | `border-info/30` | `bg-info` | `text-info` | `status` / `polite` |
| `success` | `bg-success/10` | `border-success/30` | `bg-success` | `text-success` | `status` / `polite` |
| `warning` | `bg-warning/10` | `border-warning/30` | `bg-warning` | `text-warning` (icon), `text-foreground` (text) | `alert` / `assertive` |
| `error` | `bg-destructive/10` | `border-destructive/30` | `bg-destructive` | `text-destructive` | `alert` / `assertive` |

### Dismissible Variant
- Append a Ghost icon button (X, 16px) to the right with `min-w-[44px] min-h-[44px] shrink-0 self-center`
- `focus-visible:ring-2 focus-visible:ring-current` on the dismiss button
- On dismiss: animate `opacity-100 max-h-[200px] py-3.5` to `opacity-0 max-h-0 py-0 overflow-hidden`, `duration-250 ease-apple-ease` via CSS transition (not a keyframe animation utility)
- After the transition ends (`onTransitionEnd`), remove from DOM

### Animation on Appearance
- Inline alerts that appear after a user action (e.g. form submission feedback): `motion-safe:animate-fade-in`
- Toast-style alerts (fixed position): `motion-safe:animate-slide-up`
- Do not animate alerts that are rendered on initial page load

### Title vs. Description-only
- If only a single line of text (no description), vertically center the icon with `items-center` instead of `items-start`
- If title + description, use `items-start` with `mt-0.5` on icon

### Positioning
- **Inline:** Rendered within the content flow, `w-full`, `mb-4` below the alert for spacing
- **Toast/Global:** Fixed position, `bottom-6 right-6`, `max-w-sm`, `shadow-lg` — these stack from the bottom with `gap-2`; this is a usage pattern, not a different component variant

### Apple HIG Notes
- Do not use Alert for loading states. Use Spinner.
- Error alerts in forms should appear below the form submit button, not at the top of the form.
- Use the `success` variant only after a completed action, not as a decorative element.
- The `info` type using cyan (#64D2FF) is intentional and Apple HIG-compliant. iOS system cyan is reserved for informational UI elements (e.g. Maps callouts, Shortcuts information blocks).

---

## 6. Select

### Overview
The Select component replaces the native `<select>` element with a custom trigger + dropdown panel. It supports three modes: standard single-select, searchable single-select, and multi-select.

### Trigger (Closed State)
- **Surface:** `.apple-inset` (same as Input — they are visually identical fields)
- **Padding:** `px-4 py-3 min-h-[44px]`
- **Layout:** `flex items-center justify-between`
- **Value text:** `text-callout text-foreground`
- **Placeholder:** `text-foreground-tertiary text-callout`
- **Trailing icon:** Chevron-down, 16px, `text-foreground-tertiary`, `flex-shrink-0`
- **Border:** `border border-border-subtle`
- **Radius:** `rounded` (10px, matching Input)

**Focus (trigger focused, dropdown closed):**
`border-primary ring-2 ring-primary/20`

**Open (dropdown visible):**
Chevron-down rotates to chevron-up: `rotate-180` with `duration-250 ease-apple-ease`
`border-primary`

**Disabled:**
`opacity-40 pointer-events-none`

### Dropdown Panel
- **Surface:** `bg-background-elevated border border-border-subtle rounded-lg shadow-lg`
- **Position:** Below trigger (`top-full mt-1.5`), same width as trigger (`w-full`)
- **Max height:** `max-h-60` (240px) with `overflow-y-auto`
- **z-index:** `z-50`
- **Animation:** `motion-safe:animate-slide-up` on open; exit via CSS `opacity-0 scale-95 translate-y-[-4px] duration-200` transition on close
- **Padding:** `p-1` (4px) around the option list — options have their own padding

### Option Item
- **Padding:** `px-3 py-2.5` (12px/10px) giving approx 44px minimum touch height at standard density
- **Text:** `text-callout text-foreground`
- **Radius:** `rounded-sm` on each option
- **Hover:** `bg-fill-quaternary`
- **Selected:** `bg-primary/15`, `text-primary font-medium`, leading checkmark icon (16px) in `text-primary`
- **Focused (keyboard):** `bg-fill-tertiary`
- **Disabled option:** `opacity-40 pointer-events-none`
- **Grouped options:** Group label above group `text-caption1 font-semibold text-foreground-tertiary uppercase tracking-wider px-3 py-1.5`; group divider `border-t border-border-subtle my-1`

### Searchable Variant
- Inside the dropdown panel, above the option list: a search input field
- **Field:** `.apple-inset rounded-sm mx-1 mb-1`, `px-3 py-2`, search icon prefix (`text-foreground-tertiary`, 14px)
- **Border:** none (the inset provides enough affordance)
- The search input is focused automatically when the dropdown opens
- Options filter as user types; no result state: `text-caption1 text-foreground-tertiary text-center py-4`

### Multi-Select Variant
- Selected values appear as Badge components (size `sm`, dismissible) inside the trigger, replacing the placeholder text
- Trigger expands vertically to accommodate multiple badges: `min-h-[44px] h-auto py-2`
- Badges flow in a `flex flex-wrap gap-1` container inside the trigger
- Dropdown options show a checkbox (16px) on the left; checked state uses `bg-primary` fill
- A "Selected (n)" count badge appears at the top of the dropdown list when 1+ items are selected, with a "Clear all" ghost text button trailing it

### Apple HIG Notes
- Native `<select>` renders the iOS native picker wheel on mobile. If the iOS picker wheel is acceptable UX (for short flat lists), consider using native. The custom component is preferred for searchable or multi-select scenarios.
- The dropdown should close on: option selection, outside click, Escape key.

---

## 7. Textarea

### Overview
Textarea is a multi-line text input. It shares visual language with Input but adds auto-resize behavior and an optional character counter.

### Base Anatomy
- **Surface:** `.apple-inset` (`bg-background-tertiary`, `rounded`, inner shadow)
- **Padding:** `px-4 py-3` (16px/12px)
- **Min height:** `min-h-[88px]` (2 visible rows at default line height)
- **Max height (auto-resize):** `max-h-[320px]` — beyond this, the field becomes scrollable
- **Text:** `text-callout text-foreground`
- **Resize handle:** `resize-none` — auto-resize handles height; do not expose the native resize drag handle
- **Border:** `border border-border-subtle` at rest

### States
All states mirror Input exactly:
- **Rest:** `.apple-inset`, `border-border-subtle`
- **Focus:** `border-primary ring-2 ring-primary/20`
- **Error:** `border-destructive ring-2 ring-destructive/20` + error message below
- **Disabled:** `opacity-40 pointer-events-none bg-muted`

### Auto-Resize Behavior
- Default height: renders at `min-h-[88px]`
- As the user types, the field height grows to fit content using a `scrollHeight` measurement approach
- Growth animation: `transition-[height] duration-100 ease-apple-ease` (fast, so it does not feel laggy)
- When content is deleted, height shrinks back — do not hard clamp the minimum below `min-h-[88px]`
- At `max-h-[320px]`, scrolling begins; the field no longer grows

### Character Counter
- Rendered in the bottom-right corner of the component (outside the field, below it, right-aligned)
- `text-caption1 text-foreground-tertiary`, `mt-1 text-right`
- Format: `{current}/{max}` e.g. `142/500`
- When approaching limit (> 80% used): `text-warning`
- When at or over limit (>= 100%): `text-destructive font-medium`
- When over limit, the border should also become `border-destructive ring-2 ring-destructive/20`
- Counter is only rendered when `maxLength` prop is provided

### Validation
- Minimum length errors appear after blur (not on every keystroke)
- Maximum length is enforced visually (counter turns red) but do not hard-block typing — allow overflow so user can see what needs trimming
- Error message placement: below the counter (right-aligned), `text-caption1 text-destructive`

### Label and Helper Text
Identical to Input component. Label above the field, helper text below (replaced by error on error state).

### Apple HIG Notes
- Auto-resize prevents the user from having to scroll inside a small textarea. Prefer it over a fixed-height textarea with internal scroll, except in constrained layouts.
- The `max-h-[320px]` cap prevents the field from pushing critical page actions off-screen on short viewports.

---

## 8. Badge

### Overview
Badges are compact labels for status, categorization, or counts. They are non-interactive by default; the dismissible variant adds a remove affordance.

### Base Anatomy
- **Shape:** `rounded-full` (pill) — badges are always pill-shaped in this design system
- **Padding:** size-dependent (see below)
- **Typography:** `text-caption1 font-medium` for md/sm; `text-caption2 font-semibold` for xs
- **No shadow** — badges are flat elements

### Sizes

| Size | Padding | Min height | Font class |
|------|---------|------------|------------|
| `sm` | `px-2 py-0.5` (8px/2px) | 20px | `text-caption1 font-medium` |
| `md` | `px-2.5 py-1` (10px/4px) | 24px | `text-caption1 font-medium` |
| `lg` | `px-3 py-1.5` (12px/6px) | 28px | `text-footnote font-medium` |

### Color Variants
Each variant uses a tinted background with a matching text color. All backgrounds are at low opacity to maintain the dark surface feel. Text uses the full-opacity system color for contrast.

| Variant | Background | Text | Use case |
|---------|-----------|------|----------|
| `default` | `bg-fill` | `text-foreground` | Neutral tags, categories |
| `primary` | `bg-primary/15` | `text-primary` | Active filters, primary tags |
| `info` | `bg-info/15` | `text-info` | Informational status, help context |
| `success` | `bg-success/15` | `text-success` | Status: active, completed, online |
| `warning` | `bg-warning/15` | `text-warning` | Status: pending, expiring |
| `destructive` | `bg-destructive/15` | `text-destructive` | Status: error, expired, blocked |
| `secondary` | `bg-fill-secondary` | `text-foreground-secondary` | Inactive, archived, secondary tags |

**Note on `info` variant:** This variant was not present in v1.0. It is now a first-class option using the `--info` System Cyan token. Use it for badges that convey a neutral-informational status (e.g. "Beta", "New", "Info") rather than a success/warning/error state.

### Animation on Appearance
When badges are dynamically added to the DOM (e.g. a tag is applied, a count increments): `motion-safe:animate-scale-in`. This provides the characteristic "pop in" feel consistent with iOS tag/badge behavior.

### Dismissible Variant
- Append a × icon (12px for sm/md, 14px for lg) after the label text
- Spacing: `gap-1` between text and icon
- The × icon is a `<button>` with `rounded-full`, `hover:bg-black/20` (darkens the badge surface slightly), `p-0.5`, `-mr-0.5`
- The entire badge is NOT the click target — only the × is
- On dismiss: CSS transition `opacity-0 scale-75 duration-200 ease-apple-ease`, then remove from DOM

### Icon + Label
- Optionally prefix a 12px icon before the label text
- Spacing: `gap-1`
- Icon inherits the badge's text color

### Dot Indicator
A minimal variant: just a colored dot, no text. Used for online/offline status indicators.
- Dimensions: `w-2 h-2` (8px) for sm, `w-2.5 h-2.5` (10px) for md
- Shape: `rounded-full`
- Color: use bg-{variant} directly (e.g. `bg-success`, `bg-destructive`, `bg-info`)
- Optionally animate with `animate-pulse` for "live" indicators

### Apple HIG Notes
- Badges in this design system do not use a white border "outline" around them (common in light mode). The tinted background provides sufficient differentiation on dark surfaces.
- Do not use more than 2-3 badge variants on a single screen — visual diversity becomes noise.

---

## 9. Spinner

### Overview
Spinners indicate indeterminate loading. They are used inside buttons (loading state), as full-area loading overlays, and inline in content sections.

### Appearance
- **Shape:** A circular arc (not a full circle) — 75% of the circle is visible, 25% is transparent, creating a rotating "C" shape
- **Implementation approach:** An SVG circle with `stroke-dasharray` and `stroke-dashoffset`, or a CSS border trick: `rounded-full border-2 border-transparent border-t-[color]` (only the top border is colored, others transparent — creates the arc on rotation)
- **Animation:** `animate-spin` (Tailwind's default — 1 full rotation per second, linear)
- **No shadow**

### Sizes

| Size | Dimensions | Border/Stroke width | Use case |
|------|-----------|---------------------|----------|
| `xs` | `w-3 h-3` (12px) | 1.5px | Inside compact UI elements |
| `sm` | `w-4 h-4` (16px) | 2px | Inside buttons (loading state) |
| `md` | `w-6 h-6` (24px) | 2px | Inline content loading |
| `lg` | `w-8 h-8` (32px) | 3px | Section-level loading |
| `xl` | `w-12 h-12` (48px) | 3px | Full-page/full-panel loading |

### Color Variants

| Variant | Arc color | Track color | Use case |
|---------|-----------|-------------|----------|
| `default` | `text-primary` (`#0A84FF`) | `text-fill` | General loading |
| `current` | `currentColor` | `currentColor/30` | Inside buttons — inherits button text color |
| `white` | `#FFFFFF` | `rgba(255,255,255,0.2)` | On colored backgrounds |
| `success` | `text-success` | `text-success/20` | Post-action success loading |
| `muted` | `text-foreground-tertiary` | `text-fill-quaternary` | Low-emphasis background tasks |

Note: the "track" is the full circle path in a muted color; the "arc" is the animated partial circle on top.

### Usage Patterns

**Inside Button (loading state):**
- Size `sm`, variant `current`
- Centered in the button, replaces label text
- Button width does not change (pre-set `min-w`)

**Inline content loading:**
- Size `md`, variant `default`
- Centered in the content area with `flex items-center justify-center`
- Optionally accompanied by a `text-footnote text-foreground-tertiary mt-2` loading label below

**Full-page loading:**
- Size `xl`, variant `default`
- `fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-apple z-50`

### Accessibility
- Always include `role="status"` on the spinner container
- Include a visually hidden `<span className="sr-only">Loading...</span>` inside the container
- When the loading state ends, announce completion via `aria-live="polite"` on a sibling element

### Apple HIG Notes
- Prefer skeleton screens over spinners for content that has a known shape. Spinners are for indeterminate or short-duration waits (< 2 seconds).
- For waits over 2 seconds, add a descriptive loading label. For waits over 10 seconds, consider a progress bar instead.

---

## 10. Tabs

### Overview
Tabs allow users to switch between sibling views within the same context. In Apple HIG, this maps to "segmented controls" (compact, equal-width) and "tab bars" (full navigation). This component implements the content-area tab pattern — horizontal tabs above a content panel.

### Base Anatomy

**Tab List (container):**
- `flex gap-0` — tabs sit flush against each other with no gap
- Positioned below a section heading, spanning full width or auto-width
- Bottom border: `border-b border-border-subtle` running the full width
- The active tab's bottom indicator overrides this border locally

**Tab Item (individual tab):**
- `px-4 py-2.5 min-h-[44px]` (16px/10px padding, meets 44pt minimum)
- `text-subheadline font-medium`
- `relative flex items-center gap-1.5` (for icon + label alignment)
- `cursor-pointer`
- `select-none`
- Bottom indicator: `absolute bottom-0 left-0 right-0 h-[2px]` (2px line, not a border)

### States

**Inactive:**
- Text: `text-foreground-secondary`
- Bottom indicator: not visible (or `bg-transparent`)
- Hover: `text-foreground`, `bg-fill-quaternary` (very subtle background fill on hover — same pattern as Ghost button)
- Hover transition: `duration-250 ease-apple-ease`

**Active:**
- Text: `text-primary font-semibold`
- Bottom indicator: `bg-primary`, full width of the tab, `h-[2px]` — this indicator slides (animates position) as the active tab changes
- Background: none (the indicator is sufficient; do not add a background tint to the active tab)
- Active indicator animation: the 2px line translates horizontally to the new active tab's position using a layout animation (Framer Motion `layoutId` or a CSS `transform: translateX` calculated from tab index). Duration: `250ms ease-apple-spring`

**Pressed/Clicked:**
- `opacity-75` on the tab item during press (`active:opacity-75`)

**Disabled:**
- `opacity-40 pointer-events-none`
- Bottom indicator never appears on a disabled tab

**Focus (keyboard):**
- `outline-2 outline-ring outline-offset-2` on the tab item
- Keyboard: Left/Right arrows navigate between tabs (roving tabindex pattern)

### Content Panel Animation
- Content switches with `motion-safe:animate-fade-in` (`duration-200 ease-apple-ease`) applied to the incoming panel on tab change
- Do not slide content in/out (creates disorientation when using tabs)
- The content panel has no fixed height — it grows to fit the selected tab's content
- **Padding:** `pt-5` between tab list and content

### Icon Support
- Icons sit to the left of the label: 16px, inherits tab text color
- Icon-only tabs are permitted for compact layouts (e.g. `<3` tabs in a toolbar); always include `title` attribute for tooltip
- When a tab has an icon, the icon color transitions with the text color: inactive `text-foreground-secondary` → active `text-primary`

### Badge on Tab
- A count badge can appear to the right of the label: `Badge` component, variant `primary`, size `sm`
- On active tab: badge is still `bg-primary/15 text-primary`
- On inactive tab: badge is `bg-fill text-foreground-secondary`

### Variants

**Full-width tabs:**
Each tab takes equal width: add `flex-1 justify-center` to each tab item. Use when tab count is 2-4.

**Auto-width tabs:**
Each tab sizes to its content. Use for 5+ tabs or mixed-length labels. May need horizontal scroll: `overflow-x-auto` on the tab list with `-webkit-overflow-scrolling: touch`.

**Segmented Control (compact):**
For short lists of 2-4 options with equal importance (e.g. Day/Week/Month). Render as a pill-shaped container with a sliding indicator:
- Container: `bg-fill-tertiary rounded p-1 inline-flex` (the fill creates a "tray")
- Inactive tab: no background, `text-foreground-secondary text-footnote font-medium`
- Active tab: `bg-background-elevated rounded-sm shadow-sm`, `text-foreground text-footnote font-semibold`
- The background "pill" slides to the active tab on change — this is the `layoutId` animation approach

### Accessibility
- `role="tablist"` on the container
- `role="tab"`, `aria-selected`, `aria-controls` on each tab
- `role="tabpanel"`, `aria-labelledby` on each content panel
- Only the active tab should be in the tab order (`tabIndex={0}`); all others `tabIndex={-1}`
- Arrow key navigation per ARIA Authoring Practices Guide tab pattern

### Apple HIG Notes
- Do not use tabs for wizards or sequential steps. Use a stepper component instead.
- The 2px bottom indicator is the canonical indicator pattern; avoid filled-background active states for this tab style (that is the segmented control pattern).
- Tab labels should be 1-2 words. Avoid full sentences.
- Maximum recommended tabs in a scrollable list: 7. Beyond that, consider a sidebar navigation or a dropdown "more" overflow.

---

## Cross-Component Patterns

### Shared Transition Rule
Every interactive element in this design system uses:
```
transition-[property] duration-250 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
```
Where `[property]` is the specific property being animated (color, opacity, transform, shadow). Do not use `transition-all` in performance-critical components (prefer specific properties).

### Shared Focus Ring Rule
All focusable elements inherit the global `:focus-visible` rule:
```
outline: 2px solid var(--ring);
outline-offset: 2px;
```
Components must not override or suppress this. The only allowed override is using `rounded-full` for pill-shaped elements where the default `rounded-sm` focus ring would look mismatched.

### Shared Disabled Pattern
Disabled interactive elements across all components:
- `opacity-40`
- `pointer-events-none`
- Background shifts to `bg-muted` where the active background was a semantic color
- Do not change the shape or layout of disabled elements

### Shared Error Color Pattern
Error states across Input, Textarea, Select:
- `border-destructive ring-2 ring-destructive/20`
- Error message: `text-caption1 text-destructive mt-1.5`
- Error icon (optional): 14px, `text-destructive`, inline before error text

### Z-Index Layers
| Layer | z-index | Elements |
|-------|---------|----------|
| Base content | 0 | Page content |
| Sticky headers | 10 | Sticky nav, tab bars |
| Dropdowns | 50 | Select panels, popovers |
| Modals overlay | 40 | Modal backdrop |
| Modal panel | 50 | Modal/sheet content |
| Toasts | 60 | Global toast notifications |

### 4px Grid Compliance Check
Before finalizing any component, verify that every padding, margin, gap, and dimension value is a multiple of 4px. Non-conforming values (e.g. 6px, 10px, 14px) are only acceptable when they match a defined design token (border radius values are token-driven and exempt).

### Motion Reduction Compliance
All animation utility classes (`animate-fade-in`, `animate-slide-up`, `animate-scale-in`, `animate-slide-in-left`) must be wrapped with the `motion-safe:` Tailwind prefix variant:
```
motion-safe:animate-fade-in
motion-safe:animate-slide-up
motion-safe:animate-scale-in
motion-safe:animate-slide-in-left
```
This ensures the animations are skipped entirely when the user has "Reduce Motion" enabled in system accessibility preferences. CSS `transition` declarations used for hover/press/focus states are lower-impact and do not require this guard, but should still use short durations (≤ 250ms).

---

## Apple HIG Compliance Checklist

Run this checklist against every component before marking it ready for production. Each item maps to a specific Apple Human Interface Guidelines requirement.

### Interaction & Touch Targets
- [ ] Every interactive element has a minimum touch target of 44×44pt (achieved visually or via invisible padding extension)
- [ ] Tap highlight is suppressed on custom interactive elements (`-webkit-tap-highlight-color: transparent` or Tailwind `tap-transparent` where needed)
- [ ] Swipe and gesture interactions respect platform conventions (no custom swipe gestures that conflict with iOS system gestures)

### Visual Design
- [ ] Only design tokens are used for all colors — no raw hex values, no Tailwind gray-* utilities, no arbitrary color values
- [ ] Typography uses exclusively the Apple HIG type scale classes (`text-caption2` through `text-largetitle`)
- [ ] All spacing values conform to the 4px grid
- [ ] Border radius values match the design token set: 6px, 10px, 14px, 20px, 28px, or `rounded-full`
- [ ] Dark-only: no light-mode fallbacks are needed; all tokens are calibrated for OLED black backgrounds
- [ ] Shadows use the predefined shadow tokens (`--shadow-sm`, `--shadow`, `--shadow-lg`, `--shadow-xl`, `--shadow-primary-glow`, `--shadow-success-glow`) — no arbitrary `drop-shadow` values

### Color Semantics
- [ ] `--primary` (#0A84FF) is used only for interactive/actionable elements: buttons, links, focus rings, selected states, active indicators
- [ ] `--info` (#64D2FF) is used only for passive informational elements: info alerts, informational badges, help callouts
- [ ] `--success` is used only after a completed positive action, not decoratively
- [ ] `--warning` is used for time-sensitive or potentially negative states, paired with `text-foreground` for body text to preserve contrast
- [ ] `--destructive` is used for irreversible actions and error states only
- [ ] The `bg-overlay` / `--overlay` token is used for all modal/sheet backdrops — not a raw `bg-black/60`

### Accessibility
- [ ] All interactive elements are keyboard-navigable and receive focus via Tab
- [ ] Focus ring is visible on `:focus-visible` using the `--ring` token — not suppressed by any component
- [ ] Color is not the only means of conveying information (icons accompany all Alert types; shape reinforces button hierarchy)
- [ ] ARIA roles are correct: `role="status"` + `aria-live="polite"` for non-urgent feedback; `role="alert"` + `aria-live="assertive"` for urgent feedback
- [ ] Icon-only buttons have `aria-label` attributes
- [ ] Form fields have associated `<label>` elements via `htmlFor` / `id`
- [ ] Loading spinners include `role="status"` and a visually hidden `<span className="sr-only">Loading...</span>`
- [ ] Tab components implement the ARIA Authoring Practices Guide tab pattern (roving tabindex, arrow key navigation)
- [ ] Dismissible elements announce removal via `aria-live` or are handled gracefully by focus management

### Motion & Animation
- [ ] All keyframe animation utilities use the `motion-safe:` prefix (`motion-safe:animate-fade-in`, etc.)
- [ ] Enter animations use the correct utility for the context (fade for inline elements, slide-up for bottom-origin elements, scale-in for centered popover-style elements)
- [ ] Exit animations use CSS `transition` (not `animation`) to allow clean reversal
- [ ] No animation duration exceeds 400ms (Apple HIG: UI animations should feel snappy, not cinematic)
- [ ] `animate-spin` on Spinner components is wrapped with `motion-safe:` where possible; the Spinner is visually degraded (static circle) when motion is reduced

### Component States
- [ ] Default state is defined and implemented
- [ ] Hover state is defined and implemented (desktop only — do not rely on hover for mobile)
- [ ] Active/pressed state is defined and implemented
- [ ] Focus state is defined and implemented (keyboard focus ring)
- [ ] Disabled state is defined and implemented (`opacity-40`, `pointer-events-none`, `bg-muted` for semantic backgrounds)
- [ ] Loading state is defined and implemented where applicable (Button, Spinner)
- [ ] Error state is defined and implemented where applicable (Input, Textarea, Select, Alert)
- [ ] Empty state is considered (Select with no options, tab panel with no content)

### Platform Conventions
- [ ] Bottom sheets on mobile use `rounded-t-xl rounded-b-none w-full` anchored to the bottom edge
- [ ] Destructive actions in modals are placed on the RIGHT (Apple convention — the confirming button, even if destructive, is rightmost)
- [ ] Cancel actions are always on the LEFT in modal footers, using the Secondary button variant
- [ ] Dropdowns close on: option selection, outside click, and Escape key
- [ ] Modals close on: X button click, overlay click (unless critical), and Escape key
