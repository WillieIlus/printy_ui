# Printy Dashboard Change Phases

Scope: master implementation phase plan. This file controls future `NEXT PHASE` execution. Do not rely on chat history to determine the next phase.

## Document Responsibility

- Authoritative decisions and open questions: `PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`
- Current audit evidence: `PRINTY_DASHBOARD_LEAN_AUDIT.md`
- Target information hierarchy: `PRINTY_DASHBOARD_INFORMATION_HIERARCHY.md`
- Append-only execution history: `PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`

## Status Values

Use only: `NOT STARTED`, `IN PROGRESS`, `BLOCKED`, `COMPLETED`, `PARTIALLY COMPLETED`, `ROLLED BACK`.

## Master Sequence

1. Phase 0: Regression and Visual Baseline
2. Phase 1: Repository Decision and Route Contract
3. Phase 2: Visual Foundations and Design Tokens
4. Phase 3: Shared Dashboard Shell
5. Phase 4: Canonical Base Components
6. Phase 5: Shared Status, Progress, and Next Action
7. Phase 6: Collection and Preview Contract
8. Phase 7: Client Dashboard Simplification
9. Phase 8: Manager Dashboard Simplification
10. Phase 9: Print-Shop and Production Simplification
11. Phase 10: Admin and Public Utility Pages
12. Phase 11: Complex Workflow Migration
13. Phase 12: Responsive and Accessibility Refinement
14. Phase 13: Complete Regression Verification and Cleanup

Future `NEXT PHASE` work must execute only the first phase whose status is not `COMPLETED`, after confirming dependencies.

## Phase 0: Regression and Visual Baseline

Status: `COMPLETED`

Objective:
- Establish the current behavior and visual state before changing anything.

Why this phase occurs now:
- Recent Printy work touched authentication, M-Pesa, payment, email, confirmation, routing, messaging, and tracking. Implementation without a baseline is unsafe.

Exact investigation or implementation scope:
- Test/document login, logout, JWT refresh, registration, email confirmation, quote request, Manager selection, quote preparation, quote acceptance, M-Pesa phone consent, STK initiation, payment confirmation, artwork upload, proof approval, file permissions, shop assignment, production updates, dispatch, messages, notifications, notification targets, authenticated tracking, public tracking, role permissions.
- Capture screenshots for mobile, laptop, and desktop widths.
- Record current automated-test results and known failures.

Files likely to change:
- Future baseline report, for example `PRINTY_PHASE_0_BASELINE.md`.
- Screenshot artifact paths if approved.
- `PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md` append.
- This file status line.

Files that must not change:
- Application source under `printy_ui/app/**`.
- Backend source under `printy_api/**` except no changes expected.
- Package files, migrations, settings, Tailwind config.

Frontend impact:
- None.

Backend impact:
- None.

Database or migration impact:
- None.

Existing functionality at risk:
- None from documentation/testing, but this phase measures critical risk areas.

Required automated tests:
- Existing frontend tests relevant to dashboard routing, quote workflow, pricing, payment UI, browser flows.
- Existing backend tests relevant to auth, email, quotes, payments, production, notifications, routing, permissions.

Required manual tests:
- Walk all listed critical flows using known seeded/test accounts where available.

Required screenshots:
- Client dashboard, Manager dashboard, production/print-shop dashboard, admin dashboard, public calculator, public tracking, auth pages, signup/onboarding, legacy redirects at mobile/laptop/desktop.

Mobile checks:
- Navigation, modals, drawers, tables/lists, payment prompt, tracking.

Accessibility checks:
- Keyboard navigation, visible focus, dialog focus trap, color contrast spot checks, touch targets.

Rollback point:
- Clean app repos and recorded SHAs before tests.

Definition of done:
- Baseline document saved, screenshots saved if feasible, tests recorded, known failures listed, no app code changed.

Dependencies:
- None.

Open questions resolved in this phase:
- PT-001 to PT-008 initial evidence, MT-004 test coupling evidence, QD-003 basic refresh/navigation risk evidence, AS-001 initial endpoint evidence, SS-001 initial duplication evidence.

