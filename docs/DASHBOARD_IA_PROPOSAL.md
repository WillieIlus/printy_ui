# Dashboard Information Architecture Proposal

Redesign of dashboard navigation and screens to clarify the quote workflow and eliminate confusion between "my quotes" and "your quotes."

---

## 1. Role-Based Dashboard Entry

The dashboard layout should **branch by user role**:

| Role | Entry Point | Primary Nav |
|------|-------------|-------------|
| **Customer** | `/dashboard` | Quote Requests, Saved Shops, My Jobs |
| **Print Shop** (has ≥1 shop) | `/dashboard` | Incoming Requests, Sent Quotes, Jobs, Notifications |
| **Staff** | `/dashboard` | Staff-only items (All Quotes, etc.) |

**Implementation**: Use `sellerStore.shops.length` and `authStore.user?.role` to show role-appropriate nav. Customers see Customer nav; users with shops see Print Shop nav; staff see both or a combined view.

---

## 2. A. Customer Dashboard Structure

### Nav Items (Customer)

| Label | Route | Icon | Description |
|-------|-------|------|-------------|
| Dashboard | `/dashboard` | `i-lucide-layout-dashboard` | Home / overview |
| Quote Requests | `/dashboard/quote-requests` | `i-lucide-file-search` | Requests I've sent to shops |
| Saved Shops | `/dashboard/favorites` or `/me/favorites` | `i-lucide-heart` | Shops I've favorited |
| My Jobs | `/dashboard/jobs?as_customer=1` | `i-lucide-briefcase` | Jobs from accepted quotes |
| Profile | `/dashboard/profile` | `i-lucide-user` | Profile & settings |

**Removed for customers**: "My Shops", "Quotes", "Claims", "Job Network" (overflow work), Shop dropdown (Machines, Papers, etc.).

**Add**: "Become a printer" CTA in profile or footer for customers who want to register as a shop.

---

### Customer: Quote Requests

**Screen**: `/dashboard/quote-requests`  
**Title**: "Quote Requests"  
**Subtitle**: "Requests you've sent to print shops. Track status and accept quotes."

**Status Tabs** (filter by QuoteRequest status):

| Tab Label | Backend Status(es) | Description |
|-----------|--------------------|-------------|
| Requested | `SUBMITTED`, `VIEWED` | Waiting for shop to respond |
| Quoted | `QUOTED` | Shop has sent a price — review and accept |
| Accepted | `ACCEPTED` | You accepted; job can be created |
| Completed | `CLOSED` | Done or declined |
| Cancelled | `CANCELLED` | You cancelled the request |
| Draft | `DRAFT` | Not yet submitted |

**Default tab**: "Quoted" or "Requested" (most actionable).

**Card content**: Shop name, request #, status badge, item count, total (if quoted), "View" button.

**Detail screen**: `/dashboard/quote-requests/[id]` — full request, items, latest shop quote, accept/cancel actions.

---

### Customer: Saved Shops

**Screen**: `/dashboard/favorites` (or reuse `/me/favorites`)  
**Title**: "Saved Shops"  
**Subtitle**: "Shops you've saved for quick access."

Reuse existing favorites component. Optional: show "Request quote" quick action per shop.

---

### Customer: My Jobs

**Screen**: `/dashboard/jobs?as_customer=1`  
**Title**: "My Jobs"  
**Subtitle**: "Print jobs from quotes you've accepted."

Filter jobs where user is the customer (from accepted quote). Reuse job list/detail components with customer filter.

---

## 3. B. Print Shop Dashboard Structure

### Nav Items (Print Shop)

| Label | Route | Icon | Description |
|-------|-------|------|-------------|
| Dashboard | `/dashboard` | `i-lucide-layout-dashboard` | Shop hub / overview |
| My Shops | `/dashboard/shops` | `i-lucide-store` | List of my shops |
| Incoming Requests | `/dashboard/shops/[slug]/incoming-requests` or `/dashboard/incoming-requests` | `i-lucide-inbox` | Quote requests from customers |
| Sent Quotes | `/dashboard/sent-quotes` | `i-lucide-send` | Quotes I've sent |
| Jobs | `/dashboard/jobs` | `i-lucide-briefcase` | Production jobs |
| Notifications | `/dashboard/notifications` | `i-lucide-bell` | Activity & alerts |
| Profile | `/dashboard/profile` | `i-lucide-user` | Profile & settings |

**Shop dropdown** (resources): Machines, Papers, Finishing, Materials, Pricing, Products — unchanged.

