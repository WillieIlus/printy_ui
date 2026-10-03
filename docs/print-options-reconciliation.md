# Client-facing print options — old vs current reconciliation

Reference implementation inspected: `printy_ui_old_0.3-main`.
Old API inspected for technical mapping: `printy_api_old_0.3-main`.
Current API (`printy_api`) is authoritative for products, pricing and production.

## Old — `printy_ui_old_0.3-main`

| Concern | Implementation |
| --- | --- |
| Product selection | `app/components/marketing/HomeHeroCalculator.vue:1141` — `config.value.products` from `GET /calculator/config/`, one card per product. |
| Paper options source | `HomeHeroCalculator.vue:1148` — `selectedProduct.paper_stocks \|\| selectedProduct.paper_options \|\| config.paper_stocks`, i.e. real `Paper` rows aggregated by the backend, each carrying `key` (slug of `category-marketplace_label-gsm`), `label`/`display_name` and `gsm`. |
| Quality label | `HomeHeroCalculator.vue:2158` `stockTierLabel()` — a pure GSM-threshold derivation: `>=400 Luxury`, `>=340 Premium`, `>=280 Standard`, else `Budget`. |
| GSM representation | `HomeHeroCalculator.vue:2153` `stockWeightLabel()` → `"<gsm>gsm"`, shown as tertiary text on unselected chips. |
| Rendering | `HomeHeroCalculator.vue:167-188`. Section header **"Paper quality"**; each chip shows the tier as the **primary** bold line and the technical stock name as the **secondary** line. |
| SRA3 / imposition | No selector anywhere. `parentSheet` (`HomeHeroCalculator.vue:1664`) defaults to `'SRA3'` but only feeds `impositionPrimaryLabel` / `impositionSecondaryLabel` (`:1680-1681`), which the template never references — the imposition is display-only. |
| Submitted value | `selectPaperStock()` (`:1199`) → `form.paper_stock = stock.key` **and** `form.requested_gsm = gsm`; posted to the preview/draft endpoints. |

Net: the customer chose a **quality tier**, saw the stock name and weight as
secondary detail, and never saw press-sheet or imposition vocabulary.

## Current — `printy_ui`

| Concern | Implementation |
| --- | --- |
| Product selection | `app/components/workbench/views/CalculatorView.vue:488-508` — same `config.products` source, rendered as cards. Unchanged and correct. |
| Paper options source | `app/shared/calculator-config.ts` + the backend config. `paper_stocks` / `paper_options` were **deliberately removed** from `GET /calculator/config/` (`services/pricing/calculator_config.py:328-329, 418-426`; asserted by `api/test_calculator_paper_selection.py:41-46`). |
| What the customer actually sees | Two raw technical steps: `requested_paper_category` chips labelled with backend category names (`Matt`, `Gloss`, `Bond`, `Ivory`, `Art Card`, `Tictac`, `Conqueror`, `Special Paper`, `Other`), and a free `requested_gsm` number input with a ±10 stepper (`CalculatorView.vue:581-594`). |
| Quality label | **None.** No tier vocabulary exists anywhere in `app/`. |
| GSM representation | Raw number typed by the customer, unit label `"grammes"`. |
| SRA3 / imposition | No selector. `app/components/workbench/calculator/ImpositionSheet.vue` renders the server's `production_preview.press_sheet` read-only. Already correct — no change needed. |
| Submitted value | `requested_paper_category` + `requested_gsm` via `specPublicPayload()` (`app/shared/calculator-spec.ts:176-193`) → `POST /calculator/public-preview/`. The backend resolves the technical paper from these in `services/pricing/calculator_preview.py:1085-1107` and `services/production_matching.py:103-134`. |

## What was lost / regressed

1. **The client-facing quality tier is gone.** The old UI's primary label was
   Budget / Standard / Premium. The current UI leads with backend vocabulary
   ("Matt", "Art Card", "Special Paper") that a buyer cannot evaluate.
2. **The old tier labels were also wrong for flyers.** `stockTierLabel()` uses
   a `>=280` threshold, so a 115–170 GSM flyer sheet — the entire flyer range —
   was labelled "Budget". The flyer mapping had to be restated, not copied.
3. **Paper weight became free text.** The old chips carried a concrete `gsm`
   from a real `Paper` row; the current stepper lets the customer invent one.
4. **The single "Paper quality" decision became two decoupled steps**, so the
   category and the weight could disagree.

## What is already correct and must not change

- The current payload contract (`requested_paper_category` + `requested_gsm`).
  The old `paper_stock` key is legacy-only: the backend tolerates it for old
  drafts (`calculator_preview._map_legacy_paper_request`) and the current
  calculator never sends it.
- `paper_stocks` / `paper_options` staying out of the config — that is a
  deliberate, tested architectural decision (buyers express a *preference*;
  the shop matches real stock). It is **not** restored here.
- SRA3 as the backend/production default, and the read-only imposition preview.
- No frontend pricing. Every price comes from `public-preview`.

## Change made

`app/shared/paper-quality.ts` adds the client-facing label layer the old UI
had, on top of the current contract:

- Tier ladder: **Budget → Economy → Standard → Professional → Premium**.
  `Cheap` is never used.
- Flyers: `115 → Budget`, `130 → Economy`, `150 → Standard`, `170 → Premium`.
- Business cards: `Matte 250 → Economy`, `Matte 300 → Standard`,
  `Matte 350 → Professional`, `Ivory 300 → Premium`.
- A chip writes `requested_paper_category` + `requested_gsm` — the same two
  fields the API already prices. It introduces no endpoint and no price.
- Options are filtered against the live config's `allowed_paper_categories`, so
  a product only ever shows tiers it actually supports, and any allowed
  category without a tier mapping is still offered as a plain chip so no
  capability is lost for stickers, letterheads or booklets.
- The existing exact-weight `requested_gsm` step is kept as a secondary
  refinement beneath the quality choice.
