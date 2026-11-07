# Tracking & naming addendum — behind-the-scenes log
# Law and SKILL.md win on conflict; this is a scratch register, not a binding spec.
# Updated: 2026-10-31 (continue from prior interrupted session)

AGENT_NOTES_2026_10_31 = """
Library of fragments already touched or read during the prior session that I must
preserve here so I do not waste tool budget re-reading everything from scratch.

1. Repo top-level files of record:
   - printy_api\api\urls.py
   - printy_api\api\visibility.py
   - printy_api\api\dashboard_views.py
   - printy_api\jobs\views.py
   - printy_api\jobs\job_codes.py
   - printy_api\jobs\models.py
   - printy_api\jobs\choices.py
   - printy_api\jobs\serializers.py
   - printy_api\jobs\listing.py
   - printy_api\jobs\buyer_tracking.py
   - printy_api\jobs\workflow.py
   - printy_api\jobs\printer_workflow.py
   - printy_api\jobs\timing.py (file is effectively empty of real code)
   - printy_api\jobs\timing_config.py
   - printy_api\jobs\timing_services.py
   - printy_api\jobs\completion_actuals.py
   - printy_api\jobs\assignment_services.py
   - printy_api\jobs\test_printer_stage_advance.py
   - printy_api\jobs\test_buyer_tracked_jobs.py
   - printy_api\jobs\test_artwork_workflow_law72.py
   - printy_api\api\canonical_jobs.py
   - printy_api\api\workflow_serializers.py
   - printy_api\quotes\acceptance.py
   - printy_api\quotes\models.py
   - printy_api\quotes\quote_engine.py
   - printy_api\quotes\turnaround.py
   - printy_api\quotes\pricing_service.py
   - printy_api\quotes\migrations\0008_quoterequest_production_uplift_and_more.py
   - printy_api\workflow\models.py
   - printy_api\workflow\transitions.py
   - printy_api\pricing\services\production_cost_calculator.py
   - printy_api\pricing\services\platform_fee_policy.py
   - printy_api\pricing\services\result_contract.py
   - printy_api\pricing\services\breakdown_projection.py
   - printy_api\pricing\services\engine.py
   - printy_api\pricing\services\urgency.py
   - printy_api\pricing\services\speed_tiers.py
   - printy_api\pricing\serializers.py
   - printy_api\pricing\models.py
   - printy_api\pricing\admin.py
   - printy_api\pricing\choices.py
   - printy_api\pricing\views.py
   - printy_api\pricing\urls.py
   - printy_api\pricing\test_speed_tiers.py
   - printy_api\pricing\migrations\0005_estimatepolicy_publicholiday_speedtier_and_more.py
   - printy_api\pricing\migrations\0006_seed_speed_defaults.py
   - printy_api\config\settings.py
   - printy_api\config\test_settings.py
   - printy_api\manage.py
   - printy_api\conftest.py
   - printy_api\README.md

2. FE top-level files of record:
   - printy_ui\app\shared\types\index.ts
   - printy_ui\app\shared\api-paths.ts
   - printy_ui\app\shared\api.ts
   - printy_ui\app\shared\job-time.ts
   - printy_ui\app\shared\list-sections.ts
   - printy_ui\app\shared\funnel.ts (referenced by manager store)
   - printy_ui\app\shared\quote-handoff.ts
   - printy_ui\app\composables\useApi.ts
   - printy_ui\app\composables\useToast.ts
   - printy_ui\app\constants\buyer-stages.ts
   - printy_ui\app\stores\auth.ts
   - printy_ui\app\stores\tracked-jobs.ts
   - printy_ui\app\stores\client-jobs.ts
   - printy_ui\app\stores\manager.ts
   - printy_ui\app\stores\assignments.ts
   - printy_ui\app\stores\workflow.ts
   - printy_ui\app\stores\printer-jobs.ts
   - printy_ui\app\stores\shop.ts
   - printy_ui\app\stores\quotes.ts (referenced via funnel/manager)
   - printy_ui\app\utils\printy.ts
   - printy_ui\app\components\workbench\views\HomeView.vue
   - printy_ui\app\components\workbench\views\BuyerView.vue
   - printy_ui\app\components\workbench\views\ManagerView.vue
   - printy_ui\app\components\workbench\views\PrinterView.vue
   - printy_ui\app\components\workbench\views\JobCard.vue
   - printy_ui\app\components\workbench\ClientJobsPanel.vue
   - printy_ui\app\components\workbench\Tracker\BuyerJobsInProgress.vue
   - printy_ui\app\components\workbench\Tracker\TicketStepper.vue
   - printy_ui\app\components\workbench\Tracker\TrackTicket.vue
   - printy_ui\app\components\workbench\Tracker\TrackView.vue (duplicated path variants exist)
   - printy_ui\app\components\workbench\views\TrackView.vue
   - printy_ui\app\components\workbench\tracker\TicketStepper.vue (lowercase variant exists)
   - printy_ui\app\components\workbench\tracker\TrackTicket.vue (lowercase variant exists)
   - printy_ui\app\components\workbench\tracker\BuyerJobsInProgress.vue (lowercase variant exists)
   - printy_ui\app\components\workbench\marketing\SampleJobTicket.vue
   - printy_ui\app\app.vue
   - printy_ui\app\pages\app\printer\index.vue
   - printy_ui\app\pages\app\manager\jobs\index.vue (referenced in manager card links)
   - printy_ui\app\pages\app\manager\rates\index.vue (referenced in manager card links)
   - printy_ui\app\pages\app\manager\quotes\index.vue (referenced in manager card links)
   - printy_ui\app\pages\app\manager\clients\index.vue (referenced in manager card links)
   - printy_ui\app\pages\app\buyer\index.vue (referenced in buyer store/index)
   - printy_ui\app\pages\track\index.vue (referenced via router/tracker)
   - printy_ui\app\pages\track\[token]\index.vue (referenced via router/tracker)
   - printy_ui\app\components\workbench\QuoteResponsesPanel.vue
   - printy_ui\tests\unit\buyer-tracker.test.ts
   - printy_ui\tests\unit\client-jobs-panel.test.ts
   - printy_ui\tests\unit\printer-view.test.ts
   - printy_ui\tests\unit\homepage-demo.test.ts
   - printy_ui\tests\unit\landing-law-4.test.ts
   - printy_ui\tests\unit\no-demo-in-built-features.test.ts
   - printy_ui\package.json
   - printy_ui\nuxt.config.ts
   - printy_ui\README.md

3. Output and prompt files already present at repo root:
   - law.txt
   - results.txt
   - prompt-results.txt
   - online-feedback.txt
   - prompt.txt
   - prompt 1.txt .. prompt 11.txt
   - prompt general.txt
   - prompt template.txt

4. The 4010-branch ThemeProvider concern is real but was not the blocker here;
   continue to use the app's existing theming primitives rather than touching globals.

5. The naming/tracking addendum targets these exact FE surfaces (confirmed by last
   read):
   - HomeView.greeting
   - BuyerView.greeting and BuyerJobsInProgress card titles
   - ClientJobsPanel card titles and track links
   - ManagerView.greeting and attention card titles
   - PrinterView and JobCard titles, stage labels and button labels
   - TrackView public + authed projections
   - TrackTicket titles, code chip, countdown and owner labels
   - TicketStepper stage projection

6. The addendum also names exact BE surfaces that must supply titles and names:
   - tracked-jobs endpoint (serializer + view) -> long+short job title
   - partner jobs list/detail (serializers + views + canonical) -> client name
   - printer job list/detail (serializers + views + assignment/booking) -> manager name
   - public tracked job lookup (serializer + view) -> long+short title + projections
   - one shared spec->title function; single source of truth for long and short forms

7. Anything not in this register is not yet confirmed as safe to skip; re-read before
   editing. This note is temporary scratch only.
"""
print(AGENT_NOTES_2026_10_31)