Items explicitly deferred:
- Visual redesign, route changes, component refactors, backend changes.

## Phase 1: Repository Decision and Route Contract

Status: `COMPLETED`

Objective:
- Confirm canonical routes, redirects, aliases, Manager terminology, authenticated/public tracking routes, and navigation data ownership.

Why this phase occurs now:
- Route and terminology stability must precede shell and component work.

Exact investigation or implementation scope:
- Inspect Nuxt route files, redirects, middleware, notification targets, tests, and route constants.
- Centralize role navigation data if implementation is approved.
- Fix stale notification targets only after tests exist.

Files likely to change:
- `printy_ui/app/pages/dashboard/**`
- `printy_ui/app/layouts/**`
- `printy_ui/app/components/dashboard/RoleDashboardFrame.vue`
- `printy_ui/app/services/api-paths.ts`
- `printy_api/notifications/serializers.py`
- Route/notification tests.

Files that must not change:
- Pricing services, payment provider logic, quote fee formulas, file permission logic, migrations unless explicitly required.

Frontend impact:
- Stable left nav and route labels; Track Job removed from primary nav if present; Manager visible copy.

Backend impact:
- Notification target URL cleanup after tests.

Database or migration impact:
- None expected.

Existing functionality at risk:
- Old links, auth redirects, notification clicks, role routing.

Required automated tests:
- Route snapshot tests, notification target tests by role, auth redirect tests, public/authenticated tracking route tests.

Required manual tests:
- Visit every canonical route and legacy redirect for each role.

Required screenshots:
- Left nav for client, Manager, production, admin at desktop and mobile.

Mobile checks:
- Mobile nav active states and redirect behavior.

Accessibility checks:
- Keyboard nav order and focus states.

Rollback point:
- Commit after route contract and tests pass.

Definition of done:
- One route/nav contract recorded and implemented if approved; no duplicate Manager/Partner UI; notification targets tested.

Dependencies:
- Phase 0 completed.

Open questions resolved in this phase:
- MT-001 to MT-005, PT-008, AS-003.

Items explicitly deferred:
- Broad visual redesign, quote-prep migration, admin broad directories.

## Phase 2: Visual Foundations and Design Tokens

Status: `COMPLETED`

Objective:
- Investigate and define Printy's visual system before redesigning role dashboards.

Why this phase occurs now:
- Component and dashboard work needs approved color, spacing, typography, border, radius, shadow, and interaction rules.

Exact investigation or implementation scope:
- Audit orange palette, neutral palette, semantic colors, borders, radius, shadows, spacing, typography, layout dimensions, control heights, focus ring, icon sizes, responsive breakpoints, Tailwind config, CSS, Nuxt UI config, icon usage, arbitrary utilities, contrast.
- Produce visual-harmony audit and token proposal.

Files likely to change:
- New visual-harmony audit document.
- Future token/design-system plan.
- No app implementation files during investigation unless explicitly approved.

Files that must not change:
- Dashboard pages, business logic, APIs, migrations, package files.

Frontend impact:
- None during investigation; future visual foundation defined.

Backend impact:
- None.

Database or migration impact:
- None.

Existing functionality at risk:
- None during investigation.

Required automated tests:
- None unless existing visual tooling is used for evidence.

Required manual tests:
- Inspect current components and screenshots against design criteria.

Required screenshots:
- Use Phase 0 screenshots plus targeted component screenshots if needed.

Mobile checks:
- Mobile spacing, nav, forms, tables, drawers, modals, public/auth pages.

Accessibility checks:
- Contrast, focus visibility, color-only status, touch targets, reduced motion.

Rollback point:
- No app-code rollback needed.

Definition of done:
- Visual-harmony audit completed, tokens proposed, canonical component direction documented, master plan updated if needed.
- Completed in PRINTY_PHASE_2_VISUAL_FOUNDATIONS.md.

Dependencies:
- Phase 0 completed.

Open questions resolved in this phase:
- VS-001 to VS-007, DD-004.

Items explicitly deferred:
- Role dashboard redesign, component implementation, workflow migration.

## Phase 3: Shared Dashboard Shell

Status: `COMPLETED`

