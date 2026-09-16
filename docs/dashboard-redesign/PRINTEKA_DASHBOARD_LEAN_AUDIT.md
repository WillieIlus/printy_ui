# Printy Dashboard Lean Audit

Scope: investigation and recommendation only. This file explains the present dashboard system, current friction, repository evidence, and why changes are needed. It is not the phase tracker and does not authorize implementation.

## Document Responsibility

- Authoritative decisions and open questions: `PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`
- Target hierarchy: `PRINTY_DASHBOARD_INFORMATION_HIERARCHY.md`
- Master implementation phases and status: `PRINTY_DASHBOARD_CHANGE_PHASES.md`
- Append-only execution record: `PRINTY_DASHBOARD_IMPLEMENTATION_FEEDBACK.md`

## Authoritative Decision References

This audit follows the closed decisions in `PRINTY_DASHBOARD_DECISIONS_AND_OPEN_QUESTIONS.md`. If this file conflicts with that decisions file, the decisions file wins.

Key referenced decisions:

- Authenticated tracking belongs in job context and the client right rail, not primary left navigation.
- Public `/track-job/:token` is preserved only as minimal safe signed-out/shared tracking.
- User-facing role label is Manager; `/dashboard/partner/...` may remain as a temporary technical route.
- Preview drawer replaces the contextual right rail when a row is selected.
- Complex workflow pages hide the persistent rail where it would compress work.
- Progress must include responsible party, required action, expected time where known, and what happens next.
- Admin starts with operational exceptions, not broad directories.
- Quote preparation must not migrate until draft persistence and local state risks are known.
- Phase 0 baseline and the visual-harmony audit must happen before implementation.

## Executive Verdict

Printy has the necessary product building blocks: role dashboards, quote/job/payment flows, M-Pesa prompts, production assignment flows, tracking tokens, dashboard APIs, visibility helpers, modal primitives, table primitives, and shared dashboard components. The issue is fragmentation: similar work appears through different shells, page-local navigation, repeated status/timeline patterns, mixed page/modal decisions, and inconsistent Manager/Partner terminology.

The product should converge on one calm dashboard rule:

- Left: where am I?
- Center: what am I working on?
- Right: what matters next?

The right side needs discipline. It is a contextual rail on overview and idle collection pages. It becomes the preview drawer when a row is selected. It disappears or collapses on complex workflow pages.

## Repository Evidence

| Evidence area | Files | Current behavior | Why it matters |
| --- | --- | --- | --- |
| Shared shell | `printy_ui/app/components/dashboard/RoleDashboardFrame.vue`, `printy_ui/app/layouts/dashboard.vue`, `printy_ui/app/layouts/dashboard-client.vue` | Most role pages use `RoleDashboardFrame`; `layouts/dashboard.vue` also creates a dashboard shell and warns against duplicate sidebars/topbars. | Two shell paths create consistency and regression risk. |
| Client pages | `printy_ui/app/pages/dashboard/client/index.vue`, `client/[section].vue`, `client/[section]/[id].vue`, `client/quotes/index.vue` | Client overview, list, and detail pages use related but not identical nav/detail patterns. | Client work should feel like one product area. |
| Manager pages | `printy_ui/app/pages/dashboard/partner/index.vue`, `partner/[section].vue`, `partner/quotes/[id].vue`, manager redirect pages | Manager work is implemented under partner routes; `partner/[section].vue` combines many workflows and drawers. | User-facing Manager copy can be fixed before technical route migration. |
| Production pages | `printy_ui/app/pages/dashboard/production/index.vue`, `production/[section].vue`, `production/assignments/[id].vue`, `production/jobs/[id].vue`, shop redirect pages | Production overview mixes live queue, setup, pricing, paper stock, finishing, and payout context. | Executable production work should dominate; configuration should be secondary. |
| Admin | `printy_ui/app/pages/dashboard/admin.vue` | Broad KPIs and disabled nav entries exist. | Admin should start with exceptions and avoid false affordances. |
| Tracking | `printy_ui/app/pages/dashboard/track-job.vue`, `dashboard/track-job/[token].vue` | Tracking exists as authenticated dashboard pages. Public route state must be investigated. | Authenticated tracking should not become a normal duplicate dashboard destination; public token tracking must remain safe if supported. |
| Status/progress | `printy_ui/app/components/dashboard/StatusBadge.vue`, `DashboardTimeline.vue`, `printy_ui/app/constants/design.ts`, page-local timeline and queue logic | Status and progress are mapped in several places. | Users need consistent status meaning and responsibility. |
| Notifications | `printy_api/notifications/serializers.py` | Target URLs include older patterns such as `/quotes/{id}` and `/dashboard/jobs/{id}`. | Notifications can navigate outside the intended dashboard hierarchy. |
| APIs | `printy_api/api/dashboard_views.py`, `api/payment_views.py`, `api/visibility.py` | Dashboard and payment APIs exist; visibility helpers protect role-specific payloads. | Backend changes should be targeted and only introduced when frontend data gaps are proven. |