**Claims**: Keep under Profile or a secondary nav (Shop ownership claims).

---

### Print Shop: Incoming Requests

**Screen**: `/dashboard/shops/[slug]/incoming-requests` (per-shop) or `/dashboard/incoming-requests` (aggregate with shop filter)  
**Title**: "Incoming Requests"  
**Subtitle**: "Quote requests from customers. Send a quote or decline."

**Status Tabs**:

| Tab Label | Backend Status(es) | Description |
|-----------|--------------------|-------------|
| New | `SUBMITTED` | Not yet viewed |
| Viewed | `VIEWED` | You've viewed; ready to quote |
| Quoted | `QUOTED` | You've sent a quote |
| Closed | `CLOSED`, `CANCELLED` | Done or declined |

**Card content**: Customer name, request #, status, item count, created date, "View" / "Send quote" / "Decline".

**Detail screen**: `/dashboard/shops/[slug]/incoming-requests/[id]` — full request, items, send-quote form, decline.

---

### Print Shop: Sent Quotes

**Screen**: `/dashboard/sent-quotes`  
**Title**: "Sent Quotes"  
**Subtitle**: "Quotes you've sent to customers. Revise or create jobs."

**Status Tabs** (ShopQuote status):

| Tab Label | Backend Status(es) | Description |
|-----------|--------------------|-------------|
| Pending | `SENT`, `REVISED` | Awaiting customer response |
| Accepted | `ACCEPTED` | Customer accepted |
| Declined | `DECLINED` | Customer declined |
| Expired | `EXPIRED` | No longer valid |

**Card content**: Customer name, request #, total, status, revision #, "View" / "Revise" / "Create job".

**Detail screen**: `/dashboard/sent-quotes/[id]` — full quote, items, revise form, create job, share/WhatsApp.

---

### Print Shop: Jobs

**Screen**: `/dashboard/jobs`  
**Title**: "Jobs"  
**Subtitle**: "Production jobs from accepted quotes."

Keep existing job list/detail. Optional: filter by shop.

---

### Print Shop: Notifications

**Screen**: `/dashboard/notifications`  
**Title**: "Notifications"  
**Subtitle**: "Quote requests, accepted quotes, and job updates."

**New page**. List from `me/notifications/` API. Group by type: new request, quote accepted, job update, etc.

---

## 4. Label Replacements

**Global replacements** (apply across all screens and components):

| Current | Replace With | Context |
|---------|--------------|---------|
| My Quotes | Quote Requests | Customer (header, nav) |
| Your Quote | Quote Draft | Cart/draft page (`/quote-draft`) |
| Quotes | Incoming Requests **or** Sent Quotes | Shop nav — split by context |
| View Quotes | Quote Requests (customer) or Incoming Requests (shop) | QuickActions |
| Create Quote | Send Quote | Shop action |
| Manage quotes | Incoming Requests / Sent Quotes | Shop hub nav |

**Page-specific**:

| Page | Current Title | New Title |
|------|---------------|-----------|
| `/quotes` | My Quotes | Quote Requests |
| `/quote-draft` | Your Quote | Quote Draft |
| `/dashboard/quotes` | Quotes | Staff Quotes (staff only) |
| `/dashboard/shops/[slug]/quotes` | Quotes | Incoming Requests (or split) |
| Shop hub "Quotes" nav | Quotes | Incoming Requests |

**Avoid**: "My quotes", "Your quotes", "Quotes" (standalone). Use **Quote Requests** (customer) and **Incoming Requests** / **Sent Quotes** (shop).

---

## 5. Screen Mapping to Current Files

### Customer

| New Screen | Route | Current File | Action |
|------------|-------|--------------|--------|
| Quote Requests list | `/dashboard/quote-requests` | `pages/quotes/index.vue` | **Move/adapt** — change from `/quotes` to `/dashboard/quote-requests`, use `quote-requests/` API, add status tabs |
| Quote Request detail | `/dashboard/quote-requests/[id]` | `pages/quotes/[id].vue` | **Move/adapt** — change route, add accept/cancel |
| Quote Draft | `/quote-draft` | `pages/quote-draft.vue` | **Keep** — rename label to "Quote Draft" |
| Saved Shops | `/dashboard/favorites` | `pages/me/favorites.vue` | **Reuse** — add to dashboard nav |
| My Jobs | `/dashboard/jobs?as_customer=1` | `pages/dashboard/jobs/index.vue` | **Reuse** — add `as_customer` filter and customer-specific nav |

