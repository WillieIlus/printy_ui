# Printy Phase 0 Baseline

Execution date: 2026-07-28

Status: COMPLETED

This Phase 0 run established an automated-test, public tracking, authenticated role-dashboard, and visual baseline without changing application source code. Local baseline data was seeded in the development database only to make authenticated dashboard and valid-token tracking screenshots reproducible.

## Starting Repository State

- `printy_ui` branch: `main...origin/main`
- `printy_ui` commit: `09204ad`
- `printy_ui` working tree before Phase 0 docs/screenshots: clean
- `printy_api` branch: `main...origin/main`
- `printy_api` commit: `71b8c33`
- `printy_api` working tree before Phase 0: clean
- Node: `v22.18.0`
- Python: `3.12.6`

## Automated Test Baseline

### Frontend

| Command | Result | Notes |
| --- | --- | --- |
| `yarn typecheck` | PASS | Nuxt typecheck completed successfully in about 26s. |
| `yarn test:pricing` | PASS | 3 files, 20 tests passed. |
| `yarn test:pricing-contract` | PASS | 1 file, 5 tests passed. |
| `yarn test:components` | PASS | 1 file, 6 tests passed. |
| `yarn test:quote-workflow` | PASS | 5 files, 22 tests passed. |
| `yarn test:payment-ui` | PASS | 1 file, 4 tests passed. |
| `yarn build` | PASS WITH WARNINGS | Build completed. Warnings were sourcemap warnings from Nuxt/Tailwind transforms, one unresolved external warning for Nitro cache-driver, and a Node deprecation warning from Vue shared package exports. |

### Backend

| Command | Result | Notes |
| --- | --- | --- |
| `python manage.py test` | DID NOT RUN TESTS | Existing database `test_printy_dev` prompted for deletion; noninteractive run hit EOF. |
| `python manage.py test --keepdb` | TIMEOUT | Full 264-test suite exceeded 10 minutes without producing final results. |
| `python manage.py test accounts.tests accounts.test_email_verification_flow accounts.test_registration_phone_deferral --keepdb -v 2` | LEGACY MODULE SKIP NONZERO | `accounts.tests` raises `SkipTest` at import for legacy pre-reset tests. |
| `python manage.py test accounts.test_email_verification_flow accounts.test_registration_phone_deferral --keepdb -v 2` | PASS | 3 tests passed. |
| `python manage.py test payments.tests.test_payment_flow --keepdb -v 2` | PASS | 35 tests passed. |
| `python manage.py test api.test_routing_payment_counts_regressions api.test_dashboard_views tests.test_step9_backend_workflow --keepdb -v 2` | LEGACY MODULE SKIP NONZERO | `api.test_dashboard_views` raises `SkipTest` at import for legacy pre-reset dashboard tests. |
| `python manage.py test api.test_routing_payment_counts_regressions tests.test_step9_backend_workflow --keepdb -v 2` | PASS | 22 tests passed. |
| `python manage.py test jobs.test_phase8_file_visibility jobs.test_phase9_artwork_confirmation jobs.test_phase15_timing tests.test_api_permissions tests.test_permissions --keepdb -v 2` | PASS | 24 tests passed. |
| `python manage.py test accounts.test_active_role_context accounts.test_broker_resolution accounts.test_profile_creation --keepdb -v 1` | PASS | 12 tests passed. |
| `python manage.py test api.test_actor_visibility api.test_direct_shop_submission api.test_phase2_calculator_manager_selection api.test_phase4_manager_production_sourcing api.test_phase5_offline_partner_quotes api.test_phase6_production_dashboard_states --keepdb -v 1` | PASS | 20 tests passed. |
| `python manage.py test jobs.test_proof_approval_gate jobs.test_shop_as_manager_access --keepdb -v 1` | PASS | 11 tests passed. |
| `python manage.py test api.test_partner_quote_list_payload api.test_partner_quote_send_to_client api.test_production_matching api.test_public_shop_quote_preview --keepdb -v 1` | PASS | 26 tests passed. |
| `python manage.py test tests.test_engine_services tests.test_step10_frontend_api_surface common.tests common.tests_geo inventory.tests production.tests --keepdb -v 1` | PASS | 21 tests passed. |
| `python manage.py test pricing.tests pricing.test_seed_paper_catalog pricing.test_wastage_pricing api.test_pricing_setup_migration api.test_workflow_serializers api.test_visibility_step5 api.test_phase17_manual_payout_release --keepdb -v 1` | PASS | 60 tests passed. |
| `python manage.py test quotes.test_email_outbox api.test_partner_quote_list_payload --keepdb -v 1` | PASS | 7 tests passed. |
| `python manage.py test api.test_actor_visibility api.test_direct_shop_submission api.test_e2e_partner_flow api.test_phase2_calculator_manager_selection --keepdb -v 1` | LEGACY MODULE SKIP NONZERO | `api.test_e2e_partner_flow` raises `SkipTest` at import. Active modules were rerun separately. |
| `python manage.py test jobs.tests jobs.test_proof_approval_gate jobs.test_shop_as_manager_access --keepdb -v 1` | LEGACY MODULE SKIP NONZERO | `jobs.tests` raises `SkipTest` at import. Active modules were rerun separately. |