Objective:
- Implement one canonical role dashboard shell with stable left nav, topbar, contextual rail behavior, and mobile navigation.

Why this phase occurs now:
- Shared layout consistency must exist before component and page harmonization.

Exact investigation or implementation scope:
- Normalize shell ownership, prevent duplicate sidebars/topbars, apply rail visibility rules, define preview drawer replacement integration points.

Files likely to change:
- `printy_ui/app/components/dashboard/RoleDashboardFrame.vue`
- `printy_ui/app/components/layout/DashboardShell.vue`
- `printy_ui/app/components/layout/DashboardSidebar.vue`
- `printy_ui/app/components/layout/DashboardTopbar.vue`
- `printy_ui/app/layouts/dashboard.vue`
- `printy_ui/app/layouts/dashboard-client.vue`
- Role page metadata using shell/layout.

Files that must not change:
- Payment, pricing, quote-prep, production action logic, backend business rules.

Frontend impact:
- Unified shell, nav, rail slots, mobile shell behavior.

Backend impact:
- None expected.

Database or migration impact:
- None.

Existing functionality at risk:
- Layout duplication, auth middleware behavior, route rendering.

Required automated tests:
- Dashboard routing/layout tests, auth guard tests, visual/browser smoke tests where available.

Required manual tests:
- Open every role dashboard and verify one sidebar/topbar only.

Required screenshots:
- All role dashboards at mobile/laptop/desktop.

Mobile checks:
- Nav open/close, topbar, rail collapse.

Accessibility checks:
- Landmark roles, nav labels, focus order, skip/focus behavior.

Rollback point:
- Commit before shell work; rollback to pre-shell commit if duplicated layout or auth breaks.

Definition of done:
- One shell contract used consistently with no duplicate sidebars/topbars.
- Completed in PRINTY_PHASE_3_SHELL_CONTRACT.md.

Dependencies:
- Phases 0-2 completed.

Open questions resolved in this phase:
- RR-001, RR-002, RR-003, RR-004 initial shell data needs.

Items explicitly deferred:
- Role-specific content redesign, quote-prep migration, admin expansion.

## Phase 4: Canonical Base Components

Status: `COMPLETED`

Objective:
- Standardize shared UI primitives and remove visual ambiguity before page-level redesign.

Why this phase occurs now:
- Role dashboards should compose consistent components instead of inventing local variants.

Exact investigation or implementation scope:
- Standardize buttons, inputs, forms, cards, tables, lists, page headers, badges, alerts, empty states, loading states, errors, modals, drawers, dropdowns, tabs, pagination, icons.

Files likely to change:
- `printy_ui/app/components/base/**`
- `printy_ui/app/components/ui/**`
- `printy_ui/app/components/dashboard/**`
- Shared constants/styles.
- Tests for shared components.

Files that must not change:
- Business workflow pages except replacing primitives in narrow, tested ways.
- Backend logic and migrations.

Frontend impact:
- Visual consistency for controls and surfaces.

Backend impact:
- None.

Database or migration impact:
- None.

Existing functionality at risk:
- Form submission, validation display, row actions, modal focus, table interactions.

Required automated tests:
- Component tests, form workflow tests, modal/drawer accessibility tests, existing dashboard tests.

Required manual tests:
- Buttons, forms, tables, modals, drawers, empty/loading/error states.

Required screenshots:
- Component examples and key pages using them.

Mobile checks:
- Touch targets, input heights, table/list conversion, modal/drawer fit.

Accessibility checks:
- Labels, focus, disabled states, color contrast, icon-only labels.

Rollback point:
- Commit before component rollout; rollback if shared primitive breaks workflows.

Definition of done:
- Canonical primitives documented, implemented, tested, and used for new dashboard work.
- Completed in PRINTY_PHASE_4_COMPONENT_CONTRACT.md.

Dependencies:
- Phases 0-3 completed.

Open questions resolved in this phase:
- VS-003, VS-005 and component-specific findings from Phase 2.

Items explicitly deferred:
- Full role dashboard layout changes beyond primitive adoption.

## Phase 5: Shared Status, Progress, and Next Action

