# Printy Phase 2 Visual Foundations

Date: 2026-07-29

Phase status: `COMPLETED`

Scope: investigation and documentation only. No dashboard pages, business logic, APIs, migrations, package files, or implementation components were changed in this phase.

## Audit Inputs

- Phase 0 screenshots in `docs/dashboard-redesign/phase0-screenshots/`.
- `app/assets/css/main.css`
- `app/constants/design.ts`
- `nuxt.config.ts`
- `package.json`
- Shared component primitives under `app/components/base`, `app/components/ui`, and `app/components/dashboard`.
- Dashboard layout/navigation files inspected during Phase 1.

## Current Token State

Printy has useful design ingredients, but they are not yet a reliable system.

- CSS tokens exist in `main.css` through `@theme` and `:root`.
- TypeScript utility constants exist in `app/constants/design.ts`.
- Component primitives encode additional local variants.
- Page files still contain broad hard-coded Tailwind utilities and hex values.
- Nuxt UI is not installed or configured, even though legacy CSS selectors target `data-ui="UButton"`, `UInput`, and `UCard`.

Aggregate scan of `app/**/*.vue`, `app/**/*.ts`, and `app/**/*.css`:

| Pattern | Count |
| -- | --: |
| Hex colors | 1158 |
| Arbitrary Tailwind utilities | 1397 |
| Orange/primary/printy references | 570 |
| Focus utility references | 149 |
| Inline SVG or `v-html` icon usage | 76 |
| Radius utility references | 515 |
| Shadow utility references | 169 |

Top hotspots:

- `app/components/marketing/HomeHeroCalculator.vue`
- `app/pages/dashboard/client/[section]/[id].vue`
- `app/pages/dashboard/client/[section].vue`
- `app/layouts/auth.vue`
- `app/components/auth/ReferenceSignupForm.vue`
- `app/pages/dashboard/settings/profile.vue`

## Key Findings

### Color

There are three overlapping orange systems:

- Flamingo scale in `main.css`: `#fef4ee` through `#410b09`.
- Printy aliases in `main.css`: `#e13515`, `#c12d11`, `#ff5a3a`, and soft variants.
- Semantic primary tokens in `:root`: `#f05224` and `#e13515`.

Recommendation: use `--p-primary: #f05224` as the primary action color, `--p-primary-hover: #e13515` as hover/active, and reserve darker oranges for text on pale orange backgrounds only. Role dashboards should not become role-color themed; neutral surfaces must dominate.

### Neutrals

The app already has strong neutral ingredients through Mirage/slate tokens and Tailwind gray/slate usage. The problem is inconsistent application, not absence.

Recommended neutral set:

| Purpose | Value |
| -- | -- |
| Page background | `#f8fafc` |
| Surface | `#ffffff` |
| Muted surface | `#f3f6fc` |
| Strong text | `#101828` |
| Body text | `#344054` |
| Muted text | `#64748b` |
| Border | `#e2e8f0` |
| Strong border | `#cad8ed` |

### Semantics

Status colors exist in both CSS and `design.ts`, but component/page usage is not fully centralized.

Recommended semantic set:

| State | Text | Surface | Border |
| -- | -- | -- | -- |
| Success | `#15803d` | `#dcfce7` | `#bbf7d0` |
| Warning | `#d97706` | `#fef3c7` | `#fde68a` |
| Error | `#dc2626` | `#fee2e2` | `#fecaca` |
| Info | `#4173b6` | `#e7edf7` | `#c9d7ec` |
| Neutral | `#475569` | `#f1f5f9` | `#cbd5e1` |

Statuses should never rely on color alone. Use labels, dots, icons, and ordering context where helpful.

### Typography

`main.css` imports Inter from Google Fonts, but the theme declares Montserrat for body and heading fonts. This mismatch should be corrected before broad redesign work.

Recommended dashboard typography:

- Use Inter/system for dashboards unless Montserrat is explicitly imported and product-approved.
- Body: 14px to 16px, 400/500 weight.
- Section titles: 16px to 20px, 600/700 weight.
- Page titles: 24px to 32px, 700/800 weight.
- Use `letter-spacing: 0` for future dashboard components. Existing negative heading tracking and positive body tracking should be removed during component harmonization.

### Radius

Current components use `rounded-lg`, `rounded-xl`, `rounded-2xl`, arbitrary radii, and dashboard cards with `radius="xl"`. This makes operational surfaces feel inconsistent.

Recommended radius tokens:

| Purpose | Radius |
| -- | --: |
| Controls | 8px |
| Cards and table containers | 8px |
| Modals and drawers | 12px |
| Pills and badges | 999px |

Retire `rounded-2xl`, `rounded-3xl`, and arbitrary large radii from dashboard surfaces unless a public/marketing page explicitly needs them.

### Shadows

Dashboard pages should use borders and depth sparingly. Current usage includes many arbitrary shadows and hover elevation.

