# Printy Phase 1 Route Contract

Execution date: 2026-07-29

Status: COMPLETED

## Canonical Routes

| Surface | Canonical route | Notes |
| --- | --- | --- |
| Client dashboard | `/dashboard/client` | Client primary nav excludes Track Job. Jobs own authenticated tracking context. |
| Client quotes | `/dashboard/client/quotes` | Client quote notifications target this route or quote detail. |
| Client jobs | `/dashboard/client/jobs` | Managed-job notifications for clients target this route or job detail. |
| Manager dashboard | `/dashboard/partner` | Technical route remains partner for now; visible label is Manager. |
| Manager alias | `/dashboard/manager/**` | Redirect-only compatibility alias to `/dashboard/partner/**`. |
| Manager quotes | `/dashboard/partner/quotes` | Manager quote request notifications target this route or quote detail. |
| Manager jobs | `/dashboard/partner/jobs` | Managed-job notifications for Managers target this route or job detail. |
| Production dashboard | `/dashboard/production` | Canonical production/print-shop workspace. |
| Shop alias | `/dashboard/shop/**` | Redirect-only compatibility alias to `/dashboard/production/**`. |
| Production assignments | `/dashboard/production/assignments` | Production quote-request targets use this route. |
| Production jobs | `/dashboard/production/jobs` | Managed-job notifications for production users target this route or job detail. |
| Admin dashboard | `/dashboard/admin` | Exception-first admin entry. Broad directories remain deferred. |
| Authenticated track utility | `/dashboard/track-job` and `/dashboard/track-job/:token` | Utility/compatibility only; not primary left navigation. |

## Navigation Contract

- Primary role navigation is defined in `app/shared/dashboard-navigation.ts`.
- User-facing role label for `partner` is `Manager`.
- `/dashboard/partner/**` remains the technical route in Phase 1.
- `/dashboard/manager/**` remains redirect-only and must not become a duplicate interface.
- `/dashboard/shop/**` remains redirect-only and must not become a duplicate interface.
- Track Job is allowed as a dashboard utility route, but must not appear in primary role navigation.
- Admin navigation is exception-first and contains no disabled placeholder items.

## Notification Target Contract

- Quote request notifications target role dashboards:
  - client: `/dashboard/client/quotes/:id`
  - Manager: `/dashboard/partner/quotes/:id`
  - production shop owner: `/dashboard/production/assignments/:id`
  - admin: `/dashboard/admin`
- Managed-job notifications target role dashboards:
  - client: `/dashboard/client/jobs/:id`
  - Manager: `/dashboard/partner/jobs/:id`
  - production: `/dashboard/production/jobs/:id`
  - admin: `/dashboard/admin`
- Notification targets must not use root `/quotes/:id`, root `/dashboard/jobs/:id`, or legacy `/dashboard/shops/**`.

## Deferred

- Full technical route migration from `/dashboard/partner/**` to `/dashboard/manager/**`.
- Public `/track-job/:token` restoration or final removal decision.
- Full shared shell rollout across every role page.
- Broad admin directories and permissions.
- Quote-preparation migration.
