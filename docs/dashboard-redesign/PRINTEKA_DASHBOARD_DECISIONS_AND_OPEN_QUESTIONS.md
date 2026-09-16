# Printy Dashboard Decisions and Open Questions

This file is the authoritative source for approved dashboard redesign decisions, temporary route decisions, open questions, deferred decisions, and product-owner questions.

Future `NEXT PHASE` work must read this file before making code changes. Decisions recorded here supersede chat history. Do not remove resolved decisions; append amendments when facts change.

## Related Files

- `PRINTY_DASHBOARD_LEAN_AUDIT.md`: explains the current system, friction, evidence, and why changes are needed.
- `PRINTY_DASHBOARD_INFORMATION_HIERARCHY.md`: defines the target information hierarchy by role and surface.
- `PRINTY_DASHBOARD_CHANGE_PHASES.md`: master phase sequence, dependencies, status, and phase scope.
- `PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`: append-only execution history for documentation setup and later phases.

## Closed Decisions

### 1. Dashboard Structure

Authenticated role dashboards use this mental model:

- Persistent left navigation: where the user is.
- Central workspace: what the user is working on.
- Contextual right rail: what matters next.

The right rail must remain lighter and quieter than the central workspace. It must not become a second dashboard full of unrelated cards.

### 2. Tracking

For authenticated clients:

- Tracking is primarily shown in the client dashboard right rail.
- The Jobs collection contains all jobs.
- Selecting a job may open a preview drawer.
- Complex job information opens `/dashboard/client/jobs/:id`.
- Tracking is part of job detail, not a separate normal destination.
- `/dashboard/track-job` may remain only as a utility lookup route or compatibility route.
- Track Job must not appear as a primary left-navigation item.

For signed-out or shared links:

- Preserve `/track-job/:token` if shared tracking is supported.
- Public tracking may expose only tracking reference, broad status, current stage, next expected step, estimated completion where available, and safe support route.
- Public tracking must not expose client identity, private contact information, manager notes, print-shop identity, internal pricing, payout details, documents, or private messages.

### 3. Manager Terminology

Use `Manager` consistently in user-facing navigation, headings, buttons, instructions, notifications, status messages, empty states, and help text.

The internal route may remain `/dashboard/partner/...` temporarily if changing it would create unnecessary regression risk. Route stability and user-facing terminology do not have to change at the same time.

### 4. Redirects and Aliases

Old manager or shop paths should be redirects only. Do not maintain duplicate role interfaces.

### 5. Collection Pages

Create dedicated collection pages for real operational objects, not for individual statuses.

Operational collections include quote requests, quotations, jobs, payments, messages, clients, managers, print shops, production assignments, notifications, and disputes.

Statuses such as needs action, waiting, active, blocked, completed, and cancelled should be filters or tabs inside the collection unless the underlying workflow is genuinely different.

### 6. Drawer, Modal, and Full Page Boundary

- Drawer: contextual record preview and supporting information while preserving list context.
- Modal: focused decision, compact form, confirmation, or one-step action such as M-Pesa STK prompt.
- Full page: multi-step work, complex editing, quote preparation, payment history, artwork approval, dispatch, production workflow, pricing/rate cards, disputes, long messages, audit history, or several files.

### 7. Right Rail and Preview Drawer Contract

- Dashboard overview: show contextual right rail.
- Collection with no selected record: show queue or action context in the right rail.
- Collection with selected row: preview drawer replaces the normal right rail.
- Never display a context rail and preview drawer simultaneously.
- Complex workflow page: hide the persistent right rail where it would compress the workspace.
- Complex pages may use a narrow internal sticky next-action panel.
- Mobile preview uses a full-screen drawer, bottom sheet, or equivalent responsive surface.
- Never force mobile into three columns.

### 8. Progress and Next Actions

One shared workflow system must support completed, current, next, waiting, blocked, and cancelled states.

Completed steps remain readable but visually muted. The strongest non-error emphasis belongs to the next action required from the current user.

Every current, waiting, or blocked state must explain:

