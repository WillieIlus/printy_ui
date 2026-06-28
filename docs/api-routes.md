# Printy Frontend API Routes

The frontend uses standard DRF response shapes. Successful responses are endpoint-specific objects or lists. Error responses may be field maps, `{ "detail": "..." }`, or `{ "field_errors": { ... } }`. API base URLs may be configured without `/api`; the runtime helper appends `/api` automatically.

## Public / Guest

| Method | Path | Auth | Body / Query | Visible Response | Notes |
| --- | --- | --- | --- | --- | --- |
| GET/POST | `/api/calculator/public-preview/` | No | Product spec, quantity, finishing options | Public estimate range and calculator availability | Creates no database record; no shop identity or private financials. |
| POST | `/api/calculator/guest-drafts/` | No | `session_key`, calculator input snapshot, pricing snapshot, optional artwork token | Draft `id`, reference, snapshots | Stores an unclaimed draft with no shop. |

## Auth

| Method | Path | Auth | Body | Visible Response | Notes |
| --- | --- | --- | --- | --- | --- |
| POST | `/api/auth/login/` | No | `email`, `password` | `access`, `refresh`, role claims | Store JWT in cookies and send as `Authorization: Bearer <access>`. |
| POST | `/api/auth/register/` | No | `email`, `password`, `name`, `role`, optional `session_key`, `guest_draft_id` | Email verification status, `claimed_guest_draft_id` | Current backend requires email verification before login; it does not return JWTs on registration. |
| POST | `/api/auth/token/refresh/` | No | `refresh` | `access`, optional rotated `refresh` | Used by the global API client on 401. |

## Client

| Method | Path | Auth | Body | Visible Response | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/calculator/drafts/` | Client JWT | None | Client draft list | Shows only current user's drafts. |
| POST | `/api/calculator/drafts/` | Client JWT | Calculator input snapshot and optional `session_key` | Created or claimed draft | Draft has no shop. |
| POST | `/api/calculator/drafts/<id>/send/` | Client JWT | Optional request details | Created quote request | `QuoteRequest.shop` remains null; goes to manager queue. |
| POST | `/api/intake/submit/` | Client JWT | Draft ID or calculator input snapshot | Created quote request | Direct client intake; no shop routing. |
| GET | `/api/dashboard/client/quotes/` | Client JWT | None | Client-safe quotes, totals, statuses | Do not use `/api/quotes/`; that route is staff-only. |
| POST | `/api/quotes/<id>/accept/` | Client JWT | Optional payment phone | Accepted quote and payment object | Uses the quote/response ID. |
| GET | `/api/jobs/` | Client JWT | None | Client-safe managed jobs and status | No private financial internals. |
| POST | `/api/payments/stk-push/` | Client JWT | `quote_id`, `phone_number` | `checkout_request_id`, `payment_id`, status | Initiates M-Pesa STK push. |

## Manager / Broker

| Method | Path | Auth | Body | Visible Response | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/dashboard/manager/requests/` | Manager/Broker JWT | None | Assigned/pending quote requests | Compatibility alias for manager queue. |
| GET/POST | `/api/dashboard/partner/quotes/<id>/shop-options/` | Manager/Broker JWT | Match filters for POST | Production options and pricing signals | View currently posts filters; route is manager protected. |
| POST | `/api/dashboard/partner/quotes/<id>/prepare/` | Manager/Broker JWT | Shop, pricing snapshot, markup | Quote preview/split | Prepares manager quote response. |
| POST | `/api/dashboard/partner/quotes/create/` | Manager/Broker JWT | Quote request/client/shop/pricing payload | Created quote request and quote | Used for partner-created quotes. |
| GET | `/api/dashboard/partner/jobs/` | Manager/Broker JWT | None | Managed jobs with partner financial view | Includes client-facing totals needed by manager. |

## Shop

| Method | Path | Auth | Body | Visible Response | Notes |
| --- | --- | --- | --- | --- | --- |
| GET | `/api/shop/assignments/` | Shop JWT | None | Assigned jobs, specs, files, deadlines, `shop_payout` | Does not expose client total, broker margin, or Printy fee. |
| POST | `/api/shop/assignments/<id>/accept/` | Shop JWT | Optional `note` | Updated assignment | Compatibility alias for assignment accept. |
| POST | `/api/shop/assignments/<id>/complete/` | Shop JWT | Optional `note` | Updated assignment | Compatibility alias for completion. |
