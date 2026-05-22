# Printy UI

Nuxt frontend for `https://printy.ke`.

## Environment templates

- `.env.example` is the production-safe template.
- `.env.local.example` is the localhost development template.

Required production variables:

- `NUXT_PUBLIC_API_BASE_URL=https://api.printy.ke/api`
- `NUXT_PUBLIC_SITE_URL=https://printy.ke`

Production safety behavior:

- production fallback API base is `https://api.printy.ke/api`
- the frontend throws if `NUXT_PUBLIC_API_BASE_URL` is invalid in production
- the frontend throws if `NUXT_PUBLIC_API_BASE_URL` points to localhost in production

## Local development

```powershell
Copy-Item .env.local.example .env.local
yarn install
yarn dev
```

`NUXT_PUBLIC_API_BASE_URL` controls the frontend API root in local dev and production.

## Build checks

```powershell
yarn typecheck
yarn build
```

## Deployment note

The canonical deployment and smoke-test runbooks live in `printy_api/docs/PRODUCTION_DEPLOYMENT_RUNBOOK.md` and `printy_api/docs/PRODUCTION_SMOKE_TEST_CHECKLIST.md`.
