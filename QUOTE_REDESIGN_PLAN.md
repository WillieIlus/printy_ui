# Quote UX Redesign — Implementation Plan

## Phase 0 — Audit & Map ✅

### Quote/Estimate Creation Flow
| Route | Purpose | Components | Stores | Price Calculation |
|-------|---------|------------|--------|-------------------|
| `/shops/[slug]` | Public shop page | PriceCalculatorWidget, RateCardDisplay | shop, pricing | `pricingStore.calculatePrice()` → API `shops/{slug}/calculate-price/` |
| `/shops/[slug]/request-quote` | Customer quote request | QuoteForm (customer info only) | shop, quote | None — backend creates request |
| `/dashboard/shops/[slug]/quotes/create` | Shop owner create quote | QuoteForm (customer info only) | quote | None — creates empty quote |
| `/dashboard/shops/[slug]/quotes/[id]` | Quote detail | QuoteCalculator, QuoteItemList | quote | `quoteStore.calculateQuote()` → API (requires existing quote) |

### Key Finding
- **PriceCalculatorWidget** lives on the PUBLIC shop page — has job specs (paper, gsm, quantity, sides, finishing) and calls `calculatePrice`.
- **Quote creation** (both flows) collects only customer info — NO pricing inputs.
- **Disconnect**: Shop owners cannot create a priced quote in one flow. They must create quote → add items separately.

### PriceCalculationResult (from API)
- `total_printing`, `total_paper`, `total_finishing`, `grand_total`, `price_per_sheet`
- `finishing_breakdown[]` — no explicit cost/profit split; backend returns selling prices.

### Current UX Issues
1. **No profit/margin visibility** — only "Total" shown; no cost breakdown vs selling price.
2. **Quote creation has no pricing** — shop owner creates quote with customer info only.
3. **Two separate flows** — calculator on shop page vs quote create in dashboard.
4. **No underpricing warning** — user can't override price; no risk signal.
5. **No cost breakdown** — API returns selling prices; buying costs may exist in backend but not exposed.

---

## Phase 1 — Business Output Panel (Checkpoint 1.1–1.3)

### Checkpoint 1.1: Create QuoteOutputPanel component
- New component: `app/components/quotes/QuoteOutputPanel.vue`
- Props: `pricing` (PriceCalculationResult | null), `overridePrice` (string | null), `loading`
- Emits: `update:overridePrice`
- Shows: Suggested Selling Price, Total Cost (from breakdown), Profit, Margin, Quote Time hint
- Cost breakdown table: Paper, Printing, Finishing, Wastage (0 if N/A), Machine (0 if N/A), Other

### Checkpoint 1.2: Create CostBreakdownTable component
- Reusable table with rows: label, amount, "(not configured)" for zeros

### Checkpoint 1.3: Integrate into PriceCalculatorWidget
- Add QuoteOutputPanel to the right column (replace/enhance current "Price Breakdown")
- Compute profit: if backend provides buying costs, use them; else estimate from margin or show "—"
- Add override price input; show underpricing warning when override < suggested

---

## Phase 2 — Fast Quote Workflow ✅

### 2.1 Copy as WhatsApp ✅
- `utils/quoteMessage.ts`: `buildQuoteMessage()`, `getWhatsAppShareUrl()`
- `QuoteActions.vue`: Copy (clipboard), WhatsApp (deep link)
- Message: shop name, job summary, suggested price, validity, contact

### 2.2 Save Quote (Option A: local) ✅
- `stores/localQuotes.ts`: addQuote, updateQuote, getById, removeQuote, localStorage persist
- Save Quote button in Output Panel → saves snapshot + cost breakdown

### 2.3 Export PDF ✅
- `pages/quote/print.vue`: print-friendly layout, `window.print()` on mount
- `/quote/print?id=draft_xxx` — opens in new tab, auto-prints

---

## Phase 3 — Language & KES (Checkpoint 3.1)

### 3.1 Labels + formatKES ✅
- "Suggested Selling Price", "Your Profit", "Profit Margin", "Cost Breakdown", "Underpricing Risk"
- "Set Customer Price" (was Override price)
- `formatKES()` in formatters — used throughout

---

## Phase 4 — IA Improvements ✅

### 4.1 Collapsible sections ✅
- `QuoteInputsSection.vue`: collapsible wrapper
- PriceCalculatorWidget: Print Specs (open), Materials (open), Finishing & Delivery (closed)

### 4.2 Sticky output panel ✅
- Desktop: `lg:sticky lg:top-24` on output panel
- Output panel always visible in right column

### 4.3 Quotes list ✅
- `pages/quotes/index.vue`: list of locally saved quotes, Export PDF, Delete
- "My Quotes" in header nav

---

## Execution Order
1. Phase 0 ✅ (this doc)
2. Phase 1.1 — QuoteOutputPanel
3. Phase 1.2 — CostBreakdownTable
4. Phase 1.3 — Integrate into PriceCalculatorWidget
5. Phase 3.1 — KES + labels (do early for consistency)
6. Phase 2.1 — Copy WhatsApp
7. Phase 2.2 — Save + PDF
8. Phase 4.1 — Unified create page
9. Phase 4.2 — Sticky panel
