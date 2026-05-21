# Printy Components

Hierarchy:
- Level 1 `constants/*`: design tokens and status helpers.
- Level 2 `base/*`: visual primitives only. No API calls, no page business logic.
- Level 3 `forms/*`: field wrappers and form-specific parents built on base primitives.
- Level 4 `layout/*`: page shells that own backgrounds, chrome, and top-level spacing.
- Level 5 `dashboard/*`, `jobs/*`, `marketing/*`, `printy/*`: domain parents built from base and layout pieces.
- Level 6 `pages/*`: route-sized section components extracted from fat pages as repetition appears.
- Level 7 `pages/*`: thin route files that load data, call stores/composables, and pass props/actions down.

Folder responsibilities:
- `base/*`: pure primitives. If a component could plausibly be reused across public, auth, dashboard, and tracking surfaces, it belongs here.
- `ui/*`: compatibility wrappers only. Prefer `base/*`, `layout/*`, `dashboard/*`, and `jobs/*` for new work. Do not add new business-specific components to `ui/*`.
- `dashboard/*`: authenticated workspace parents such as headers, sections, tables, empty states, timelines, message panels, and action bars.
- `jobs/*`: job-assignment, file, proof, and public-job parents that are still visual-only and emit actions upward.
- `layout/*`: top-level shells and workspace chrome only.
- `pages/client-dashboard/*`, `pages/shop-workspace/*`, `pages/assignment/*`: Level 6 page-section components. These may compose `dashboard/*`, `jobs/*`, and `base/*`, but they must not own API calls, auth, route params, or backend action state.

Route pages should stay thin. If a route starts re-declaring card chrome, panel headers, badge colors, or workspace section spacing, move that upward into the highest existing parent component instead of copying Tailwind again.

Use `BaseButton` for any new CTA or action before adding raw button classes. Prefer variants like `primary`, `secondary`, `dark`, or `outline` instead of page-local colors.

Use `BaseCard` whenever a panel needs the standard Printy border, radius, background, and shadow. Pick `dashboard`, `soft`, `dark`, or `calculator` to match the existing static HTML source language.

Use `BaseInput`, `BaseSelect`, and `BaseTextarea` for new form controls. Switch visual context with `variant="auth"`, `variant="dashboard"`, or `variant="calculator"` instead of re-declaring field borders, spacing, or focus rings.

Use `AuthShell` for login, signup, reset, and other split-screen authentication pages. Put the dark narrative panel in the `side` slot and keep the actual form content in the default slot.

Use `PublicShell` for homepage and other public marketing routes that need the shared header and footer.

Use `DashboardShell` for workspace-style pages that need shared sidebar/topbar ownership. Keep page-specific cards and data sections inside the default slot.

Use `DashboardDetailPanel`, `DashboardActionBar`, and `FileAttachmentList` before hand-building another dashboard panel header plus body wrapper.

Use `DashboardTopbar` and `DashboardSidebar` for repeated authenticated workspace chrome before re-copying header and rail markup into another route.

Use `DashboardDataTable` for repeated workspace tables. Put row rendering in slots, but keep searching, filtering, and backend fetch state in the route.

Use `DashboardFilterBar` when a dashboard table needs a shared search/filter strip instead of another one-off header row.

Use `DashboardEmptyState` for empty workspace panels instead of ad hoc centered placeholder text blocks.

Use `DashboardMessagePanel` for inbox, event, or audit-trail panels that repeat avatar, meta, and body layouts.

Use `DashboardTimeline` for quote-to-production progress rails before hand-building another absolute-positioned step tracker.

Use `JobDetailPanel` for compact assignment or job metadata grids, and `ProofUploadPanel` for managed-job artwork/proof upload shells. Keep the actual upload handlers and API calls in the route.

Use `JobSummaryCard` for compact job overview cards when a page starts repeating title, subtitle, status badge, and small meta rows.

Use `QuoteResponsePanel` for shop quote-builder shells when the page needs shared title/subtitle/error framing around quote response content.

Use `pages/*` components when a route still carries a large unique section that is too specific for `dashboard/*` or `jobs/*` but is large enough to deserve extraction. Keep them focused on one route-sized block, with typed props and upward emits.