### Print Shop

| New Screen | Route | Current File | Action |
|------------|-------|--------------|--------|
| Incoming Requests list | `/dashboard/shops/[slug]/incoming-requests` | — | **New** — use `shops/{slug}/incoming-requests/` API |
| Incoming Request detail | `/dashboard/shops/[slug]/incoming-requests/[id]` | — | **New** — send-quote, decline |
| Sent Quotes list | `/dashboard/sent-quotes` | — | **New** — use `sent-quotes/` API |
| Sent Quote detail | `/dashboard/sent-quotes/[id]` | `pages/dashboard/shops/[slug]/quotes/[id].vue` | **Adapt** — route to `/dashboard/sent-quotes/[id]`, use `sent-quotes/` API |
| Jobs | `/dashboard/jobs` | `pages/dashboard/jobs/index.vue` | **Reuse** — add shop filter if needed |
| Notifications | `/dashboard/notifications` | — | **New** — use `me/notifications/` |

### Staff / Legacy

| Screen | Route | Current File | Action |
|--------|-------|--------------|--------|
| Staff Quotes | `/dashboard/quotes` | `pages/dashboard/quotes/index.vue` | **Keep** — staff only, rename to "Staff Quotes" |
| Shop-scoped quotes (legacy) | `/dashboard/shops/[slug]/quotes` | `pages/dashboard/shops/[slug]/quotes/index.vue` | **Replace** — redirect to Incoming Requests or Sent Quotes |

---

## 6. Component Reuse

| Component | Reuse For |
|-----------|-----------|
| `QuoteList` | Quote Requests list, Incoming Requests list, Sent Quotes list |
| `QuoteCard` | All list cards (with variant prop for customer vs shop) |
| `DashboardPageHeader` | All new pages |
| `DashboardEmptyState` | All empty states |
| `QuoteShareModal` | Sent Quote detail (share/WhatsApp) |
| `QuoteItemBreakdown` | Quote Request detail, Sent Quote detail |
| `QuoteItemAddForm` | Staff quote only |
| Status badges | All status tabs and cards |

---

## 7. Nav Layout Logic (Pseudocode)

```ts
// In dashboard layout
const isCustomer = computed(() => {
  const u = authStore.user
  const hasShops = sellerStore.shops.length > 0
  return !hasShops && (!u?.role || u.role === 'CUSTOMER')
})

const isShopOwner = computed(() => sellerStore.shops.length > 0)

const navItems = computed(() => {
  if (isCustomer.value) {
    return [
      { to: '/dashboard', label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
      { to: '/dashboard/quote-requests', label: 'Quote Requests', icon: 'i-lucide-file-search' },
      { to: '/dashboard/favorites', label: 'Saved Shops', icon: 'i-lucide-heart' },
      { to: '/dashboard/jobs?as_customer=1', label: 'My Jobs', icon: 'i-lucide-briefcase' },
      { to: '/dashboard/profile', label: 'Profile', icon: 'i-lucide-user' },
    ]
  }
  if (isShopOwner.value) {
    return [
      { to: '/dashboard', label: 'Dashboard', icon: 'i-lucide-layout-dashboard' },
      { to: '/dashboard/shops', label: 'My Shops', icon: 'i-lucide-store' },
      { to: '/dashboard/incoming-requests', label: 'Incoming Requests', icon: 'i-lucide-inbox' },
      { to: '/dashboard/sent-quotes', label: 'Sent Quotes', icon: 'i-lucide-send' },
      { to: '/dashboard/jobs', label: 'Jobs', icon: 'i-lucide-briefcase' },
      { to: '/dashboard/notifications', label: 'Notifications', icon: 'i-lucide-bell' },
      { to: '/dashboard/profile', label: 'Profile', icon: 'i-lucide-user' },
    ]
  }
  // Fallback / staff
  return defaultNavItems
})
```

---

## 8. Summary

| Area | Change |
|------|--------|
| **Customer** | Quote Requests (replaces "My Quotes"), Saved Shops, My Jobs |
| **Shop** | Incoming Requests, Sent Quotes, Jobs, Notifications |
| **Labels** | "Quote Requests", "Incoming Requests", "Sent Quotes" — no ambiguous "quotes" |
| **Status tabs** | Customer: Requested, Quoted, Accepted, Completed, Cancelled, Draft; Shop: New, Viewed, Quoted, Closed |
| **Reuse** | QuoteList, QuoteCard, DashboardPageHeader, QuoteShareModal, job components |
