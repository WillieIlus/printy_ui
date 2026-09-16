# Frontend Label Cleanup Summary

## Changed UX Language

### Customer Side

| Before | After |
|--------|-------|
| My Quotes | Quote Requests |
| Your Quote | Quote Draft |
| Items in your quote | Items in your draft |
| No items in your quote | No items in your draft |
| No quotes yet | No quote requests yet |
| Quotes saved locally... | Requests you've sent to print shops... |
| Sign in to submit your quote | Sign in to submit your quote request |
| Get an estimate for your quote | Get an estimate for your draft |
| Added to your quote | Added to your draft |

### Shop Side

| Before | After |
|--------|-------|
| Quotes | Incoming Requests |
| View and manage print quotes for this shop | Quote requests from customers. Send a quote or decline. |
| Manage quotes | Incoming requests |
| Create Quote | Send Quote |
| Quotes today | Requests today |
| No quotes yet | No incoming requests yet |
| Manage quotes, pricing, and print jobs | Manage incoming requests, pricing, and print jobs |

### Shared

| Before | After |
|--------|-------|
| Job Network | Jobs |
| View Quotes (QuickActions) | Incoming Requests |

### Staff

| Before | After |
|--------|-------|
| Quotes (page title) | Staff Quotes |
| Create Quote | New Quote |

### App Header & Nav

| Before | After |
|--------|-------|
| My Quotes (dropdown) | Quote Requests |
| Your Quote (nav link) | Quote Draft |
| Quotes (dashboard sidebar) | Incoming Requests |
| Quotes (bottom nav) | Requests |

### Routing Logic (AppHeader)

- **Customers** (no shops): Quote Requests → `/quotes`
- **Shop owners / staff**: Quote Requests → `/dashboard/quotes`

---

## Files Modified

- `app/components/AppHeader.vue`
- `app/components/dashboard/DashboardBottomNav.vue`
- `app/components/dashboard/DashboardSidebar.vue`
- `app/components/dashboard/DashboardShopHeader.vue`
- `app/components/dashboard/QuickActions.vue`
- `app/components/quotes/GuestSubmitModal.vue`
- `app/components/quotes/ProductTweakModal.vue`
- `app/components/quotes/QuoteList.vue`
- `app/components/quotes/QuotePreviewPrice.vue`
- `app/components/GalleryTweakQuoteModal.vue`
- `app/components/home/HomeHeroDemo.vue`
- `app/layouts/dashboard.vue`
- `app/layouts/README.md`
- `app/pages/auth/login.vue`
- `app/pages/dashboard/index.vue`
- `app/pages/dashboard/jobs/index.vue`
- `app/pages/dashboard/quotes/index.vue`
- `app/pages/dashboard/shops/[slug]/index.vue`
- `app/pages/dashboard/shops/[slug]/quotes/index.vue`
- `app/pages/gallery/index.vue`
- `app/pages/gallery/[shopSlug]/index.vue`
- `app/pages/quote-draft.vue`
- `app/pages/quotes/index.vue`
- `app/pages/quotes/[id].vue`
- `app/pages/shops/[slug]/index.vue`
- `app/stores/quote.ts`