Status: `COMPLETED`

Objective:
- Create one semantic status/progress/next-action system across roles.

Why this phase occurs now:
- Users need consistent process meaning before page simplification changes visible hierarchy.

Exact investigation or implementation scope:
- Map backend quote, job, payment, assignment, tracking, notification, and admin states to completed/current/next/waiting/blocked/cancelled.
- Add responsibility-aware labels and next-action pattern.

Files likely to change:
- `printy_ui/app/components/dashboard/StatusBadge.vue`
- `printy_ui/app/components/dashboard/DashboardTimeline.vue`
- New workflow progress/next-action components.
- `printy_ui/app/constants/design.ts`
- Role pages using status/timeline patterns.
- Optional backend serializers only if required for responsibility/deadline data.

Files that must not change:
- Backend state machines, pricing/payment rules, migrations unless projection is explicitly required and tested.

Frontend impact:
- Consistent labels, colors, icons, completed/current/waiting/blocked emphasis.

Backend impact:
- Optional status projection fields if frontend cannot infer responsibility safely.

Database or migration impact:
- None expected.

Existing functionality at risk:
- Users misreading status if labels/colors change; workflow tests coupled to text.

Required automated tests:
- State mapping tests, component tests, payment/tracking/proof/production regression tests.

Required manual tests:
- Inspect every role status and ensure current/waiting/blocked states name who acts and what happens next.

Required screenshots:
- Client job detail, public tracking, Manager queues, production assignment, admin exceptions.

Mobile checks:
- Progress readable and compact.

Accessibility checks:
- No color-only communication; labels are screen-reader meaningful.

Rollback point:
- Commit before status rollout.

Definition of done:
- One shared status language and responsibility-aware progress component/pattern.
- Completed in PRINTY_PHASE_5_STATUS_PROGRESS_CONTRACT.md.

Dependencies:
- Phases 0-4 completed.

Open questions resolved in this phase:
- SS-001 to SS-005.

Items explicitly deferred:
- Backend state-machine changes, unless required for safe projection.

## Phase 6: Collection and Preview Contract

Status: `COMPLETED`

Objective:
- Standardize collection pages, filters/tabs, row preview drawers, and modal/page boundaries.

Why this phase occurs now:
- Collection behavior should be stable before role dashboards are simplified.

Exact investigation or implementation scope:
- Dedicated collection page pattern, status filters/tabs, row preview drawer replacing rail, full-page links for complex workflows, focused modals for small decisions, responsive overlay behavior.

Files likely to change:
- `printy_ui/app/components/base/BaseTable.vue`
- `printy_ui/app/components/base/BaseModal.vue`
- Drawer component if created.
- `printy_ui/app/components/dashboard/DashboardDataTable.vue`
- Client, Manager, production, admin collection routes.

Files that must not change:
- Quote-prep workflow state, payment provider logic, production transitions, file permission rules.

Frontend impact:
- Uniform row click, drawer, filter, modal, and full-detail behavior.

Backend impact:
- None expected; optional slim list endpoints if payloads are too heavy.

Database or migration impact:
- None.

Existing functionality at risk:
- Row actions, full-detail links, modal focus, mobile scroll locking.

Required automated tests:
- Row drawer tests, full-detail navigation tests, modal/drawer focus tests, collection filter tests.

Required manual tests:
- Open/close previews, use actions, navigate to full pages, verify no rail/drawer duplication.

Required screenshots:
- Every collection page at desktop/mobile with no selection and selected row.

Mobile checks:
- Full-screen drawer or bottom sheet; no three-column layout.

Accessibility checks:
- Drawer role, focus trap, focus return, escape close, scroll lock.

Rollback point:
- Commit before collection behavior rollout.

Definition of done:
- One collection/preview/modal contract applied without breaking workflows.

Dependencies:
- Phases 0-5 completed.

Open questions resolved in this phase:
- RR-001 to RR-006 final interaction behavior.

Items explicitly deferred:
- Complex quote-prep migration, admin broad directories.

## Phase 7: Client Dashboard Simplification

Status: `COMPLETED`