- Who is responsible.
- What action is required.
- When it is expected, where known.
- What happens next.

Do not display technical status codes directly to normal users.

### 9. Visual Direction

Orange remains Printy's primary brand color.

Orange should primarily indicate brand identity, primary action, active navigation, selected state, important progress emphasis, and controlled highlights.

Orange must not be used simultaneously on every border, icon, badge, heading, background, card, and link. Neutral colors should dominate the dashboard.

The visual system must use restrained and consistent borders, radius values, shadows, spacing, typography, highlights, button variants, input styles, table density, modal dimensions, drawer dimensions, status colors, and focus states.

### 10. Administration

The initial admin dashboard should prioritize operational exceptions rather than broad vanity metrics.

Prioritize failed or stale M-Pesa attempts, paid jobs awaiting dispatch, unassigned work, blocked production assignments, disputes, notification failures, shop setup gaps, and permission or access anomalies.

Do not automatically implement every possible admin directory merely because it appears in a proposed navigation structure.

### 11. Quote Preparation

The full quote page should become the canonical complex quote workspace.

Before moving quote preparation:

- Investigate whether drafts are autosaved.
- Identify state currently stored only in component memory.
- Protect pricing calculations.
- Protect the approved Printy fee formula.
- Protect manager markup.
- Protect shop selection.
- Protect client selection.
- Protect quote sending.
- Protect M-Pesa and payment-related behavior.
- Prevent draft loss during navigation or refresh.

Do not migrate quote preparation until state-loss risks are documented and addressed.

### 12. Implementation Order

The redesign must proceed:

1. Regression baseline.
2. Visual and architectural foundations.
3. Shared shell and navigation.
4. Canonical shared components.
5. Shared progress and status semantics.
6. Collection, preview drawer, and modal behavior.
7. Client dashboard.
8. Manager dashboard.
9. Print-shop and production dashboard.
10. Admin and public utility pages.
11. Complex workflow migration.
12. Responsive and accessibility refinement.
13. Complete regression verification and cleanup.

## Temporary Decisions

| ID | Decision | Rationale | Review phase | Status |
| -- | -------- | --------- | ------------ | ------ |
| TD-001 | Keep `/dashboard/partner/...` as the temporary technical route while displaying `Manager` in the UI. | Route migration may create avoidable regressions. | Phase 1 | CONFIRMED |
| TD-002 | Keep `/dashboard/track-job` only as utility/compatibility, not primary navigation. | Avoids duplicating Jobs and right-rail tracking. | Phase 1 | CONFIRMED |
| TD-003 | Public tracking tokens are preserved through the dashboard utility route and public API endpoints with minimal safe data. | Shared links may be product-critical, but frontend display and backend serializer evidence must stay privacy-safe. | Phase 10 | CONFIRMED |

## Deferred Decisions

| ID | Decision | Deferred until | Reason | Status |
| -- | -------- | -------------- | ------ | ------ |
| DD-001 | Whether to migrate `/dashboard/partner/...` to `/dashboard/manager/...`. | After Phase 1 route audit and route tests. | User-facing terminology can improve before technical route migration. | DEFERRED |
| DD-002 | Whether admin broad directories should be implemented. | Phase 11 or later, with permission tests. | Phase 10 kept admin exception-first and did not add broad directories. | DEFERRED |
| DD-003 | Whether quote preparation can move fully out of the current modal/section. | Phase 8 or Phase 11 after draft investigation. | State-loss and pricing/payment behavior risk. | DEFERRED |
| DD-004 | Exact right-rail and drawer dimensions. | Phase 2 visual foundations. | Right rail target is 320-360px desktop; drawer widths are 420px small, 560px standard, 720px complex, mobile full width/full screen. | RESOLVED |

## Product-Owner Questions