Status rule:
- `BaseBadge` is the primitive.
- `dashboard/StatusBadge` is the source-of-truth domain mapper for workflow/status presentation.
- `ui/StatusBadge` is a compatibility wrapper only.
- Add or change status presentation in `constants/design.ts`, then let both badge components consume it.

Table and list rule:
- Use `BaseTable` for primitive data-table rendering.
- Use `DashboardDataTable` when the table needs shared workspace section chrome, empty state, filters, and slot-driven cells.
- If an old component still uses `ui/DataTableShell`, treat it as compatibility and prefer migrating callers upward rather than adding new usages.

Upload and proof rule:
- Keep upload handlers, route params, and API calls in the route or composable.
- Use `ProofUploadPanel` and `FileAttachmentList` for the visual shell only.
- New proof or artwork panels should emit events instead of importing stores or calling endpoints directly.

Page-local markup is acceptable only when:
- the block is unique to one route and there is no second caller yet,
- it mixes multiple backend-only projections that would make a shared component misleading,
- or the source HTML has a one-off presentation that would make the shared system worse if generalized.

Available base variants:
- `BaseButton`: `primary`, `secondary`, `dark`, `light`, `ghost`, `outline`, `danger`, `success`
- `BaseCard`: `default`, `elevated`, `bordered`, `dark`, `soft`, `glass`, `dashboard`, `calculator`
- `BaseAlert`: `default`, `success`, `warning`, `error`, `dark`
- `BaseStatCard`: use for repeated workspace KPI cards before hand-building another summary tile
- `BaseTable`: use for dashboard/public data tables when the row structure is simple
- `BaseBadge`: `default`, `orange`, `dark`, `green`, `red`, `yellow`, `blue`, `gray`, `verified`, `pending`, `accepted`, `rejected`, `active`, `completed`
- `BaseInput` / `BaseSelect` / `BaseTextarea`: `default`, `dark`, `calculator`, `dashboard`, `auth`

Dashboard helpers:
- `DashboardPageHeader`: shared title, subtitle, and action row for authenticated workspaces
- `DashboardCardGrid`: standard 2-up / 4-up stat grid spacing
- `DashboardSection`: standard section chrome for tables, boards, panels, and operational cards
- `DashboardTopbar` / `DashboardSidebar`: shared authenticated workspace chrome
- `DashboardDataTable`: shared table section plus `BaseTable` bridge for slot-driven dashboard rows
- `DashboardFilterBar`: shared search/select strip for workspace tables
- `DashboardEmptyState`: shared empty placeholder for dashboard panels
- `DashboardMessagePanel`: shared thread / event / inbox panel wrapper
- `DashboardTimeline`: shared quote-to-production progress tracker
- `DashboardDetailPanel`: reusable detail-panel wrapper for smaller right-rail and nested workspace cards
- `DashboardActionBar`: action panel wrapper with a standard button row and optional progress mirror

Jobs helpers:
- `JobSummaryCard`: compact job summary card with shared status treatment
- `JobDetailPanel`: shared key/value grid for assignment and job metadata
- `ProofUploadPanel`: shared file list plus upload action shell for artwork and proof flows
- `QuoteResponsePanel`: shared quote-response wrapper for shop workspace panels

When adding a new page:
1. Choose the right shell first: `PublicShell`, `AuthShell`, or `DashboardShell`.
2. Start from the highest fitting parent component that already exists.
3. Compose downward with `BaseCard`, `BaseButton`, `BaseInput`, and `dashboard/StatusBadge`.
4. Keep backend state and API calls in the route or a store/composable, not in base visual components.
5. If two routes repeat the same structure, extract a parent component before adding a third copy.
6. Only add page-local classes when the source HTML has a one-off treatment that does not belong in the shared system.

Adding a status badge:
1. Extend the status key normalization in `constants/design.ts`.
2. Add the visual class and badge variant there.
3. Reuse `dashboard/StatusBadge` in routes and domain components instead of adding route-local class maps.

Adding a dashboard table or list:
1. Use `DashboardDataTable` if the section needs title, subtitle, actions, filters, and empty handling.
2. Keep row mapping in the route.
3. Prefer slots for cell rendering instead of duplicating `<table>` markup in the page.

Adding upload or proof flows:
1. Keep file selection state and API submission in the route.
2. Pass display files and loading booleans into `ProofUploadPanel`.
3. Emit `select` and `upload` events back upward.