Objective:
- Make the client dashboard action-first while preserving quote, payment, job, artwork, proof, message, and tracking behavior.

Why this phase occurs now:
- Shared shell, components, status, and collection contracts are ready to support a focused client experience.

Exact investigation or implementation scope:
- Prioritize needs your action, accepted quote awaiting payment, artwork upload, proof approval, active jobs, Manager response, unread messages, current job tracking in right rail.
- Do not bury quote creation.
- Do not duplicate tracking across several surfaces.

Files likely to change:
- `printy_ui/app/pages/dashboard/client/index.vue`
- `printy_ui/app/pages/dashboard/client/[section].vue`
- `printy_ui/app/pages/dashboard/client/[section]/[id].vue`
- `printy_ui/app/components/jobs/**`
- `printy_ui/app/services/dashboard.ts`

Files that must not change:
- Payment provider logic, pricing formula, auth logic, file permission logic, backend state transitions.

Frontend impact:
- Client overview becomes action-first; tracking moves into job context and rail.

Backend impact:
- Optional next-action aggregate if existing payload is insufficient.

Database or migration impact:
- None expected.

Existing functionality at risk:
- Quote creation visibility, M-Pesa prompt, proof/artwork flows, tracking links.

Required automated tests:
- Quote workflow, payment UI/STK, client job tracking, route tests, drawer tests.

Required manual tests:
- Client end-to-end quote request through payment and job tracking.

Required screenshots:
- Client overview, quotes, jobs, payments, job detail, payment modal at mobile/laptop/desktop.

Mobile checks:
- Rail collapse, drawer full-screen, payment prompt usability.

Accessibility checks:
- Next-action labels, form labels, modal focus.

Rollback point:
- Commit before client dashboard changes.

Definition of done:
- Client sees one clear next action and tracking is not duplicated as a primary route.

Dependencies:
- Phases 0-6 completed.

Open questions resolved in this phase:
- RR-005, RR-006, client-specific tracking and next-action behavior.

Items explicitly deferred:
- Manager quote prep migration, admin pages.

## Phase 8: Manager Dashboard Simplification

Status: `COMPLETED`

Objective:
- Make Manager work queues clear while preserving quote preparation, pricing, fee, markup, shop/client selection, send-quote, and payment behavior.

Why this phase occurs now:
- Client-facing foundations are stable and Manager terminology/collections are ready.

Exact investigation or implementation scope:
- Prioritize new requests, quotes requiring preparation, quotes waiting for clients, accepted jobs requiring shop assignment/dispatch, production exceptions, messages requiring response.
- Use Manager in visible copy.
- Investigate quote draft persistence before migration.

Files likely to change:
- `printy_ui/app/pages/dashboard/partner/index.vue`
- `printy_ui/app/pages/dashboard/partner/[section].vue`
- `printy_ui/app/pages/dashboard/partner/quotes/[id].vue`
- `printy_ui/app/services/partner.ts`
- `printy_api/api/dashboard_views.py` if drafts/summary data are needed.

Files that must not change:
- Approved Printy pricing formula, payment provider behavior, auth/permission rules, migrations unless draft persistence is approved.

Frontend impact:
- Manager overview becomes queue-first; visible Partner copy replaced where safe.

Backend impact:
- Possible draft persistence or summary endpoint only after investigation.

Database or migration impact:
- Possible future draft persistence migration; not automatic.

Existing functionality at risk:
- Quote-prep state loss, pricing/fee/markup calculations, shop/client selection, send-to-client, offline/STK paths.

Required automated tests:
- Manager quote workflow, pricing contract, payment-related tests, row drawer tests, route/copy tests.

Required manual tests:
- Prepare and send quote without lost state; dispatch accepted job; verify messages.

Required screenshots:
- Manager overview, requests, quotes, jobs, quote prep/current state, quote detail, mobile.

Mobile checks:
- Quote workspace not cramped; drawer/mobile overlay works.

Accessibility checks:
- Complex forms, dialogs, status responsibility text.

Rollback point:
- Commit before Manager simplification; separate commit before any quote-prep migration.

Definition of done:
- User-facing Manager dashboard is queue-first and no quote-prep state is lost.

