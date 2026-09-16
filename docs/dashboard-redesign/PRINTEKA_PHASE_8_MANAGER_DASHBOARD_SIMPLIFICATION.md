# Printy Phase 8 Manager Dashboard Simplification

Status: COMPLETED
Date: 2026-07-30

## Contract

- Manager overview is queue-first through `WorkflowNextAction` and `data-manager-overview-next-action="true"`.
- Manager work rows are exposed through `data-manager-overview-queue="true"` and prioritize quote prep, exceptions, accepted work requiring dispatch, client-waiting quotes, production follow-up, and messages.
- Quote-prep safety is visible in the rail through `data-manager-overview-rail="quote-safety"`.
- Visible Manager copy is used on manager-facing pages; technical `partner` route/service names remain unchanged.
- Quote preparation, pricing preview, markup, shop/client selection, explicit draft save, and send-to-client behavior remain in `app/pages/dashboard/partner/[section].vue`.
- No backend, pricing formula, payment provider, auth, permission, migration, or workflow-transition logic changed.

## Draft Safety Finding

- `savePartnerQuoteDraft` persists through `createPartnerQuote(buildPartnerQuotePayload({ save_as_draft: true }))`.
- `submitPartnerQuote` creates a draft with `save_as_draft: true` before `sendPartnerQuoteToClient`.
- Pricing preview still uses `previewManagerQuotePricing` for assigned requests and existing production match/pricing preview paths for walk-in quotes.
- Unsaved modal state remains local: quote specs, selected shop, pricing preview, markup, client search/selection, new-client form, and send errors.
- Full quote-prep migration is deferred to Phase 11 unless state preservation and refresh/navigation behavior are explicitly tested.

## Verification

- 2026-07-30: `yarn typecheck` passed.
- 2026-07-30: `yarn test:quote-workflow` passed.
- 2026-07-30: `yarn test:components` passed.

## Deferred

- Browser screenshots for manager overview, requests, quotes, jobs, quote prep current state, quote detail, and mobile.
- Manual prepare-and-send quote, dispatch accepted job, and manager messages walkthrough.
- Any full-page quote-prep migration or automatic autosave.