Recommended shadow rules:

- Default dashboard cards: border only or `shadow-sm`.
- Hover states: color/border change before elevation.
- Drawers and modals: one approved overlay shadow.
- Avoid heavy arbitrary shadows in operational dashboards.

### Spacing and Layout

Recommended layout tokens:

| Purpose | Value |
| -- | --: |
| Base spacing unit | 4px |
| Mobile page gutter | 16px |
| Desktop page gutter | 24px |
| Section gap | 24px |
| Compact card padding | 16px |
| Standard card padding | 20px |
| Dense table row minimum | 44px |
| Button/input height | 40px |
| Primary touch target | 44px |

Responsive behavior should prioritize dense, scannable operational layouts over marketing-style hero/card composition.

### Controls

`BaseButton` supports brand, role, semantic, neutral, and dark variants. `UiButton` does not expose the same role variants. `BaseInput` uses hard-coded hex values and `v-html` icons.

Canonical direction:

- `BaseButton`, `BaseInput`, `BaseCard`, `BaseBadge`, `BaseModal`, and `BaseTable` become the canonical primitives.
- `Ui*` wrappers should either pass through cleanly to `Base*` or be deprecated during Phase 4.
- Role-colored button variants should be retired from dashboards; role context belongs in navigation/labels, not core action styling.
- Inputs and buttons should share 40px/44px height rules and consistent `focus-visible` rings.

### Icons

No icon package is installed. The app uses a custom `DashboardIcon` registry plus many raw inline SVGs. The registry currently falls back silently when an unknown icon name is requested.

Canonical direction:

- Use one icon source.
- Preferred Phase 4 option: add `lucide-vue-next` if dependency approval is acceptable.
- Dependency-free option: keep `DashboardIcon`, expand it with typed names, remove raw page-local SVGs, and avoid `v-html` where practical.
- Add missing names introduced by shared navigation before Phase 3/4 screenshots.

### Modals, Drawers, and Rails

`BaseModal` supports centered modals and right drawers with Escape close and body scroll lock, but it does not yet provide a complete focus trap or focus return.

Recommended dimensions:

| Pattern | Desktop width | Mobile |
| -- | --: | -- |
| Right rail | 320px to 360px | Hidden/collapsed |
| Small drawer | 420px | Full width |
| Standard drawer | 560px | Full width |
| Complex drawer | 720px max | Full screen |
| Center modal | 480px to 640px | 16px gutter |

Preview/details experiences should use Gmail-like drawers or modals inside the dashboard shell, not external dashboard escape routes.

### Legacy Visual Effects

Global `body::before` and `body::after` create radial gradient/orb backgrounds. Treat these as legacy public/auth styling. Future dashboard work should remove or contain those effects so operational pages stay quiet and clear.

## Token Proposal

CSS should be the canonical token source. TypeScript constants should map to CSS token names or semantic classes instead of owning separate values.

Recommended canonical token groups:

- `--p-primary`, `--p-primary-hover`, `--p-primary-soft`, `--p-primary-border`
- `--p-bg`, `--p-surface`, `--p-surface-muted`
- `--p-text`, `--p-text-body`, `--p-text-muted`
- `--p-border`, `--p-border-strong`
- `--p-success-*`, `--p-warning-*`, `--p-error-*`, `--p-info-*`
- `--p-radius-control`, `--p-radius-card`, `--p-radius-overlay`, `--p-radius-pill`
- `--p-shadow-card`, `--p-shadow-overlay`
- `--p-control-sm`, `--p-control-md`, `--p-control-lg`
- `--p-focus-ring`

## Implementation Order

1. Phase 3: apply shell/rail/drawer dimensions and remove dashboard escape behavior.
2. Phase 4: canonicalize shared components and move repeated local values into tokens.
3. Phase 5: centralize status semantics and badge/timeline styling.
4. Phases 7 to 10: apply role-dashboard layouts using the canonical primitives.
5. Phase 12: run full contrast, keyboard, responsive, and visual regression pass.

## Decisions Resolved

- VS-001: tokens exist, but CSS must become canonical and TS constants must stop diverging.
- VS-002: arbitrary utility repetition is high enough to require consolidation.
- VS-003: Base primitives become canonical; Ui wrappers are compatibility/pass-through or are deprecated.
- VS-004: Nuxt UI is not centrally configured; do not build Phase 3/4 around Nuxt UI unless the package is intentionally reintroduced.
- VS-005: one icon language is required; prefer lucide with approval or typed `DashboardIcon` without raw page-local SVG.
- VS-006: use a disciplined orange scale centered on `#f05224` and `#e13515`.
- VS-007: token defaults should meet contrast expectations; page-level failures remain a Phase 12 verification item.
- DD-004: right rail and drawer dimensions are defined above for implementation in Phase 3 and Phase 6.

## Phase 2 Stop Point

Stop after this audit. Do not begin Phase 3 until explicitly requested.