Dependencies:
- Phases 0-6 completed; QD questions investigated before migration.

Open questions resolved in this phase:
- QD-001 to QD-006, MT remaining user-facing copy items.

Items explicitly deferred:
- Complex workflow migration if draft safety is not proven.

## Phase 9: Print-Shop and Production Simplification

Status: `COMPLETED`

Objective:
- Prioritize executable production work and move configuration away from the main operational queue.

Why this phase occurs now:
- Shared queue/status/drawer rules are available and Manager handoff is clearer.

Exact investigation or implementation scope:
- Prioritize new assignments, accepted assignments, in production, proof required, blocked, ready for dispatch/collection.
- Move setup, paper, pricing, finishing, and payout configuration away from the primary queue.

Files likely to change:
- `printy_ui/app/pages/dashboard/production/index.vue`
- `printy_ui/app/pages/dashboard/production/[section].vue`
- `printy_ui/app/pages/dashboard/production/assignments/[id].vue`
- `printy_ui/app/pages/dashboard/production/jobs/[id].vue`
- `printy_ui/app/services/production.ts`

Files that must not change:
- Production assignment state machine, file permission rules, payout calculations, payment confirmation logic.

Frontend impact:
- Production home becomes operational queue-first; setup/payout become context or secondary pages.

Backend impact:
- Optional setup summary endpoint if current data is insufficient.

Database or migration impact:
- None expected.

Existing functionality at risk:
- Assignment accept/update, proof upload, job visibility, payout display.

Required automated tests:
- Production lifecycle, file/proof permissions, route tests, status/progress tests.

Required manual tests:
- Accept assignment, update status, upload proof, complete work, view payout/setup.

Required screenshots:
- Production overview, assignments, jobs, assignment detail, setup, pricing at mobile/laptop/desktop.

Mobile checks:
- Queue cards and assignment actions remain usable.

Accessibility checks:
- Status text, buttons, file uploads, forms.

Rollback point:
- Commit before production dashboard changes.

Definition of done:
- Production work is primary and setup remains visible only when relevant.

Dependencies:
- Phases 0-6 completed.

Open questions resolved in this phase:
- Production-specific RR and SS questions.

Items explicitly deferred:
- Admin exception pages, broad production reporting.

## Phase 10: Admin and Public Utility Pages

Status: `COMPLETED`

Objective:
- Make admin exception-first and public utility pages visually consistent and safe.

Why this phase occurs now:
- Role dashboard patterns and public tracking rules are established.

Exact investigation or implementation scope:
- Exception-first admin dashboard, minimal public tracking, utility lookup routes, authentication pages, public calculator consistency, removal of false/disabled navigation entries.

Files likely to change:
- `printy_ui/app/pages/dashboard/admin.vue`
- Future admin exception pages.
- Public calculator/tracking/auth/signup/onboarding pages.
- `printy_api/api/services/admin_dashboard.py`
- `printy_api/notifications/serializers.py`
- Public tracking serializers/views/tests.

Files that must not change:
- Pricing formula, payment provider callbacks, auth security, permission rules except tested endpoint-level hardening.

Frontend impact:
- Admin exceptions first; public pages match design foundations; public tracking minimal.

Backend impact:
- Admin exception endpoints and public tracking visibility projection may be needed.

Database or migration impact:
- None expected unless new persistent exception/draft data is approved.

Existing functionality at risk:
- Admin data exposure, public tracking privacy, auth/signup behavior, calculator correctness.

Required automated tests:
- Admin permission tests, public tracking visibility tests, auth tests, calculator/pricing tests, notification target tests.

Required manual tests:
- Admin exceptions, public token view, auth/signup/onboarding, calculator.

Required screenshots:
- Admin overview, exception pages, public calculator, public tracking, auth/signup/onboarding at mobile/laptop/desktop.

Mobile checks:
- Public forms, tracking, admin exception list.

Accessibility checks:
- Auth forms, public tracking status, admin tables/lists.

Rollback point:
- Commit before admin/public changes.

Definition of done:
- Admin remains lean; public tracking is privacy-safe; false nav entries removed or hidden.