## Dashboard-by-Dashboard Findings

| Area | Current behavior | Friction | Recommended change | Benefit | Risk | Difficulty | Backend impact | Open questions |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Shared shell | Role pages mostly use `RoleDashboardFrame`; `layouts/dashboard.vue` is a second shell. | Duplicate shell/topbar risk and inconsistent spacing/nav. | One role-shell contract with one nav source and one rail/drawer rule. | Stable, learnable dashboard. | Layout/auth regressions. | Medium | None unless counts move. | MT-005, RR-001 |
| Client overview | Metrics, jobs, quotes, calculator, manager choices, payments, activity all compete. | User must decide what matters. | Action-first center plus quiet right rail for current job/next action. | Faster scanning. | Quote creation may be hidden if moved poorly. | Medium | Optional aggregate endpoint. | RR-003, RR-005, RR-006 |
| Client collections | `client/[section].vue` uses modal preview and full details link. | Modal pattern should become canonical drawer behavior. | Row preview drawer replaces rail; full page for complex job/quote/payment work. | Consistent list inspection. | Focus/mobile regressions. | Medium | None. | RR-001, RR-002 |
| Client detail/payment | Client detail owns quote response, M-Pesa, timeline, artwork, proof, messages. | Complex page should not be compressed by a persistent rail. | Hide persistent rail; use internal sticky action panel if needed. | Better workflow width. | Payment regressions. | Medium | None if APIs stay. | SS-003, SS-005 |
| Manager terminology | UI/routes mix partner and manager concepts. | Users see two labels for one role. | Show Manager everywhere visible; keep `/dashboard/partner` technical temporarily. | Clearer role model. | Label-coupled tests. | Low | Notification text may change. | MT-001 to MT-005 |
| Manager overview | Stats/revenue can dominate live work. | Operational decisions are less obvious. | Queue-first Manager overview: new requests, prepare quote, waiting client, dispatch, production exceptions, messages. | Managers act faster. | Revenue expectations. | Medium | Optional counts. | RR-003 |
| Manager sections | `partner/[section].vue` is very broad and contains quote prep, pricing, STK, lists, drawers. | High maintenance and state-loss risk. | Keep previews in drawers; move complex quote prep only after draft audit. | Safer simplification. | Highest frontend risk. | High | Possible draft endpoint. | QD-001 to QD-006 |
| Production overview | Queue, setup, pricing, paper, and payout compete. | Shop owners may miss live work. | Center executable queue; right rail for due assignment/setup/payout. | Production focus. | Setup gaps may become subtle. | Medium | Optional setup summary. | RR-003 |
| Production sections | Section route combines configuration and operations. | Mixed mental models. | Dedicated object collections with status filters/tabs. | Cleaner scanning. | Route migration. | High | None to medium. | SS-001 |
| Admin | Admin has broad KPIs and disabled nav entries. | False affordances and possible dashboard bloat. | Exception-first admin; broad directories deferred. | Operational clarity. | Permission exposure if rushed. | Medium | Admin exception endpoints likely. | AS-001 to AS-005 |
| Tracking | Authenticated dashboard tracking routes exist; public route state needs inspection. | Normal Track Job page duplicates Jobs/right rail; public shared links may break if absent. | Auth tracking via jobs/right rail/detail; `/dashboard/track-job` utility only; `/track-job/:token` minimal safe public. | Avoids duplication and preserves sharing. | Privacy or broken-link risk. | Medium | Visibility projection tests required. | PT-001 to PT-008 |
| Notifications | Backend serializer builds stale-looking target URLs. | Notifications can escape dashboard hierarchy. | Centralize role-aware notification targets and Manager copy. | Reliable alert navigation. | Old notifications may retain bad targets. | Medium | Required serializer update after tests. | MT-002, AS-003 |
| Status/progress | Status badges, timelines, and page-local mappings coexist. | Same process can look different by role. | One responsibility-aware progress model. | Users understand who must act. | Requires careful mapping/copy. | Medium | Optional projection if data missing. | SS-001 to SS-005 |

## Right-Rail and Drawer Contract

Overview pages show the contextual right rail with active job, next action, deadline, unread message, blocker, setup gap, or operational summary.

