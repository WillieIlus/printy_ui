# Printy Phase 3 Shell Contract

Date: 2026-07-29

Phase status: `COMPLETED`

Scope: shared dashboard shell behavior only. No payment, pricing, quote-prep, production action, backend, database, package, auth, or permission behavior was changed.

## Shell Ownership

`RoleDashboardFrame` is the canonical role-dashboard shell.

Pages that render `RoleDashboardFrame` must use:

```ts
definePageMeta({ layout: false, middleware: 'auth' })
```

This prevents duplicate sidebars or topbars from combining a Nuxt dashboard layout with the role shell.

Fallback layouts remain available for utility pages that do not render `RoleDashboardFrame`:

- `app/layouts/dashboard.vue`
- `app/layouts/dashboard-client.vue`

`dashboard-client.vue` now reads client navigation from `dashboardNavForRole('client')` so it follows the shared route/navigation contract.

## Shell Surface Rules

Route shell behavior is defined in `dashboardShellSurfaceForPath()` in `app/shared/dashboard-navigation.ts`.

| Surface | Examples | Right rail |
| -- | -- | -- |
| Overview | `/dashboard/client`, `/dashboard/partner`, `/dashboard/production`, `/dashboard/admin` | Allowed |
| Collection | `/dashboard/client/quotes`, `/dashboard/partner/jobs`, `/dashboard/production/assignments` | Allowed until preview drawer opens |
| Complex workflow | detail routes such as `/dashboard/client/quotes/:id`, `/dashboard/partner/jobs/:id`, `/dashboard/production/assignments/:id`, breakdown pages | Hidden |
| Utility | `/dashboard/track-job`, `/dashboard/track-job/:token`, `/dashboard/settings/**` | Hidden |

## Rail Contract

`RoleDashboardFrame` exposes a `#rail` slot.

Rail behavior:

- Visible on desktop only when the current route surface allows it.
- Width target: 320px to 360px.
- Hidden on mobile and complex workflow routes.
- Hidden whenever a preview drawer is open.
- Intended for current job, next action, queue context, setup gaps, blockers, or operational summary.
- Must stay lighter than the central workspace.

Override escape hatch:

- `rail-mode="auto"` uses route rules.
- `rail-mode="show"` forces the rail when a page has a valid reason.
- `rail-mode="hide"` suppresses it.

## Preview Drawer Contract

`RoleDashboardFrame` exposes a `#previewDrawer` slot controlled by:

- `preview-drawer-open`
- `preview-drawer-label`
- `preview-drawer-width`

Widths:

- `sm`: 420px
- `md`: 560px
- `lg`: 720px

Preview drawer behavior:

- Replaces the right rail.
- Uses a right-side Gmail-like surface on desktop.
- Uses full width on mobile.
- Closes through `update:previewDrawerOpen` and `closePreviewDrawer`.
- Supports Escape close.

## Accessibility Hooks

The shell now includes:

- `data-dashboard-shell="role"`
- `data-shell-surface`
- `data-rail-visible`
- `data-preview-drawer-open`
- Skip link to `#dashboard-main`
- `aria-label` on navigation, workspace, rail, search, notification, and profile controls
- `aria-current="page"` on active nav links
- `aria-disabled` on disabled nav links

Full focus-trap and route-by-route keyboard verification remain Phase 12 work.

## Initial Data Decision

No new aggregate endpoint is required for Phase 3.

Rail and preview content should use existing page/dashboard payloads first. Add a backend endpoint only in later role phases if a specific page proves it cannot render the needed context from existing data.

## Phase 3 Stop Point

Stop after this shell contract and implementation. Do not begin Phase 4 until explicitly requested.
