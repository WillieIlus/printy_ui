# Printy Phase 9 Print-Shop and Production Simplification

Status: COMPLETED
Date: 2026-07-30

## Contract

- Production overview is action-first through `WorkflowNextAction` and `data-production-overview-next-action="true"`.
- Operational queue rows are exposed through `data-production-overview-queue="true"`.
- Production work is prioritized from existing assignment payloads: blocked/file/proof issues first, incoming assignments next, accepted ready-to-print work next, in-production work next, then completed recent work.
- Configuration is contextual through `data-production-overview-rail="configuration"`; paper stock, pricing, finishing, and payout views remain accessible without being primary production navigation items.
- The shared production nav keeps Overview, Assignments, Jobs, Messages, and Notifications as primary role navigation.
- No production assignment state machine, file/proof permissions, payout calculations, payment confirmation, backend endpoint, migration, or workflow-transition logic changed.

## Verification

- 2026-07-30: `yarn typecheck` passed.
- 2026-07-30: `yarn test:quote-workflow` passed.
- 2026-07-30: `yarn test:components` passed.
- 2026-07-30: `yarn build` passed with existing Nuxt/Tailwind/Nitro warnings.

## Deferred

- Browser screenshots for production overview, assignments, jobs, assignment detail, setup, and pricing at mobile/laptop/desktop.
- Manual accept assignment, update status, upload proof, complete work, and payout/setup walkthrough.
- Any backend setup summary endpoint; existing payloads were sufficient for Phase 9 source contract.