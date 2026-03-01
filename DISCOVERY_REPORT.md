# Template Price Calculation – Discovery Report

**Date:** 2025-02-20  
**Branch:** cursor/price-calculation-imposition-fields-2a7b

## Summary

This workspace is a **frontend-only** Nuxt 4 project. The backend (Django REST Framework) is a separate service at `NUXT_PUBLIC_API_BASE_URL` (e.g. `http://localhost:8000` or `https://amazingace00.pythonanywhere.com`). No backend Python code exists in this repo.

Findings below are inferred from frontend API paths, types, and usage.

---

## 1. Endpoint URL Patterns

| Endpoint | Path | Method | Scope |
|----------|------|--------|-------|
| Template list | `templates/` | GET | Global |
| Template categories | `templates/categories/` | GET | Global |
| Template detail | `templates/{slug}/` | GET | Global |
| **Template calculate price** | `templates/{slug}/calculate-price/` | POST | **Global** (template-scoped) |
| Shop calculate price | `shops/{slug}/calculate-price/` | POST | Shop-scoped |

**Note:** Template calculate-price is **global** (no shop in path). To use shop pricing, the request payload would need a `shop_slug` (or similar) parameter.

---

## 2. Request Payload – Template Calculate Price

From `app/shared/types/templates.ts`:

```typescript
interface TemplateCalculatePricePayload {
  quantity: number
  gsm: number
  print_sides: 'SIMPLEX' | 'DUPLEX'
  selected_option_ids?: number[]
  selected_finishing_ids?: number[]
}
```

**Missing for shop pricing:** `shop_slug` (or `shop`) – required to resolve shop-specific pricing.

---

## 3. Response Structure – Template Calculate Price

From `app/shared/types/templates.ts`:

```typescript
interface TemplatePriceResponseDTO {
  total: string | number
  breakdown?: TemplatePriceBreakdownItemDTO[]
  currency?: string
}

interface TemplatePriceBreakdownItemDTO {
  label: string
  amount: string | number
}
```

**Current fields:** `total`, `breakdown`, `currency`  
**No imposition fields** in the current response.

---

## 4. PrintTemplate / TemplateCategory (Frontend DTOs)

**PrintTemplateListDTO:** `id`, `slug`, `title`, `description`, `preview_image`, `dimensions_label`, `weight_label`, `starting_price`, `is_popular`, `is_best_value`, `is_new`, `badges`, `category`

**PrintTemplateDetailDTO:** Extends list + `grouped_options`, `mandatory_finishing`, `optional_finishing`, `min_quantity`

**TemplateCategoryDTO:** `id`, `name`, `slug`, `template_count`

**No `ups_per_sheet`** in frontend template types. Backend `PrintTemplate` model may or may not have it.

---

## 5. Usage of Template Calculate Price

- **`app/shared/api/templates.ts`:** `calculateTemplatePrice(slug, payload)` → POST to `templates/${slug}/calculate-price/`
- **Gallery page:** `app/pages/gallery/[slug].vue` uses `GalleryTemplateTweakerModal` with `PrintTemplateDetailDTO`
- **TemplateTweakerModal:** Uses **demo** pricing (`computeDemoQuote` + `demoRateCard`) – does **not** call the real template calculate-price API

So the template calculate-price API is defined but the gallery tweaker currently uses local demo data.

---

## 6. Shop Calculate Price (for comparison)

- Path: `shops/{slug}/calculate-price/`
- Used by: `pricingStore.calculatePrice(slug, input)` in `QuoteForm.vue`, `PriceCalculatorWidget.vue`
- Input: `PriceCalculationInput` (sheet_size, gsm, quantity, sides, paper_type, finishing_ids)

---

## 7. Backend Implementation Spec (for backend repo)

To implement imposition outputs and shop pricing:

### Model (if needed)

Add to `PrintTemplate` (or equivalent):

- `ups_per_sheet` – nullable `IntegerField` (units per sheet for imposition)

### Request payload

Add optional field:

- `shop_slug` – string, optional; when present, use that shop’s pricing instead of defaults

### Response (additive, backward-compatible)

Add to the calculate-price response:

- `ups_per_sheet` – int | null
- `sheets_needed` – int | null (ceil(quantity / ups_per_sheet) when ups_per_sheet is set)
- `calculation_steps` – array of strings, e.g. `["500 ÷ 25 = 20 sheets"]`
- `notes` – array of strings, e.g. `["Rounded up to whole sheets"]`

### Computation

- If template has `ups_per_sheet`: `sheets_needed = ceil(quantity / ups_per_sheet)`
- Append step: `"{quantity} ÷ {ups_per_sheet} = {sheets_needed} sheets"`
- If rounded up: append note `"Rounded up to whole sheets"`

---

## 8. Frontend Changes (this repo)

1. Extend `TemplatePriceResponseDTO` with optional imposition fields
2. Extend `TemplateCalculatePricePayload` with optional `shop_slug`
3. Add imposition display in components when present
4. Add utility + tests for imposition calculation (for fallback or validation)
