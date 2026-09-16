# Phase 10: Admin and Public Utility Pages

Status: COMPLETED
Date: 2026-07-30

## Scope Completed

- Rebuilt `app/pages/dashboard/admin.vue` as an exception-first Super Admin overview using the existing `fetchAdminDashboard()` payload.
- Added `WorkflowNextAction` to the admin overview with `data-admin-overview-next-action="true"`.
- Added an admin exception queue with `data-admin-overview-exceptions="true"` covering M-Pesa failures/stale callbacks, paid jobs awaiting dispatch, blocked or delayed production, print-shop setup gaps, and access review.
- Added a secondary admin controls rail with `data-admin-overview-rail="controls"` and explicit copy that broad directories stay hidden until tied to an operational exception.
- Removed unused admin metric/table rendering scaffolding from the page and fixed the old timestamp separator mojibake.
- Tightened `app/pages/dashboard/track-job/[token].vue` so the view layer no longer reads or renders `payment_status`, `assigned_shop_name`, or `shop_name` from tracking responses.
- Added `data-public-tracking-safe="true"` to the token detail page and preserved `noindex,nofollow,noarchive` metadata on both tracking utility pages.
- Added Phase 10 source contract tests in `tests/quote-workflow/dashboardRouting.test.ts`.

## Backend Evidence

No backend files were changed in this phase.

Repository evidence shows the managed public tracking endpoint uses `PublicManagedJobTrackingView` with `AllowAny` and `ManagedJobPublicTrackingSerializer`. That serializer exposes only `tracking_reference`, `job_status`, `estimated_ready`, and `next_action`. `ManagedJob.tracking_token` is a unique UUID4 field.

## Preserved

- Pricing formula and calculator behavior.
- Payment provider callbacks and M-Pesa reconciliation behavior.
- Auth and permission rules.
- Public tracking API paths and dashboard utility route placement.
- Existing admin backend endpoint shape.

## Deferred

- Browser screenshots at mobile/laptop/desktop.
- Auth/signup/onboarding visual polish beyond existing route safety.
- A signed-out standalone `/track-job/:token` product route decision; current contract remains `/dashboard/track-job/:token` plus public API-backed data.
- Authenticated-owner redirect from token utility view to the client's job detail.
- Backend token expiry/reuse policy.
- Broad admin directories that would require dedicated permission tests.

## Verification

- `yarn typecheck`: PASS.
- `yarn test:quote-workflow`: PASS.
- `yarn test:components`: PASS.
- `yarn test:pricing`: PASS.
- `yarn test:payment-ui`: PASS.
- `yarn build`: PASS with existing Nuxt/Tailwind/Nitro sourcemap and externalization warnings.
- `python manage.py test jobs.test_phase8_file_visibility jobs.test_phase9_artwork_confirmation jobs.test_phase15_timing --keepdb`: PASS.
- `python manage.py test tests.test_step9_backend_workflow --keepdb`: PASS.
- Initial backend command including `jobs.tests.ManagedJobPublicTrackingTestCase` was not usable because `jobs.tests` raises a module-level `SkipTest`; the standalone public-tracking modules above passed.