Dependencies:
- Phases 0-6 completed; public tracking questions investigated.

Open questions resolved in this phase:
- PT-001 to PT-008 final, AS-001 to AS-005, PO-001 to PO-003 where product input is required.

Items explicitly deferred:
- Broad admin directories unless explicitly approved.

## Phase 11: Complex Workflow Migration

Status: `NOT STARTED`

Objective:
- Migrate or refine complex workflows only after shared foundations are stable and state risks are addressed.

Why this phase occurs now:
- Quote/payment/artwork/dispatch/production/dispute workflows are high-risk and should not be first.

Exact investigation or implementation scope:
- Quote preparation, quote financial audit, artwork approval, payment history, dispatch, production assignment actions, pricing/rate cards, disputes, long message workflows.
- Protect draft state and working business logic.

Files likely to change:
- `printy_ui/app/pages/dashboard/partner/quotes/[id].vue`
- `printy_ui/app/pages/dashboard/partner/[section].vue`
- `printy_ui/app/pages/dashboard/client/[section]/[id].vue`
- `printy_ui/app/pages/dashboard/production/assignments/[id].vue`
- `printy_ui/app/pages/dashboard/production/jobs/[id].vue`
- Services and backend endpoints only as proven necessary.

Files that must not change:
- Pricing formula, payment provider callback semantics, permission model, migrations unless approved for drafts/workflow persistence.

Frontend impact:
- Complex work gets full-page or internal action-panel treatment.

Backend impact:
- Possible draft persistence or workflow summary endpoints.

Database or migration impact:
- Possible only if draft persistence is approved and tested.

Existing functionality at risk:
- Quote draft loss, payment, artwork/proof, dispatch, production actions, pricing/rate-card logic, dispute history.

Required automated tests:
- End-to-end quote, payment, pricing, proof, dispatch, production, dispute tests as relevant.

Required manual tests:
- Complete every migrated workflow and refresh/navigation interruption cases.

Required screenshots:
- Before/after for each migrated workflow at desktop/mobile.

Mobile checks:
- Full-page workflows and sticky actions do not overlap content.

Accessibility checks:
- Long forms, errors, file upload, dialog focus, keyboard operation.

Rollback point:
- Separate commits per workflow; rollback individual workflow if needed.

Definition of done:
- Complex workflows are safer and clearer with no business logic regression.

Dependencies:
- Phases 0-10 completed; QD decisions resolved.

Open questions resolved in this phase:
- Any remaining QD workflow migration questions.

Items explicitly deferred:
- Removing obsolete variants until Phase 13.

## Phase 12: Responsive and Accessibility Refinement

Status: `NOT STARTED`

Objective:
- Verify all dashboard/public/auth surfaces work across mobile, tablet, laptop, desktop, large desktop, keyboard, focus, contrast, touch, screen readers, reduced motion, table responsiveness, and text resizing.

Why this phase occurs now:
- Broad patterns are implemented and need systematic refinement before final cleanup.

Exact investigation or implementation scope:
- Responsive layout fixes, accessibility fixes, focus traps, touch targets, contrast, reduced motion, table/list behavior, text resizing.

Files likely to change:
- Shared shell, base components, role pages with verified responsive/accessibility issues.

Files that must not change:
- Business logic and backend rules unless accessibility requires harmless metadata/text changes.

Frontend impact:
- Mobile and accessibility polish.

Backend impact:
- None expected.

Database or migration impact:
- None.

Existing functionality at risk:
- Overlay behavior, keyboard behavior, table/list actions.

Required automated tests:
- Browser/screenshot tests, accessibility tests if available, focus tests for modals/drawers.

Required manual tests:
- Keyboard-only walkthroughs, mobile walkthroughs, text zoom where feasible.

Required screenshots:
- All key surfaces at mobile/tablet/laptop/desktop/large desktop.

Mobile checks:
- Primary focus of phase.

Accessibility checks:
- Primary focus of phase.

Rollback point:
- Commit before responsive/accessibility changes.

Definition of done:
- No critical overlap, clipping, unreachable actions, hidden focus, color-only status, or unusable mobile overlays.