Collection pages with no selected record show queue or action context in the right rail.

Collection pages with a selected row replace the right rail with the preview drawer. Do not display rail and drawer together.

Complex workflow pages hide the persistent rail where it would compress work. They may use a narrow internal sticky next-action panel, collapsible context panel, or top summary with sticky primary action.

Mobile uses a bottom sheet, full-screen drawer, or collapsible panel. It must never force a narrow third column.

## Tracking Decision

Authenticated clients:

- Right rail displays the most relevant active job.
- Jobs collection lists all jobs.
- Job row selection opens preview drawer.
- Full tracking, artwork, files, payment, messages, and history live in `/dashboard/client/jobs/:id`.
- `/dashboard/track-job` is a utility lookup or compatibility route only.
- Track Job is not a primary left-navigation item.

Public/shared users:

- Preserve `/track-job/:token` if shared links are supported.
- Show only tracking reference, broad status, current stage, next expected step, estimated completion where available, and safe support route.
- Prohibit client identity, private contact info, manager notes, print-shop identity, internal pricing, payout details, documents, and private messages.

## Progress Responsibility Rules

Every current, waiting, or blocked state must include responsible party, required action, expected time/deadline where known, and what happens after the action.

Completed steps remain visible but muted. The next action required from the current user gets the strongest non-error emphasis. Technical status codes should be mapped to user-friendly labels.

## Lean Admin Scope

Initial admin work should focus on operational exceptions:

- Failed or stale M-Pesa attempts.
- Paid jobs awaiting dispatch.
- Unassigned work.
- Blocked production assignments.
- Disputes.
- Notification failures.
- Shop setup gaps.
- Permission or access anomalies.

Broad users, clients, managers, shops, quote, job, and payment directories are secondary unless required for a current admin task.

## Quote Preparation Risk

Quote preparation is high-risk because the current Manager section appears to hold pricing, fees, manager markup, shop selection, client selection, send-quote, offline-client, STK, and payment-related behavior in one large surface. Before moving it, investigate draft persistence and local-only component state. Do not migrate until state-loss risks are addressed.

## Visual-Harmony Dependency

Do not begin dashboard visual implementation from this audit alone. First complete the visual-harmony investigation covering orange usage, neutral and semantic colors, borders, radius, shadows, spacing, typography, buttons, inputs, cards, tables, modals, drawers, navigation states, progress states, responsive rules, accessibility, interaction states, design tokens, and canonical reusable components.

After the visual audit, merge product hierarchy, workflow behavior, navigation/routes, page/drawer/modal contracts, visual design system, responsive behavior, accessibility, and regression protection into one master implementation plan.

## Top Reductions

1. Remove Track Job from primary client navigation; make tracking part of Jobs, job detail, and the right rail.
2. Replace metric-first dashboards with action-first work queues.
3. Use one role navigation source and shell contract.
4. Replace page-local status/progress variants with responsibility-aware progress.
5. Keep admin exception-first and defer broad directories.
6. Use filters/tabs for statuses instead of status-specific routes.
7. Keep simple previews in drawers and complex workflows on full pages.

## Top Break Risks

1. M-Pesa STK initiation, phone consent, and payment confirmation regressions.
2. Quote-preparation draft loss or pricing/fee/markup behavior regression.
3. Notification target URLs pointing to removed, stale, or wrong routes.
4. Public tracking data exposure or broken shared token links.
5. Duplicate shell, duplicate right rail/drawer, or three-column workflow compression.
6. Permission leaks from rushed admin pages.
7. Visual token rollout changing perceived status meaning.

## Changes Not To Make

- Do not begin implementation before Phase 0 baseline and visual foundations.
- Do not start Phase 0 during documentation setup.
- Do not create separate Manager and Partner interfaces.
- Do not expose Track Job as a normal client nav destination.
- Do not remove public tracking without confirming shared-link requirements.
- Do not create separate routes for every status.
- Do not build broad admin directories before exception workflows.
- Do not migrate quote prep before autosave/state-loss risk is resolved.
- Do not weaken authentication, authorization, visibility, file permissions, or pricing/payment logic for visual cleanup.

## Final Verdict

Current visual and structural consistency is moderate but fragile. The primary reason the app feels busy is that multiple useful surfaces compete for attention without a single hierarchy of next action, context, and workflow depth.

The smallest set of changes with the greatest harmony is: baseline first, visual foundations, one shell/nav contract, one right-rail/drawer contract, one progress model, and action-first dashboard centers.

The implementation should proceed phase-by-phase from the master plan, not dashboard-by-dashboard first. Component and shell foundations must precede role dashboard redesign.