| ID | Question | Approved default | Phase to resolve | Status |
| -- | -------- | ---------------- | ---------------- | ------ |
| PO-001 | Is signed-out tracking a public marketing/product surface or only a compatibility utility? | Preserve the dashboard utility route and public API-backed minimal token view until product input changes it. | Phase 10 | DEFERRED |
| PO-002 | Which admin exception categories are operationally required on day one? | M-Pesa failures, paid jobs awaiting dispatch, unassigned work, blocked assignments, disputes, notifications, setup gaps, permission anomalies. | Phase 10 | DEFAULT APPLIED |
| PO-003 | Should broad admin directories be visible if they exist but are not part of current operations? | Keep secondary or hidden. | Phase 10 | DEFAULT APPLIED |

## Open Questions Table

| ID | Question | Current evidence | Recommended default | Requires code investigation | Requires product-owner answer | Phase to resolve | Status | Final decision |
| -- | -------- | ---------------- | ------------------- | --------------------------- | ----------------------------- | ---------------- | ------ | -------------- |
| PT-001 | Does the current public token endpoint expose any sensitive fields? | `ManagedJobPublicTrackingSerializer` fields are limited to `tracking_reference`, `job_status`, `estimated_ready`, and `next_action`; frontend token detail also ignores sensitive fields. | Minimal safe tracking only. | Yes | No | Phase 0/10 | RESOLVED | Public managed-job tracking stays minimal in backend serializer and frontend display. |
| PT-002 | Does public tracking currently reveal the client name? | Backend public serializer does not include client fields; frontend detail does not render client identity. | Do not reveal client identity. | Yes | No | Phase 0/10 | RESOLVED | No client identity is exposed by the public managed tracking serializer or token detail page. |
| PT-003 | Does public tracking reveal shop identity? | Backend public serializer does not include shop fields; frontend detail uses a fixed `Private production partner` label and does not read `assigned_shop_name` or `shop_name`. | Do not reveal shop identity publicly. | Yes | No | Phase 0/10 | RESOLVED | Shop identity remains hidden in public tracking. |
| PT-004 | Does public tracking reveal payment state or amounts? | Backend public serializer does not include payment fields or amounts; frontend detail no longer reads `payment_status`. | Do not reveal payment amount publicly. Broad payment readiness only if required. | Yes | Possibly | Phase 0/10 | RESOLVED | Payment status and amounts are not rendered on the public token detail surface. |
| PT-005 | Are token values sufficiently unguessable? | `ManagedJob.tracking_token` is a unique `UUIDField` with `default=uuid.uuid4`; legacy endpoint behavior remains separate. | Tokens must be high-entropy and non-sequential. | Yes | No | Phase 0/10 | RESOLVED | Managed-job public tokens use UUID4 and are unique. |
| PT-006 | Does the public route use `noindex`? | Dashboard tracking entry and token detail both set `robots: 'noindex,nofollow,noarchive'`. | Public tracking pages should be `noindex`. | Yes | No | Phase 10 | RESOLVED | Tracking utility pages are noindexed. |
| PT-007 | Are expired, invalid, cancelled, or reused tokens handled safely? | Invalid tokens use the page error state and backend 404 path; there is no expiry/reuse policy in the inspected frontend scope. | Fail closed with generic messages. | Yes | No | Phase 0/10 | DEFERRED | Expiry/reuse policy remains backend/product work; frontend displays a generic unavailable state. |
| PT-008 | Should authenticated token visits redirect to the client job page? | Phase 10 kept `/dashboard/track-job/:token` as a privacy-safe utility page and did not add ownership redirect logic. | Redirect when the authenticated user owns the job; otherwise show safe view. | Yes | Possibly | Phase 11 or later | DEFERRED | Owner redirect remains a workflow enhancement; current safe utility view is preserved. |
| MT-001 | Which files display Partner instead of Manager? | Phase 1 grep found visible Partner copy in Manager dashboard pages and admin nav; dashboard visible copy was changed to Manager while technical routes/API fields stayed partner. | Change visible copy to Manager where safe. | Yes | No | Phase 8 | RESOLVED | Dashboard role UI now uses Manager; remaining backend/model/technical partner terms are implementation names or deferred workflow internals. |
| MT-002 | Which API serializers or notifications use Partner? | Phase 1 updated notification target URL construction; no notification visible text change was required in the serializer. | Use Manager in visible text. | Yes | No | Phase 8 | RESOLVED | Notification targets are role-aware dashboard URLs; broader message copy remains deferred to role dashboard/content phases. |
| MT-003 | Can user-facing copy change without changing technical route names? | Phase 1 changed dashboard-visible Partner copy to Manager while preserving `/dashboard/partner/**` technical routes and `/dashboard/manager/**` redirects. | Yes, keep routes stable initially. | Yes | No | Phase 1 | RESOLVED | Yes. User-facing Manager terminology is decoupled from the partner route namespace. |
| MT-004 | Are tests coupled to the Partner label? | Phase 1 route-contract tests passed after visible copy changed to Manager; existing quote/pricing tests still pass. | Update tests only where visible copy intentionally changes. | Yes | No | Phase 8 | RESOLVED | No blocking Phase 1 coupling found. Future workflow copy changes should update tests only where visible text intentionally changes. |
| MT-005 | Are there duplicate Manager and Partner routes or components? | Phase 1 confirmed `/dashboard/manager/**` aliases redirect to `/dashboard/partner/**`; `/dashboard/shop/**` aliases redirect to `/dashboard/production/**`. | Redirect only; no duplicate UI. | Yes | No | Phase 1 | RESOLVED | Manager and shop paths remain redirect-only aliases; no duplicate Manager/Partner interface was added. |
| RR-001 | Which routes have enough screen width for a persistent right rail? | Phase 3 added route-aware shell surface rules in `dashboardShellSurfaceForPath()`. | Overview and collection routes can show the rail; complex workflow and utility routes hide it. | Yes | No | Phase 3 | RESOLVED | Implemented as the `#rail` slot on `RoleDashboardFrame`; preview drawer suppresses the rail. |
| RR-002 | Which complex pages must hide the rail? | Detail routes for quotes, jobs, assignments, tracking utility, settings, and breakdown pages need full workspace width. | Hide the persistent rail on complex workflow and utility surfaces. | Yes | No | Phase 3/11 | RESOLVED | Route rules classify these as `complex` or `utility`; later workflow pages can still use internal sticky panels where appropriate. |
| RR-003 | What information is available from existing dashboard APIs for the rail? | Phase 3 shell does not require new data; existing page/dashboard payloads can feed initial rail and preview content. | Use existing data first; add aggregate endpoint only when a later role phase proves a specific gap. | Yes | No | Phase 3/7/8/9 | RESOLVED | Initial shell data need is frontend-only; page-specific data gaps remain deferred to role phases. |
| RR-004 | Would the rail require new aggregate endpoints? | Phase 3 established rail/drawer slots without backend dependencies. | No aggregate endpoint for Phase 3. Reconsider only after Phase 7/8/9 identify a concrete missing payload. | Yes | No | Phase 3/7 | RESOLVED | Backend remains unchanged. |
| RR-005 | How should several active jobs be prioritized? | Phase 7 client overview uses unpaid payment, quote decision/payment, then active job upload/proof/tracking from existing payloads. | Client overview prioritizes current-user required action first; broader role algorithms remain role-specific in later phases. | Yes | No | Phase 7 | RESOLVED | Client overview only. |
| RR-006 | What happens when there is no active job? | Phase 7 client overview falls back to quote creation and a quiet rail empty state. | Show quote-start as the primary next action and explain that accepted work creates the job timeline. | Yes | No | Phase 7 | RESOLVED | Client overview only. |
| QD-001 | Is quote preparation autosaved? | Quote prep remains in `partner/[section].vue`; explicit Save Draft persists through `createPartnerQuote(...save_as_draft)`, but there is no automatic autosave evidence. | Do not migrate quote prep based on autosave; keep explicit draft save and current modal boundary. | Yes | No | Phase 8/11 | RESOLVED | Full autosave remains absent/non-required for Phase 8. |
| QD-002 | What quote-prep state is currently local-only? | Quote prep keeps modal state for specs, selected shop, pricing preview, markup, client search/selection, new-client form, and send errors. | Treat unsaved in-progress modal edits as local-only until Save Draft or Send creates persisted quote data. | Yes | No | Phase 8/11 | RESOLVED | State documented for future Phase 11 migration. |
| QD-003 | Can refresh, navigation, or auth refresh erase work? | In-progress modal refs/reactive state are local; explicit draft save persists before close, and send creates a draft before sending. | Keep quote prep in the modal/quote route and warn future migration to preserve drafts before navigation. | Yes | No | Phase 8/11 | RESOLVED | Manual refresh test still deferred, but code risk is identified. |
| QD-004 | Is there an existing draft API? | Existing `createPartnerQuote` posts to the partner quote-create endpoint and is called with `save_as_draft: true`. | Reuse existing draft creation; no new backend endpoint or migration in Phase 8. | Yes | No | Phase 8/11 | RESOLVED | Backend draft shape not changed. |
| QD-005 | Are unsent quotations already persisted? | Save Draft calls `createPartnerQuote(buildPartnerQuotePayload({ save_as_draft: true }))`; Send creates a draft first, then calls `sendPartnerQuoteToClient`. | Unsent quotations are persisted only after explicit save/send actions; unsaved modal edits remain local. | Yes | No | Phase 8/11 | RESOLVED | Future migration must preserve this boundary. |
| QD-006 | Can quote preparation safely move to a full page? | Draft APIs exist, but unsaved modal state and pricing/client-selection state are still local and complex. | Do not move quote preparation to a full page in Phase 8; defer any migration to Phase 11 with state preservation tests. | Yes | No | Phase 8/11 | RESOLVED | Phase 8 keeps the existing modal. |
| AS-001 | Which admin operational exception endpoints already exist? | Existing `fetchAdminDashboard()` payload includes payment monitor statuses/latest transactions, latest jobs, production summary, shops needing attention, and recent users. | Use existing endpoints first. | Yes | No | Phase 10 | RESOLVED | Phase 10 uses the existing admin dashboard endpoint; no new backend endpoint was needed. |
| AS-002 | Which proposed collections are required for current work? | Phase 10 source contract keeps admin focused on exception groups and secondary controls only. | Defer broad directories. | Yes | Yes | Phase 10 | RESOLVED | No broad admin collection was required for this phase. |
| AS-003 | Which navigation items are currently disabled? | Phase 1 found disabled admin entries for Revenue, MPESA, Quotes, Jobs, Clients, Partners, Production Shops, Samples, Pricing, System Health, and Settings. | Remove/hide disabled entries until real. | Yes | No | Phase 10 | RESOLVED | Disabled placeholders were removed from admin primary nav and replaced with exception-first labels from the shared route contract. |
| AS-004 | Which pages would require new backend permissions? | New admin directories were not added; existing admin dashboard permission gate remains `auth.canAccessAdminDashboard`. | Do not add pages without permission tests. | Yes | No | Phase 10 | RESOLVED | No new backend permission surface was introduced. |
| AS-005 | Which directories should be deferred? | Users, clients, managers, shops, samples, system health, and other broad directories remain hidden/secondary. | Defer unless operationally required. | Yes | Yes | Phase 10 | RESOLVED | Broad admin directories remain deferred. |
| SS-001 | Where are status mappings currently duplicated? | Phase 5 found shared constants plus component/page-local labels and timeline classes. | Centralize new dashboard work on `printyWorkflowSemantic()` and `printyTimelineSemantic()`. | Yes | No | Phase 5 | RESOLVED | Core semantic mapping now lives in `app/constants/design.ts`; broad page-local cleanup remains deferred. |
| SS-002 | Are the same backend states presented differently by role? | Yes. Existing role pages use local labels/styles, but shared components now expose a common state projection. | Use completed/current/next/waiting/blocked/cancelled across roles. | Yes | No | Phase 5 | RESOLVED | Role-specific page adoption remains later-phase work; the shared language is defined. |
| SS-003 | Which technical states require user-friendly labels? | Quote, payment, production, proof, urgency, and generic statuses map through existing label helpers plus workflow semantics. | Keep backend codes internal; show semantic labels and responsibility text. | Yes | No | Phase 5 | RESOLVED | `StatusBadge`, `DashboardTimeline`, and `WorkflowNextAction` consume user-facing labels. |
| SS-004 | Can frontend mapping handle this safely? | Phase 5 added frontend mapping with domain context and tests for payment, urgency, quote, and production examples. | Yes for initial shared semantics. Add backend projection only for proven missing responsibility/deadline data. | Yes | No | Phase 5 | RESOLVED | Covered by `tests/components/workflowSemantics.test.ts`. |
| SS-005 | Is a backend status projection needed? | Phase 5 implementation did not require backend changes. | No backend projection for Phase 5. Reconsider in role phases if a concrete payload gap appears. | Yes | No | Phase 5 | RESOLVED | Backend state machines and serializers remain unchanged. |
| VS-001 | Does Printy already have reliable design tokens? | Phase 2 found CSS tokens and TS constants, but they diverge and page-local values remain broad. | Make CSS the canonical token source and map TS/constants/components to it. | Yes | No | Phase 2 | RESOLVED | Existing tokens are useful but not reliable until consolidated; see `PRINTY_PHASE_2_VISUAL_FOUNDATIONS.md`. |
| VS-002 | Which arbitrary Tailwind color, spacing, radius, and shadow values are repeated? | Phase 2 aggregate scan found 1158 hex colors, 1397 arbitrary utilities, 515 radius utilities, and 169 shadow utilities. | Consolidate repeated values into tokens/classes/components. | Yes | No | Phase 2 | RESOLVED | Highest hotspots are marketing/auth and older client dashboard files; dashboard components also hard-code local variants. |
| VS-003 | Which components have conflicting variants? | Phase 4 canonicalized core Base* primitives and aligned UiButton/UiCard as compatibility wrappers. | Base* primitives are canonical; Ui* wrappers pass through instead of owning a separate visual language. | Yes | No | Phase 2/4 | RESOLVED | Implemented for core primitives in `PRINTY_PHASE_4_COMPONENT_CONTRACT.md`; broad page-local cleanup remains deferred. |
| VS-004 | Is Nuxt UI configured centrally? | `@nuxt/ui` is not installed and `nuxt.config.ts` does not configure it, though legacy CSS targets U* data attributes. | Do not base Phase 3/4 on Nuxt UI unless the dependency is intentionally reintroduced. | Yes | No | Phase 2 | RESOLVED | Treat U* CSS selectors as legacy defensive styling. |
| VS-005 | Are multiple icon libraries present? | Phase 4 kept the dependency-free `DashboardIcon` registry and removed raw `v-html` icon rendering from `BaseInput`; no icon package was added. | New component icon props should avoid raw HTML; migrate to lucide or typed SVG registry only with approval. | Yes | No | Phase 2/4 | RESOLVED | Missing shared-nav icon names were added in Phase 3; full icon-system replacement remains deferred. |
| VS-006 | Which orange shades are currently used? | Phase 2 found overlapping flamingo, printy alias, and primary orange systems. | Center the dashboard scale on `#f05224` primary, `#e13515` hover, pale orange surfaces, and restrained dark-orange text. | Yes | No | Phase 2 | RESOLVED | Role dashboards should remain neutral-first rather than orange-heavy. |
| VS-007 | Which combinations fail accessible contrast? | Phase 2 identified token-level contrast risks from hard-coded colors, color-only statuses, focus inconsistencies, and legacy effects. | Use contrast-safe tokens by default; run full page-level accessibility verification in Phase 12. | Yes | No | Phase 2/12 | RESOLVED | Phase 2 resolves the token defaults; exhaustive route-by-route failures remain Phase 12 work. |

## Blocker Protocol Summary

Investigate repository evidence before stopping. Use approved defaults where safe. Mark a phase `BLOCKED` only when a required business decision has no safe default, proceeding could expose or destroy data, auth/permission safety would weaken, required credentials/infrastructure are unavailable, the repo is unsafe, or a dependency genuinely failed.