## Visual Baseline

Initial public and unauthenticated screenshots were captured from the production build server at `http://localhost:3000`. Authenticated dashboard screenshots were captured against the existing Nuxt dev server at `http://127.0.0.1:3010` connected to the local Django API at `http://127.0.0.1:8000/api`.

Screenshots captured under `docs/dashboard-redesign/phase0-screenshots/`: 43 PNG files covering public home, auth pages, unauthenticated dashboard guard states, authenticated client/partner/production/admin dashboards, authenticated jobs views, authenticated dashboard tracking, and partner jobs before/after click.

Captured viewport categories:

- Mobile: `390x844`
- Laptop: `1366x768`
- Desktop: `1920x1080`

## Seeded Local Baseline Data

- Client: `phase0-client@printy.local`
- Partner: `phase0-partner@printy.local`
- Production: `phase0-production@printy.local`
- Admin: `phase0-admin@printy.local`
- Shop: `phase0-production-shop`
- Managed job: `MJ-PHASE0-0001`
- Valid tracking token: `a79de1e5-d988-4cdd-94b9-abe844455d4d`

## Manual Verification Baseline

Manual/smoke verification completed:

- Confirmed built server starts and serves `http://localhost:3000`.
- Confirmed public/auth routes render for screenshot capture.
- Confirmed unauthenticated dashboard routes render as current redirect/guard baseline.
- Confirmed Django API starts and serves `http://127.0.0.1:8000/api`.
- Confirmed authenticated role-dashboard routes render using the app's cookie-backed JWT session.
- Confirmed `/api/public/managed-jobs/track/a79de1e5-d988-4cdd-94b9-abe844455d4d/` returns only `tracking_reference`, `job_status`, `estimated_ready`, and `next_action` for seeded job `MJ-PHASE0-0001`.
- Captured partner jobs list before and after clicking seeded job `MJ-PHASE0-0001` as the Gmail-like modal/detail baseline.

Manual verification not completed:

- Full browser click-through of registration/email confirmation, quote creation, manager selection, quote preparation, quote acceptance, M-Pesa STK initiation, payment confirmation, artwork upload, proof approval, dispatch, production updates, messaging, and notification clickthrough.
- Destructive or externally visible live payment behavior.

Reason: Phase 0 is a baseline phase. Local authenticated data was seeded only for screenshots and smoke evidence; implementation and destructive/external payment behavior are reserved for later phases.

## Phase 0 Coverage Against Required Scope