Dependencies:
- Phases 0-11 completed.

Open questions resolved in this phase:
- VS-007 final contrast and responsive/accessibility findings.

Items explicitly deferred:
- Final obsolete variant removal until Phase 13.

## Phase 13: Complete Regression Verification and Cleanup

Status: `NOT STARTED`

Objective:
- Prove the redesign preserved behavior and remove only confirmed obsolete visual variants.

Why this phase occurs now:
- Cleanup is safe only after all redesigned paths and regression tests pass.

Exact investigation or implementation scope:
- Run complete frontend/backend tests, repeat Phase 0 manual flows, compare baseline screenshots, remove obsolete variants, confirm redirects, notification targets, public tracking safety, permissions, and remaining debt.

Files likely to change:
- Obsolete visual wrappers, duplicate status variants, old card/list/modal variants, final documentation updates.

Files that must not change:
- Business logic unless fixing regressions found by tests and explicitly scoped.

Frontend impact:
- Final cleanup and consistency pass.

Backend impact:
- Only bug fixes for regressions found in prior changes.

Database or migration impact:
- None expected.

Existing functionality at risk:
- Any workflow touched by cleanup.

Required automated tests:
- Full relevant frontend and backend suites, quote workflow, payment UI/STK, pricing, production, messaging, notifications, routing, permissions.

Required manual tests:
- Repeat Phase 0 critical flows.

Required screenshots:
- Compare final screenshots to Phase 0 baseline for all key surfaces.

Mobile checks:
- Repeat complete mobile smoke pass.

Accessibility checks:
- Repeat accessibility smoke pass.

Rollback point:
- Final pre-cleanup commit.

Definition of done:
- Tests recorded, obsolete variants removed only when safe, redirects/notifications/public tracking/permissions confirmed, final implementation verdict recorded.

Dependencies:
- Phases 0-12 completed.

Open questions resolved in this phase:
- Any remaining repository-answerable questions or final debt status.

Items explicitly deferred:
- Product-owner decisions not answered and non-blocking future enhancements.

## Phase Execution Protocol

When the instruction is `NEXT PHASE`:

1. Read `PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`.
2. Read this file.
3. Read relevant sections of `PRINTY_DASHBOARD_LEAN_AUDIT.md`.
4. Read relevant sections of `PRINTY_DASHBOARD_INFORMATION_HIERARCHY.md`.
5. Read all previous entries in `PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`.
6. Inspect `git status` in `printy_ui` and `printy_api`.
7. Identify the first phase whose status is not `COMPLETED`.
8. Confirm dependencies are complete.
9. Execute only that phase.
10. Stop after updating phase status, decisions/open questions, and feedback.

Do not begin the following phase in the same run.

## End-of-Phase Protocol

At the end of a phase:

1. Run all tests required by the phase.
2. Perform required manual verification.
3. Update the phase status in this file.
4. Update resolved questions in `PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`.
5. Append the complete result to `PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`.
6. Record incomplete items and exact reasons.
7. State the recommended next phase in the feedback file.
8. Stop.

## Implementation Guardrails

- Preserve working functionality.
- Make the smallest coherent set of changes.
- Do not opportunistically redesign unrelated pages.
- Do not change backend business rules to solve a visual problem.
- Do not silently remove features.
- Do not replace real data with mock data.
- Do not skip tests because a change appears visual.
- Do not alter the approved Printy pricing formula.
- Do not weaken authentication, authorization, visibility, or file permissions.
- Use Yarn for frontend dependency commands.
- Preserve Nuxt/Vue `<script setup>` composition API.
- Preserve Django REST Framework JWT authentication and authorization.

## Blocker Protocol

Investigate repository evidence before stopping. Use the recommended default in `PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md` whenever it safely resolves the issue.

Stop as `BLOCKED` only when a required business decision has no approved default, proceeding could destroy or expose data, proceeding could weaken authentication or authorization, required credentials or external infrastructure are unavailable, the repository is unsafe, or a previous phase dependency genuinely failed.

When blocked, record evidence, the exact decision required, safe options, phase status, and the blocker in `PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md` before stopping.
