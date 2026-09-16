# Printy Dashboard Implementation Feedback

This is an append-only implementation record.

Codex must never delete or rewrite earlier phase records except to correct a clearly identified factual error. Corrections must be recorded as amendments rather than silently replacing history.

## Protocol Setup: Documentation Initialization

### Execution date
2026-07-27

### Starting repository state
- Branch: `printy_ui` main tracking origin/main; `printy_api` main tracking origin/main.
- Commit: `printy_ui` 57e6794; `printy_api` 71b8c33.
- Working tree state: both `printy_ui` and `printy_api` clean before documentation setup verification.

### Phase status
COMPLETED

### Objective
Create persistent repository-controlled dashboard redesign documentation so future `NEXT PHASE` commands can be executed by reading files rather than chat history.

### Files read
- `C:\Users\Admin\Projects\printy\prompt.txt`
- `C:\Users\Admin\Projects\printy\PRINTY_DASHBOARD_LEAN_AUDIT.md`
- `C:\Users\Admin\Projects\printy\PRINTY_DASHBOARD_INFORMATION_HIERARCHY.md`
- `C:\Users\Admin\Projects\printy\PRINTY_DASHBOARD_CHANGE_PHASES.md`

### Files changed
- `C:\Users\Admin\Projects\printy\PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`
- `C:\Users\Admin\Projects\printy\PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`
- `C:\Users\Admin\Projects\printy\PRINTY_DASHBOARD_LEAN_AUDIT.md`
- `C:\Users\Admin\Projects\printy\PRINTY_DASHBOARD_INFORMATION_HIERARCHY.md`
- `C:\Users\Admin\Projects\printy\PRINTY_DASHBOARD_CHANGE_PHASES.md`

### Backend changes
None.

### Frontend changes
None.

### Database or migration changes
None.

### Design decisions applied
- Dashboard model: left navigation, central workspace, contextual right rail.
- Authenticated tracking belongs in job context and right rail, not primary left navigation.
- Public `/track-job/:token` should be preserved only with minimal safe data if shared tracking is required.
- Right rail is replaced by preview drawer when a collection row is selected.
- Complex workflows hide the persistent rail where it would compress work.
- User-facing role terminology is Manager, even if technical route remains `/dashboard/partner` temporarily.
- Progress must show state plus responsibility, action, expected time where known, and next outcome.
- Admin starts exception-first.
- Quote preparation cannot migrate until draft/state-loss risk is investigated.
- Phase 0 baseline is mandatory before implementation.

### Open questions investigated
No code investigation was performed in this setup run beyond reading existing documentation. Open questions were classified and recorded for future phases.

### Questions resolved
- The master phase sequence is recorded.
- The authoritative decisions file is established.
- The append-only feedback protocol is established.

### Questions still open
See `PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md` for public tracking, Manager terminology, right rail, quote drafts, admin scope, status semantics, and visual system questions.

### Tests run
- Command: `git status --short --branch` in `printy_ui`
- Result: clean, `## main...origin/main`
- Failures: none
- Warnings: none

- Command: `git rev-parse --short HEAD` in `printy_ui`
- Result: `57e6794`
- Failures: none
- Warnings: none

- Command: `git status --short --branch` in `printy_api`
- Result: clean, `## main...origin/main`
- Failures: none
- Warnings: none

- Command: `git rev-parse --short HEAD` in `printy_api`
- Result: `71b8c33`
- Failures: none
- Warnings: none

### Manual verification performed
- Confirmed documentation files exist or were created in `C:\Users\Admin\Projects\printy`.
- Confirmed no app code changes were made in `printy_ui` or `printy_api` during the setup run.

### Screenshots captured
None. Phase 0 was not started.

### Existing functionality verified
No runtime functionality was verified. This was a documentation setup run only.

### Regressions found
None found during documentation setup. No application code was changed.