| Area | Baseline status |
| --- | --- |
| Login/logout/JWT refresh | Covered by targeted backend auth tests and authenticated cookie-session screenshots; full browser refresh/logout walk not completed. |
| Registration | Covered by backend registration test and public register screenshots; browser submission not completed. |
| Email confirmation | Covered by backend test; browser flow not completed. |
| Quote request | Covered by backend workflow/routing tests; browser flow not completed. |
| Manager selection | Covered by backend routing tests; browser flow not completed. |
| Quote preparation | Covered by backend workflow/pricing tests; browser quote-prep state not completed. |
| Quote acceptance | Covered by backend payment/workflow tests; browser flow not completed. |
| M-Pesa phone consent/STK | Covered by frontend payment UI tests and backend payment tests; browser flow not completed. |
| Payment confirmation | Covered by backend payment/admin simulation tests. |
| Artwork upload/proof approval | Covered by backend file visibility, artwork confirmation, and proof approval tests; browser flow not completed. |
| File permissions | Covered by backend file visibility and permissions tests. |
| Shop assignment/production/dispatch | Covered by backend workflow/routing/payment tests and production dashboard screenshots. |
| Messaging | Not directly covered in this Phase 0 run beyond workflow-adjacent tests. |
| Notifications/targets | Covered partly by backend notification creation in routing tests; target URL audit remains open for Phase 1. |
| Authenticated tracking | Covered by backend dashboard/tracking-related tests and authenticated dashboard `/dashboard/track-job/:token` screenshots. |
| Public tracking | Covered by backend public tracking privacy tests and direct valid-token API payload check. Public frontend route placement remains open for Phase 10 implementation/cleanup because tracking must stay under `/dashboard`. |
| Role permissions | Covered by backend permission and workflow visibility tests. |
| Partner job list click behavior | Covered by laptop before/after click screenshots for seeded job `MJ-PHASE0-0001`. |

## Known Baseline Limitations

- Full backend suite still does not produce a single clean final command because several legacy pre-reset modules raise `SkipTest` at import and return nonzero when included directly.
- Legacy skip modules found during Phase 0: `accounts.tests`, `api.tests`, `api.test_dashboard_views`, `api.test_e2e_partner_flow`, `api.test_quote_workflow_repairs`, `jobs.tests`, `quotes.tests`, `quotes.tests_turnaround`, `quotes.tests_whatsapp_formatter`, `catalog.tests`, `setup.tests`, `gallery.tests`, and `services.tests_quote_calculator`.
- Authenticated browser evidence is screenshot/smoke coverage, not a full click-through of every quote, payment, artwork, proof, production, messaging, and notification workflow.
- Local Phase 0 seed data remains in the development database for repeatable baseline screenshots.

## Open Questions Initial Evidence

- PT-001 to PT-007: backend tests and the direct valid-token payload check indicate public tracking hides file URLs, private shop/pricing fields, confirmation data, and actual ready timestamps in tested cases; full endpoint inventory remains open for Phase 10 implementation verification.
- PT-005: model evidence indicates managed job `tracking_token` is a UUID field; additional rotation/invalid-token behavior review remains open.
- MT-004: frontend quote workflow tests and backend routing tests passed; Partner-label test coupling remains open for Phase 1 grep/test audit.
- QD-003: quote preparation browser refresh/navigation loss was not tested; remains open.
- AS-001: admin payment simulation and dashboard counts tests passed; full admin exception endpoint inventory remains open.
- SS-001: prior audit evidence shows duplicated status mapping in components/constants/page-local logic; full mapping inventory remains open for Phase 5.

## Phase 0 Result

Phase 0 is `COMPLETED`.

Completed:

- Repository state recorded.
- Frontend typecheck/tests/build baseline recorded.
- Targeted active backend auth/payment/routing/workflow/file/permission/pricing/visibility baseline recorded.
- Public/auth/unauthenticated-route screenshots captured.
- Authenticated role dashboard screenshots captured.
- Valid public tracking token API payload recorded.
- Partner jobs list click baseline captured.
- Known legacy test limitations and remaining browser-flow limits recorded.

Recommended next action:

- Proceed to Phase 1 only after confirming no source changes are mixed into this Phase 0 baseline commit.
