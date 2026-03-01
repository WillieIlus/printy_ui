# Demo Data Overview

Client-side demo data that mirrors backend Django models. Used on the
landing page and template gallery to show pricing without hitting the API.

## Files

| File | Purpose |
|------|---------|
| `demoTypes.ts` | TypeScript interfaces that map 1:1 to backend serializers (Product, PrintingRate, Paper, FinishingRate, Material, Machine, Shop, Imposition) plus frontend-only form/preset types. |
| `demoRateCard.ts` | A complete rate card for a fictional shop ("PrintPro Nairobi"): machines, printing rates, papers, finishing rates, and large-format materials. Also exports flat lookup maps and template presets for the landing page simulator. |
| `demoTemplates.ts` | Gallery templates (DemoGalleryTemplate) — each is a DemoProduct with gallery extras (badge, copies_per_sheet, created_by_shop). Categories and helper functions included. |
| `demoPricing.ts` | `computeDemoQuote(template, rateCard)` — mirrors backend price logic: sheets = ceil(qty / copies_per_sheet), cost = paper + printing + finishing. Handles both SHEET and LARGE_FORMAT modes. |

## Data flow

```
DemoGalleryTemplate (product)
        │
        ├── pricing_mode: SHEET ──► copies_per_sheet ──► sheets needed
        │       │                                              │
        │       ├── default_sheet_size ──► match printing_rates[sheet_size]
        │       │                          match papers[sheet_size, gsm]
        │       │
        │       └── finishing_options[].finishing_rate ──► finishing_rates[id]
        │
        └── pricing_mode: LARGE_FORMAT ──► area_sqm = w × h × qty
                │
                ├── materials[0].selling_price × area
                └── finishing_options → finishing_rates[id]
```

## Backend field mapping

| Backend serializer | Demo type | Key fields |
|--------------------|-----------|------------|
| `ProductWriteSerializer` | `DemoProduct` | `id, name, pricing_mode, default_sides, min_quantity, default_sheet_size, min_gsm, max_gsm, finishing_options` |
| `PrintingRate` | `DemoPrintingRate` | `id, sheet_size, color_mode, single_price, double_price` |
| `PaperSerializer` | `DemoPaper` | `id, sheet_size, gsm, paper_type, selling_price` |
| `FinishingRateSerializer` | `DemoFinishingRate` | `id, name, charge_unit, price, setup_fee, min_qty` |
| `MaterialSerializer` | `DemoMaterial` | `id, material_type, unit, selling_price` |
| `MachineSerializer` | `DemoMachine` | `id, name, machine_type, max_width_mm, max_height_mm` |
| `ShopSerializer` | `DemoShop` | `id, name, slug, currency` |
| `Imposition` (model) | `DemoImposition` | `id, product, sheet_size, copies_per_sheet` |

## Cross-references

- `DemoGalleryTemplate.finishing_options[].finishing_rate` → `demoRateCard.finishing_rates[].id`
- `DemoGalleryTemplate.default_sheet_size` → `demoRateCard.papers[].sheet_size`
- `impositions[].product` → `templates[].id`
- All IDs are consistent across files (e.g. finishing rate id=1 is Lamination everywhere).

## Usage example

```vue
<script setup>
import { templates, getCategoryByKey } from '~/shared/demoTemplates'
import { demoRateCard } from '~/shared/demoRateCard'
import { computeDemoQuote } from '~/shared/demoPricing'

const price = computeDemoQuote(templates[0], demoRateCard)
// → { printing: 3750, material: 1400, finishing: 1250, total: 6400 }
</script>
```

## Consumers

| Component | What it uses |
|-----------|-------------|
| `TemplateGalleryBrowser.vue` | `templates`, `categories`, `demoRateCard`, `computeDemoQuote` |
| `LandingQuoteSimulator.vue` | `printingRates`, `materialRates`, `finishingRates` (flat maps), `DemoFormState` |
| `LandingTemplateGallery.vue` | `templatePresets`, `DemoPreset` |
| `pages/index.vue` | `DemoFormState`, `DemoPreset` (type-only) |