### Fixes completed
- Created the decisions/open-questions authority file.
- Created this append-only feedback file.
- Updated dashboard audit, hierarchy, and phase files to cross-reference the authority files and one master phase sequence.

### Items not completed
- What remains: Phase 0 regression and visual baseline.
- Why it remains: the prompt explicitly says do not begin Phase 0 during this run.
- Whether it blocks the next phase: yes, Phase 0 is the next phase and must complete before implementation work.
- Recommended resolution: run Phase 0 only after the user explicitly instructs `NEXT PHASE` or otherwise approves Phase 0.

### Risks introduced
No application risks introduced. Documentation risk only: future agents must follow the repository files and not chat memory.

### Rollback information
Documentation-only changes can be reviewed or reverted independently. App repositories remained clean during setup verification.

### Definition-of-done assessment
Completed for documentation setup. Phase 0 not started.

### Recommended next phase
Phase 0: Regression and Visual Baseline.

### Stop point
Stop after documentation setup. Do not implement code and do not start Phase 0.
## Recovery Amendment: Phase Feedback Reconstruction

Date: 2026-07-29

During Phase 3 feedback cleanup, this working-copy file was accidentally truncated before the Phase 3 build result could be recorded. The committed base content above was restored from Git, and the Phase 0 through Phase 3 records below were reconstructed from the repository phase documents, current working tree, test output, and phase summaries available in this run.

This amendment records the repair explicitly so the append-only feedback history is not silently rewritten.

## Phase 0: Regression and Visual Baseline

Status: `COMPLETED`

Date: 2026-07-29

### Scope completed
- Captured the dashboard regression and visual baseline before implementation phases.
- Recorded baseline findings in `PRINTY_PHASE_0_BASELINE.md`.
- Captured Phase 0 screenshot artifacts under `docs/dashboard-redesign/phase0-screenshots/`.
- Updated the master phase tracker to mark Phase 0 complete.

