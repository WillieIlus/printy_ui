# Pinia Stores & Persistence

## Persistence Strategy

| Store | Persists? | Where | What |
|-------|-----------|-------|------|
| **auth** | Yes | **Cookies** | `tokens`, `rememberMe` — never localStorage |
| **localQuotes** | Yes | localStorage | Quote drafts (shop slug, customer info, pricing snapshot) |
| shop, quote, claim, profile, user, pricing, machine, subscription, paperStock | No | — | Session-only, refetched on mount |

## Rules

- **Tokens and auth state** → cookies only (`authCookieStorage` in `utils/auth-cookie-storage.ts`)
- **Quotes, pricing, drafts** → localStorage is acceptable (non-sensitive)
- **No store** should persist tokens or PII to localStorage

## Config (nuxt.config.ts)

```ts
piniaPersistedstate: {
  auto: false,  // Only stores with explicit persist: true | {} are persisted
  storage: 'localStorage',  // Default for opt-in stores; auth overrides with cookies
}
```

Stores opt in via `persist: true` or `persist: { key, storage, pick, ... }`. Auth uses custom cookie storage; localQuotes uses its own manual localStorage (not Pinia persist).
