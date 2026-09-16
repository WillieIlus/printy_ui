# Printy Phase 7 Client Dashboard Simplification

Status: COMPLETED
Date: 2026-07-30

## Contract

- Client overview is action-first through `WorkflowNextAction` and `data-client-overview-next-action="true"`.
- The next action is derived from existing client dashboard payloads: unpaid payments first, quote decisions/payment next, active job upload/proof/tracking next, and quote creation when there is no active work.
- Quote creation remains visible in the header, helper card, quick calculator panel, and empty state fallback.
- Job tracking is contextual in the `#rail` slot through `data-client-overview-rail="tracking"`; the overview no longer exposes a primary `Track a job` quick action.
- Client collection and detail routes continue to own quote, payment, upload, proof, job tracking, and reorder flows.
- No backend, payment provider, pricing, auth, file permission, or workflow-transition logic changed.

## Deferred

- Browser screenshot pass for client overview, quotes, jobs, payments, job detail, and payment modal at mobile/laptop/desktop sizes.
- Manual end-to-end quote request through payment and job tracking.
- Backend next-action aggregate remains unnecessary until a real payload gap is found.