### Files changed
Frontend docs only:
- `docs/dashboard-redesign/PRINTY_PHASE_0_BASELINE.md`
- `docs/dashboard-redesign/phase0-screenshots/`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_CHANGE_PHASES.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`

### Tests run
- Baseline commands and screenshot capture are recorded in `PRINTY_PHASE_0_BASELINE.md`.

### Definition-of-done assessment
Met for Phase 0: regression baseline and visual evidence were captured before route, shell, and visual-system implementation.

### Stop point
Stopped after Phase 0 before beginning Phase 1.

## Phase 1: Routing, Naming, and Navigation Contract

Status: `COMPLETED`

Date: 2026-07-29

### Scope completed
- Added shared dashboard route/navigation contract in `app/shared/dashboard-navigation.ts`.
- Kept `/dashboard/partner/**` as the technical Manager route and `/dashboard/manager/**` as redirect-only compatibility.
- Kept `/dashboard/shop/**` as redirect-only compatibility to production.
- Removed Track Job from primary role navigation sources; `/dashboard/track-job` remains utility/compatibility only.
- Changed dashboard-visible Partner copy to Manager while preserving technical route and API field names.
- Replaced disabled admin placeholder nav items with exception-first admin labels from the shared route contract.
- Made notification `target_url` generation role-aware and dashboard-scoped.
- Added notification target route-contract tests.

### Files changed
Frontend:
- `app/shared/dashboard-navigation.ts`
- `app/layouts/dashboard.vue`
- `app/pages/dashboard/admin.vue`
- `app/pages/dashboard/partner/index.vue`
- `app/pages/dashboard/partner/[section].vue`
- `app/pages/dashboard/partner/quotes/[id].vue`
- `app/pages/dashboard/partner/messages.vue`
- `app/pages/dashboard/partner/rate-card.vue`
- `app/pages/dashboard/client/[section]/[id].vue`
- `tests/quote-workflow/dashboardRouting.test.ts`
- `docs/dashboard-redesign/PRINTY_PHASE_1_ROUTE_CONTRACT.md`
- Dashboard redesign phase/decision/feedback docs.

Backend:
- `notifications/serializers.py`
- `notifications/tests.py`

### Tests run
- `yarn test:quote-workflow` PASS: 5 files, 25 tests.
- `yarn typecheck` PASS.
- `python manage.py test notifications.tests --keepdb -v 2` PASS: 3 tests.

### Decisions made
- TD-001 confirmed: keep `/dashboard/partner/**` technical route while displaying Manager.
- TD-002 confirmed: keep `/dashboard/track-job` as utility/compatibility only, not primary nav.
- MT-001 through MT-005 resolved for Phase 1 route/navigation scope.
- AS-003 resolved for admin primary nav placeholders.
- PT-008 deferred to Phase 10 for final authenticated-token redirect behavior.

### Definition-of-done assessment
Met for Phase 1: route/nav contract is recorded, Manager terminology is applied to dashboard-visible copy, aliases remain redirects, Track Job is not primary nav, admin disabled placeholders are removed, and notification targets are tested.

### Stop point
Stopped after Phase 1 before beginning Phase 2.

## Phase 2: Visual Foundations and Design Tokens

Status: `COMPLETED`

Date: 2026-07-29

### Scope completed
- Audited current CSS tokens, TypeScript design constants, Nuxt/Tailwind setup, package dependencies, shared component primitives, icon usage, arbitrary utility usage, and Phase 0 screenshots.
- Produced `PRINTY_PHASE_2_VISUAL_FOUNDATIONS.md` as the visual-harmony audit and token proposal.
- Updated Phase 2 status in the master phase tracker.
- Resolved DD-004 and VS-001 through VS-007 in the decisions/open-questions tracker.

### Files changed
Frontend docs only:
- `docs/dashboard-redesign/PRINTY_PHASE_2_VISUAL_FOUNDATIONS.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_CHANGE_PHASES.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`

### Findings
- Current visual values are split across `main.css`, `design.ts`, shared components, and page-local utility classes.
- Aggregate scan found 1158 hex color occurrences, 1397 arbitrary Tailwind utility occurrences, 570 orange/primary references, 149 focus utility references, 76 inline SVG or `v-html` icon usages, 515 radius utility references, and 169 shadow utility references.
- CSS imports Inter, but theme tokens declare Montserrat.
- No Nuxt UI dependency/config exists, despite legacy CSS targeting U* data attributes.
- Icons are split between custom `DashboardIcon`, raw inline SVG, and `v-html` usage.

### Tests run
- No automated tests required. Phase 2 changed documentation only.

### Decisions made
- CSS becomes the canonical design-token source.
- Dashboard color should be neutral-first with disciplined Printy orange usage.
- Right rail target width is 320-360px desktop; drawer widths are 420px, 560px, and 720px by complexity.
- Use one icon language in Phase 4.

### Definition-of-done assessment
Met for Phase 2: visual-harmony audit completed, token proposal documented, canonical component direction documented, DD-004 and VS-001 through VS-007 resolved.

### Stop point
Stopped after Phase 2 before beginning Phase 3.

## Phase 3: Shared Dashboard Shell

Status: `COMPLETED`

Date: 2026-07-29

### Scope completed
- Added route-aware shell surface rules to the shared dashboard navigation contract.
- Made `RoleDashboardFrame` expose canonical `#rail` and `#previewDrawer` slots.
- Added shell data attributes for regression checks and future visual/browser tests.
- Added skip link, navigation labels, active-link `aria-current`, disabled-link `aria-disabled`, and search/profile/notification labels.
- Kept preview drawers inside the dashboard shell with Gmail-like right-side behavior and mobile full-width behavior.
- Kept the right rail hidden on complex workflow and utility routes.
- Moved `dashboard-client.vue` onto `dashboardNavForRole('client')` so client fallback navigation uses the shared route contract.
- Added missing dashboard icon registry names used by the shared navigation contract.
- Added routing/layout tests that enforce shell ownership and the rail/drawer contract.

### Files changed
Frontend:
- `app/shared/dashboard-navigation.ts`
- `app/components/dashboard/RoleDashboardFrame.vue`
- `app/components/dashboard/Icons.vue`
- `app/layouts/dashboard-client.vue`
- `tests/quote-workflow/dashboardRouting.test.ts`
- `docs/dashboard-redesign/PRINTY_PHASE_3_SHELL_CONTRACT.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_CHANGE_PHASES.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`

### Decisions made
- `RoleDashboardFrame` is the canonical role-dashboard shell.
- Pages rendering `RoleDashboardFrame` must keep `layout: false` to avoid duplicate sidebars/topbars.
- Overview and collection routes can show the contextual rail.
- Complex workflow and utility routes hide the persistent rail.
- Preview drawers replace the rail; rail and drawer must not show together.
- Initial rail/preview implementation does not require a new backend aggregate endpoint.

### Tests run
- `yarn test:quote-workflow` PASS: 5 files, 28 tests.
- `yarn typecheck` PASS.
- `yarn build` PASS. Build emitted Nuxt/Vite sourcemap, Nitro external dependency, and Node deprecation warnings.

### Manual verification performed
- Verified route/layout contract through tests that recursively inspect dashboard pages using `RoleDashboardFrame`.
- Verified the shared client fallback layout no longer owns a separate client nav list.

### Screenshots captured
None in this phase run. The shell contract is covered by static route/layout tests, typecheck, and production build; full desktop/mobile screenshots remain required when browser verification has seeded auth/session data.

### Items explicitly deferred
- Role-specific dashboard content redesign.
- Filling real rail content for each role.
- Migrating collection row previews into the new `#previewDrawer` slot.
- Full focus trap/focus return for preview drawers.
- Quote-prep migration and draft persistence.
- Any backend endpoint for next-action aggregation.

### Risks introduced
- `RoleDashboardFrame` now wraps default slot content in a workspace section and may affect very specific layout assumptions on pages with full-width custom containers.
- Shared navigation icon names now render explicit icons instead of falling back to home.
- Preview drawer shell is available but not yet wired to existing collection modals.

### Definition-of-done assessment
Met for Phase 3: one role-shell contract exists, shell ownership is guarded by tests, rail/drawer behavior is route-aware, and no duplicate sidebar/topbar route pattern was introduced.

### Recommended next phase
Phase 4: Canonical Base Components.

### Stop point
Stop after Phase 3. Do not begin Phase 4 in this run.
## Phase 4: Canonical Base Components

Status: `COMPLETED`

Date: 2026-07-29

### Scope completed
- Canonicalized core `Base*` dashboard primitives for buttons, inputs, cards, badges, alerts, tables, and modals.
- Kept legacy button role variants as compatibility aliases while retiring role-colored action styling.
- Aligned `UiButton` and `UiCard` as pass-through compatibility wrappers.
- Updated shared design constants for radius, table, and empty-state defaults.
- Added keyboard row activation and row action aria-label support to `BaseTable`.
- Added modal focus return and Phase 2 drawer widths to `BaseModal`.
- Removed raw `v-html` icon rendering from `BaseInput`.
- Documented the Phase 4 primitive contract in `PRINTY_PHASE_4_COMPONENT_CONTRACT.md`.
- Added component contract tests.

### Files changed
Frontend:
- `app/components/base/BaseAlert.vue`
- `app/components/base/BaseBadge.vue`
- `app/components/base/BaseButton.vue`
- `app/components/base/BaseCard.vue`
- `app/components/base/BaseInput.vue`
- `app/components/base/BaseModal.vue`
- `app/components/base/BaseTable.vue`
- `app/components/ui/UiButton.vue`
- `app/components/ui/UiCard.vue`
- `app/components/ui/UiDashboardSidebar.vue`
- `app/components/ui/UiLoadingSkeleton.vue`
- `app/constants/design.ts`
- `tests/components/baseComponentContracts.test.ts`
- `docs/dashboard-redesign/PRINTY_PHASE_4_COMPONENT_CONTRACT.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_CHANGE_PHASES.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`

### Decisions made
- `Base*` primitives are canonical for new dashboard work.
- `UiButton` and `UiCard` remain compatibility wrappers and should not define separate variants.
- `client`, `partner`, and `shop` button variants remain accepted but map to canonical primary styling.
- Large dashboard card radii resolve to restrained `rounded-lg`/`rounded-xl` compatibility aliases.
- `BaseTable` row actions must be keyboard-operable.
- Right-side `BaseModal` drawers use 420px, 560px, and 720px width targets.
- No icon dependency was added in Phase 4.

### Tests run
- `yarn test:components` PASS: 2 files, 12 tests.
- `yarn test:quote-workflow` PASS: 5 files, 28 tests.
- `yarn typecheck` PASS.

### Manual verification performed
- Verified component contracts through source-level Vitest coverage.
- Verified dashboard route/workflow source tests still pass after primitive changes.

### Screenshots captured
None in this phase run. Browser screenshot verification remains deferred until seeded auth/session data is available for dashboard routes.

### Items explicitly deferred
- Broad page-level replacement of local utility classes.
- Migrating existing collection modals into the Phase 3 preview drawer slot.
- Full modal focus trap and browser keyboard pass.
- Installing or migrating to lucide.
- Status/progress semantic redesign, which belongs to Phase 5.

### Risks introduced
- Role-colored action buttons now render with canonical Printy primary styling, which is an intentional visual-system change.
- Card and alert radius is reduced through shared primitives, which may visually tighten existing dashboard surfaces.
- `BaseInput` no longer renders `iconLeft`/`iconRight` as HTML; existing usage search found no external callers passing those props.

### Definition-of-done assessment
Met for Phase 4: canonical primitives are documented, implemented, tested, and available for new dashboard work.

### Recommended next phase
Phase 5: Shared Status, Progress, and Next Action.

### Stop point
Stop after Phase 4. Do not begin Phase 5 in this run.
### Phase 4 Build Verification Amendment
- `yarn test:payment-ui` PASS: 1 file, 4 tests.
- `yarn build` PASS after rerun with a longer timeout. Build emitted Nuxt/Vite sourcemap, Nitro external dependency, and Node deprecation warnings.
## Phase 5: Shared Status, Progress, and Next Action

Status: `COMPLETED`

Date: 2026-07-29

### Scope completed
- Added frontend workflow status projection to `app/constants/design.ts`.
- Defined six canonical workflow states: completed, current, next, waiting, blocked, and cancelled.
- Added responsibility labels for client, manager, production, admin, Printy, system, and no-action states.
- Made `StatusBadge` expose `data-workflow-state` and optional responsibility/next-action accessibility text.
- Made `DashboardTimeline` consume shared timeline semantics while preserving legacy class-driven item compatibility.
- Added `WorkflowNextAction.vue` as the reusable next-action panel for future role dashboard pages.
- Documented the contract in `PRINTY_PHASE_5_STATUS_PROGRESS_CONTRACT.md`.
- Resolved SS-001 through SS-005.

### Files changed
Frontend:
- `app/constants/design.ts`
- `app/components/dashboard/StatusBadge.vue`
- `app/components/dashboard/DashboardTimeline.vue`
- `app/components/dashboard/WorkflowNextAction.vue`
- `tests/components/workflowSemantics.test.ts`
- `docs/dashboard-redesign/PRINTY_PHASE_5_STATUS_PROGRESS_CONTRACT.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_CHANGE_PHASES.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`

### Decisions made
- Frontend mapping is sufficient for initial shared status language.
- No backend status projection is required in Phase 5.
- New dashboard status surfaces should use completed/current/next/waiting/blocked/cancelled semantics.
- Status displays should include responsibility and next-action meaning where users need to understand who acts next.
- Broad page-local status cleanup remains deferred to role/content phases.

### Tests run
- `yarn test:components` PASS: 3 files, 16 tests.
- `yarn test:quote-workflow` PASS: 5 files, 28 tests.
- `yarn typecheck` PASS.

### Manual verification performed
- Verified the shared semantic functions through component tests.
- Verified existing quote-workflow source tests still pass after timeline and badge updates.

### Screenshots captured
None in this phase run. Full role status screenshot verification remains deferred until browser verification has seeded auth/session data.

### Items explicitly deferred
- Broad page-by-page replacement of local status labels/classes.
- Backend status projection endpoint or serializer fields.
- Full browser screenshot pass for every role status surface.
- Phase 6 collection drawer migration.

### Risks introduced
- `DashboardTimeline` now renders responsibility labels by default; existing callers can opt out with `show-responsibility="false"` if a compact surface needs it.
- StatusBadge now carries `data-workflow-state`; this is additive and should not affect visual output unless targeted by future CSS/tests.

### Definition-of-done assessment
Met for Phase 5: one shared status language and responsibility-aware progress/next-action pattern are documented, implemented, and tested.

### Recommended next phase
Phase 6: Collection and Preview Contract.

### Stop point
Stop after Phase 5. Do not begin Phase 6 in this run.
### Phase 5 Build Verification Amendment
- `yarn test:payment-ui` PASS: 1 file, 4 tests.
- `yarn build` PASS. Build emitted Nuxt/Vite sourcemap, Nitro external dependency, and Node deprecation warnings.
## Phase 6: Collection and Preview Contract

Status: `COMPLETED`

Date: 2026-07-29

### Scope completed
- Added focus entry, Tab containment, Escape close, scroll lock, and focus return to the shared `RoleDashboardFrame` preview drawer.
- Moved client collection detail previews from `BaseModal` to the shell `#previewDrawer` slot.
- Moved Manager quote queue and generic collection detail previews to the shell `#previewDrawer` slot.
- Kept Manager quote preparation in `BaseModal` because it remains a complex multi-step draft workflow.
- Moved production assignment queue previews to the shell `#previewDrawer` slot.
- Documented the contract in `PRINTY_PHASE_6_COLLECTION_PREVIEW_CONTRACT.md`.

### Files changed
Frontend:
- `app/components/dashboard/RoleDashboardFrame.vue`
- `app/pages/dashboard/client/[section].vue`
- `app/pages/dashboard/partner/[section].vue`
- `app/pages/dashboard/production/[section].vue`
- `tests/quote-workflow/dashboardRouting.test.ts`
- `docs/dashboard-redesign/PRINTY_PHASE_6_COLLECTION_PREVIEW_CONTRACT.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_CHANGE_PHASES.md`
- `docs/dashboard-redesign/PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`

### Decisions made
- The shell preview drawer is the canonical collection preview surface.
- Page-local modals should not be used for read-only collection row previews.
- Full-detail pages remain the boundary for quote approval, payment, production updates, proofing, dispatch, and other complex workflow actions.
- Complex quote preparation remains modal-based until the quote-prep migration phase addresses draft persistence and refresh risk.

### Items explicitly deferred
- Full browser screenshot pass for selected/unselected collection states.
- RR-005 and RR-006 prioritization/empty-context behavior for role dashboards.
- Quote-prep workflow migration.

### Risks introduced
- Client collection file was restored from `HEAD` after a failed write truncated it, then the Phase 6 drawer change was reapplied. Verify against prior uncommitted expectations if that file had important local-only edits before this run.
- `RoleDashboardFrame` now actively traps Tab focus while the preview drawer is open; unusual custom focusable content inside future drawer slots should be checked in browser QA.

### Definition-of-done assessment
Met for Phase 6 source contract: one collection preview drawer pattern is applied across client, Manager, and production collection rows, while complex workflows retain their full-detail or modal boundaries.

### Recommended next phase
Phase 7: Client Dashboard Simplification.
## Phase 7: Client Dashboard Simplification

Status: COMPLETED
Date: 2026-07-30

Implemented:
- Made `app/pages/dashboard/client/index.vue` action-first with `WorkflowNextAction` as the first operational surface after the page heading.
- Added existing-payload next-action prioritization: unpaid payment, quote response/payment, active job upload/proof/tracking, then new estimate fallback.
- Added a client overview rail for current job tracking through the shared `#rail` contract, keeping tracking in job context instead of a duplicate primary quick action.
- Removed the standalone `Track a job` quick action while preserving quote creation and upload access.
- Added a Phase 7 source contract assertion to `tests/quote-workflow/dashboardRouting.test.ts`.
- Added `PRINTY_PHASE_7_CLIENT_DASHBOARD_SIMPLIFICATION.md`.

Verification:
- `yarn test:quote-workflow`: PASS.
- `yarn test:components`: PASS.
- `yarn typecheck`: PASS.
- `yarn node scripts/assert-no-client-dashboard-mock-imports.mjs`: PASS.
- `rg -n "mockClientData|mockStats|mockQuotes|mockJobs|mockPayments|mockMessages" app`: PASS, no matches.
- `yarn build`: PASS with existing Nuxt/Tailwind sourcemap warnings.

Deferred:
- No browser screenshot pass was run in this phase.
- No backend next-action aggregate was added; current client payloads were enough for the source contract.
## Phase 8: Manager Dashboard Simplification

Status: COMPLETED
Date: 2026-07-30

Implemented:
- Made `app/pages/dashboard/partner/index.vue` queue-first with `WorkflowNextAction`, `data-manager-overview-next-action="true"`, and `data-manager-overview-queue="true"`.
- Added manager queue classification for quote prep, quote exceptions, accepted/paid work requiring dispatch, client-waiting quotes, production follow-up, and messages using existing dashboard payloads.
- Added quote-prep safety rail copy with `data-manager-overview-rail="quote-safety"`.
- Replaced remaining manager-facing Partner copy in manager dashboard pages with Manager copy where safe.
- Kept quote preparation in `app/pages/dashboard/partner/[section].vue` and preserved existing draft, pricing, client/shop selection, and send-to-client behavior.
- Added a Phase 8 source contract assertion to `tests/quote-workflow/dashboardRouting.test.ts`.
- Added `PRINTY_PHASE_8_MANAGER_DASHBOARD_SIMPLIFICATION.md`.

Draft safety finding:
- Existing explicit draft persistence is present through `createPartnerQuote(...save_as_draft)`.
- Send flow creates a saved draft before calling `sendPartnerQuoteToClient`.
- Unsaved modal state remains local, so full quote-prep migration is deferred to Phase 11.

Verification:
- `yarn typecheck` passed.
- `yarn test:quote-workflow` passed.
- `yarn test:components` passed.

Deferred:
- Browser screenshots at mobile/laptop/desktop.
- Manual prepare/send quote, dispatch accepted job, and messages walkthrough.
- Full quote-prep migration/autosave.

Recommended next phase: Phase 9 - Print-Shop and Production Simplification.
## Phase 9: Print-Shop and Production Simplification

Status: COMPLETED
Date: 2026-07-30

Implemented:
- Made `app/pages/dashboard/production/index.vue` action-first with `WorkflowNextAction` and `data-production-overview-next-action="true"`.
- Added `operationalQueueItems`, `productionPriority`, and queue summary context to prioritize blocked/file/proof issues, incoming assignments, ready-to-print accepted work, active production, then completed work.
- Marked the primary production queue with `data-production-overview-queue="true"`.
- Moved setup/pricing/paper/finishing/payout context into the overview rail with `data-production-overview-rail="configuration"`.
- Reduced primary production nav in `app/shared/dashboard-navigation.ts` to operational destinations: Overview, Assignments, Jobs, Messages, Notifications.
- Added a Phase 9 source contract assertion to `tests/quote-workflow/dashboardRouting.test.ts`.
- Added `PRINTY_PHASE_9_PRODUCTION_SIMPLIFICATION.md`.

Preserved:
- Production assignment state machine and detail actions.
- File/proof permissions and proof upload behavior.
- Payout calculations and payment confirmation behavior.
- Backend endpoints, services, and migrations.

Verification:
- `yarn typecheck` passed.
- `yarn test:quote-workflow` passed.
- `yarn test:components` passed.

Deferred:
- Browser screenshots at mobile/laptop/desktop.
- Manual accept/update/proof/complete/payout walkthrough.
- Any optional backend setup summary endpoint.

Recommended next phase: Phase 10 - Admin and Public Utility Pages.
## Phase 10: Admin and Public Utility Pages

Status: COMPLETED
Date: 2026-07-30

Implemented:
- Made `app/pages/dashboard/admin.vue` exception-first with `WorkflowNextAction`, `data-admin-overview-next-action="true"`, and a visible exception queue marked `data-admin-overview-exceptions="true"`.
- Built admin exception groups from the existing admin dashboard payload: failed/stale M-Pesa status buckets, paid jobs awaiting dispatch, blocked or delayed production, setup gaps, and recent access review.
- Added a secondary controls rail marked `data-admin-overview-rail="controls"` and kept broad admin directories hidden/secondary.
- Tightened `app/pages/dashboard/track-job/[token].vue` so it no longer reads `payment_status`, `assigned_shop_name`, or `shop_name` from token responses.
- Preserved `noindex,nofollow,noarchive` on dashboard tracking pages and added `data-public-tracking-safe="true"` to the token detail page.
- Confirmed backend source evidence that `ManagedJobPublicTrackingSerializer` exposes only `tracking_reference`, `job_status`, `estimated_ready`, and `next_action`, and managed tracking tokens are UUID4 unique values.
- Added Phase 10 route/privacy/admin assertions to `tests/quote-workflow/dashboardRouting.test.ts`.
- Added `PRINTY_PHASE_10_ADMIN_PUBLIC_UTILITY_PAGES.md`.

Preserved:
- Pricing formula, payment callbacks, auth security, permission rules, backend serializers/views, and migrations.
- Dashboard-only tracking utility route placement from the existing route contract.

Verification:
- `yarn typecheck`: PASS.
- `yarn test:quote-workflow`: PASS.
- `yarn test:components`: PASS.
- `yarn test:pricing`: PASS.
- `yarn test:payment-ui`: PASS.
- `yarn build`: PASS with existing Nuxt/Tailwind/Nitro sourcemap and externalization warnings.
- `python manage.py test jobs.test_phase8_file_visibility jobs.test_phase9_artwork_confirmation jobs.test_phase15_timing --keepdb`: PASS.
- `python manage.py test tests.test_step9_backend_workflow --keepdb`: PASS.
- Initial backend command including `jobs.tests.ManagedJobPublicTrackingTestCase` was not usable because `jobs.tests` raises a module-level `SkipTest`; the standalone public-tracking modules above passed.

Deferred:
- Browser screenshots at mobile/laptop/desktop.
- Auth/signup/onboarding visual polish beyond route/privacy contract checks.
- Signed-out standalone tracking product decision.
- Authenticated-owner redirect from token utility to client job detail.
- Backend token expiry/reuse policy.
- Broad admin directories and any new admin permissions.

Recommended next phase: Phase 11 - Complex Workflow Migration.
