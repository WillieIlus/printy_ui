# Next steps – PrintShop UI

## Done in this pass

- **Design:** Pages and layouts aligned with `sample.txt` (slate palette, primary blue, rounded-2xl/3xl, sticky header with backdrop-blur, CTA/footer styling).
- **Environment:** `.env` uses `NUXT_PUBLIC_API_BASE_URL` (server root). Local: `http://localhost:8000`. Production: set to `https://amazingace00.pythonanywhere.com` on Netlify.
- **Forgot password:** `ForgotPasswordForm` calls `authStore.requestPasswordReset(email)`. API paths: `api-auth/password/reset/` (POST `{ email }`). Change paths in `shared/api-paths.ts` if your backend differs.
- **Reset password:** Page at `auth/reset-password` reads `uid` and `token` from query, form submits via `authStore.resetPassword(uid, token, newPassword)`. API: `api-auth/password/reset/confirm/` (POST `{ uid, token, new_password }`). Adjust body keys to match backend (e.g. `new_password1`/`new_password2`).
- **Shops nearby:** `shops/nearby` requests geolocation on load and calls `shopStore.fetchNearbyShops({ lat, lng, radius: 25 })`. User sees an error message if location is denied or unsupported, with “Try again”.
- **Error boundary:** `app/error.vue` shows a friendly error message with “Try again” (clears error and redirects) and “Go home”.

---

## 1. Run and test

1. **Start dev server:** `pnpm dev`
2. **Test auth:** Sign up, login, logout. Forgot password (sends request to backend when endpoint exists). Reset password (use link with `?uid=...&token=...` from backend email).
3. **Test dashboard:** Profile, My shops, create shop, shop detail, members/hours, quotes list/create/detail, product templates, claims list/detail, My quotes.
4. **Test public:** Shops list, shop by slug, request quote. Shops nearby (allow location to load nearby shops).

---

## 2. Backend alignment

- **Password reset:** If your Django (or other) backend uses different URL paths or body fields, update `shared/api-paths.ts` (`auth.forgotPassword`, `auth.resetConfirm`) and `stores/auth.ts` (`resetPassword` body: e.g. `new_password1`, `new_password2`, or `token` only).
- **CORS:** Ensure the API allows requests from your dev origin (e.g. `http://localhost:3000`).

---

## 3. Optional improvements

- **Empty states:** Reuse the “No quotes yet” / “No claims yet” pattern (icon + message + optional CTA) on other list pages.
- **Profile edit:** Align `ProfileEditForm` fields (phone, bio, address, city, state, country, postal_code) with `profileStore.updateProfile` payload.
- **Product template detail:** Implement `dashboard/shops/[slug]/products/[id]` (view/edit) and wire to product template API when available.

---

## 4. Deploy

1. **Build:** `pnpm build`
2. **Preview:** `pnpm preview` (test production build locally)
3. **Hosting:** Deploy the output (e.g. to Netlify). Set `NUXT_PUBLIC_API_BASE_URL` to `https://amazingace00.pythonanywhere.com` in Site settings so production uses the correct backend.
