/**
 * Buyer-facing quality tiers (SIDE TASK 6B, S6-05).
 *
 * A buyer picks "Standard / Premium / Executive"; the calculator writes the
 * REAL stock + finishing values the backend already prices into the existing
 * calculator spec. Nothing here prices anything: the server remains the only
 * source of truth, and a tier is offered only when its mapped stock and
 * finishing currently exist for the selected product.
 *
 * ── TIER TABLE ────────────────────────────────────────────────────────────────
 * The owner's tier table was left blank, so every mapping below is a DRAFT
 * derived from the real option ids in the live calculator config
 * (printy_api services/pricing/calculator_config.py PRODUCT_DEFINITIONS and the
 * paper category choices). Each DRAFT row is marked in the map itself; none of
 * it is approved copy.
 *
 * Tier      | Hint (muted line)              | Business card | Flyer        | Booklet cover
 * Standard  | Everyday quality               | artcard 300   | matt 130     | artcard 300
 * Premium   | Thicker stock, silky finish    | matt 350      | gloss 170    | matt 300
 * Executive | Our best stock and finish      | ivory 300     | gloss 200    | ivory 300
 *
 * Products without a mapping (label stickers, letterheads, large format) show
 * no QUALITY row at all: the calculator keeps the store's existing defaults
 * rather than inventing a tier.
 */

import {
  configProductField,
  optionValue,
  type CalculatorConfig,
  type CalculatorProductConfig,
} from '~/shared/calculator-config'
import type { CalculatorSpec } from '~/shared/calculator-spec'

export type CalculatorTierId = 'standard' | 'premium' | 'executive'

export interface CalculatorTierDefinition {
  id: CalculatorTierId
  /** Chip label. Plain language only — never a stock or finishing name. */
  label: string
  /** Muted one-line hint shown under the selected tier. */
  hint: string
}

export const CALCULATOR_TIERS: CalculatorTierDefinition[] = [
  { id: 'standard', label: 'Standard', hint: 'Everyday quality' },
  { id: 'premium', label: 'Premium', hint: 'Thicker stock, silky finish' },
  { id: 'executive', label: 'Executive', hint: 'Our best stock and finish' },
]

export interface CalculatorTierMapping {
  tier: CalculatorTierId
  /** Spec field the stock is requested through (booklets use cover fields). */
  stockField: string
  stockValue: string
  /** Optional exact grammage requested with the stock. */
  gsmField?: string
  gsm?: number
  /** Finishing spec fields this tier writes (select values or booleans). */
  finishing: Record<string, string | boolean>
}

/**
 * DRAFT — derived from the real calculator option ids, not owner-approved.
 * Keys are the backend product keys from GET /calculator/config/.
 */
export const CALCULATOR_TIER_MAP: Record<string, CalculatorTierMapping[]> = {
  // DRAFT (business cards)
  business_card: [
    {
      tier: 'standard',
      stockField: 'requested_paper_category',
      stockValue: 'artcard',
      gsmField: 'requested_gsm',
      gsm: 300,
      finishing: { lamination: 'none', corner_rounding: false },
    },
    {
      tier: 'premium',
      stockField: 'requested_paper_category',
      stockValue: 'matt',
      gsmField: 'requested_gsm',
      gsm: 350,
      finishing: { lamination: 'matt-lamination', corner_rounding: false },
    },
    {
      tier: 'executive',
      stockField: 'requested_paper_category',
      stockValue: 'ivory',
      gsmField: 'requested_gsm',
      gsm: 300,
      finishing: { lamination: 'matt-lamination', corner_rounding: true },
    },
  ],
  // DRAFT (flyers)
  flyer: [
    {
      tier: 'standard',
      stockField: 'requested_paper_category',
      stockValue: 'matt',
      gsmField: 'requested_gsm',
      gsm: 130,
      finishing: { folding: 'none', lamination: 'none' },
    },
    {
      tier: 'premium',
      stockField: 'requested_paper_category',
      stockValue: 'gloss',
      gsmField: 'requested_gsm',
      gsm: 170,
      finishing: { folding: 'none', lamination: 'matt-lamination' },
    },
    {
      tier: 'executive',
      stockField: 'requested_paper_category',
      stockValue: 'gloss',
      gsmField: 'requested_gsm',
      gsm: 200,
      finishing: { folding: 'tri-fold', lamination: 'matt-lamination' },
    },
  ],
  // DRAFT (booklet covers; inserts stay on the store's defaults)
  booklet: [
    {
      tier: 'standard',
      stockField: 'requested_cover_paper_category',
      stockValue: 'artcard',
      gsmField: 'requested_cover_gsm',
      gsm: 300,
      finishing: { cover_lamination: 'none', binding_type: 'saddle_stitch' },
    },
    {
      tier: 'premium',
      stockField: 'requested_cover_paper_category',
      stockValue: 'matt',
      gsmField: 'requested_cover_gsm',
      gsm: 300,
      finishing: { cover_lamination: 'front', binding_type: 'saddle_stitch' },
    },
    {
      tier: 'executive',
      stockField: 'requested_cover_paper_category',
      stockValue: 'ivory',
      gsmField: 'requested_cover_gsm',
      gsm: 300,
      finishing: { cover_lamination: 'both', binding_type: 'perfect_bind' },
    },
  ],
}

export interface CalculatorTierChoice extends CalculatorTierDefinition {
  /** Exact spec changes the tier writes, ready to merge into the store spec. */
  patch: Record<string, string | number | boolean>
}

function stockFieldValues(
  product: CalculatorProductConfig,
  fieldKey: string,
): string[] {
  const field = configProductField(product, fieldKey)
  const fromOptions = (field?.options ?? []).map((option) => optionValue(option))
  if (fromOptions.length > 0) {
    return fromOptions
  }
  if (fieldKey === 'requested_cover_paper_category') {
    return product.allowed_cover_categories ?? []
  }
  if (fieldKey === 'requested_insert_paper_category') {
    return product.allowed_insert_categories ?? []
  }
  if (fieldKey === 'requested_paper_category') {
    return product.allowed_paper_categories ?? []
  }
  return []
}

function finishingIsAvailable(
  product: CalculatorProductConfig,
  key: string,
  value: string | boolean,
): boolean {
  // `false` is a no-op for a product that does not offer the option at all.
  if (value === false) {
    return true
  }
  const field = product.fields.find((candidate) => candidate.key === key)
  if (!field) {
    return false
  }
  if (typeof value === 'boolean') {
    return field.type === 'boolean'
  }
  if (field.type !== 'select') {
    return false
  }
  return (field.options ?? []).some((option) => optionValue(option) === value)
}

/**
 * The tiers a product can actually be printed on right now.
 *
 * A tier is dropped when its stock is not among the product's allowed
 * categories (or field options) or when any mapped finishing field is missing
 * from the product or lacks the mapped value. Order follows CALCULATOR_TIERS.
 */
export function calculatorTierChoices(
  product: CalculatorProductConfig | null,
  _config: CalculatorConfig | null,
): CalculatorTierChoice[] {
  if (!product) {
    return []
  }
  const mappings = CALCULATOR_TIER_MAP[product.key] ?? []
  if (mappings.length === 0) {
    return []
  }
  const choices: CalculatorTierChoice[] = []
  for (const definition of CALCULATOR_TIERS) {
    const mapping = mappings.find((candidate) => candidate.tier === definition.id)
    if (!mapping) {
      continue
    }
    const stocks = stockFieldValues(product, mapping.stockField)
    if (stocks.length > 0 && !stocks.includes(mapping.stockValue)) {
      continue
    }
    const finishingOk = Object.entries(mapping.finishing).every(([key, value]) =>
      finishingIsAvailable(product, key, value),
    )
    if (!finishingOk) {
      continue
    }
    const patch: Record<string, string | number | boolean> = {
      [mapping.stockField]: mapping.stockValue,
      ...mapping.finishing,
    }
    if (mapping.gsmField && mapping.gsm) {
      patch[mapping.gsmField] = mapping.gsm
    }
    choices.push({ ...definition, patch })
  }
  return choices
}

/** The tier whose stock + finishing the current spec already matches, if any. */
export function selectedCalculatorTier(
  choices: CalculatorTierChoice[],
  spec: CalculatorSpec | null,
): CalculatorTierChoice | null {
  if (!spec) {
    return null
  }
  const record = spec as unknown as Record<string, unknown>
  for (const choice of choices) {
    const matches = Object.entries(choice.patch).every(([key, value]) => {
      const current = record[key]
      if (typeof value === 'boolean') {
        return Boolean(current) === value
      }
      return String(current ?? '') === String(value)
    })
    if (matches) {
      return choice
    }
  }
  return null
}

/** Applies a tier to the current spec without pricing anything locally. */
export function applyCalculatorTier(
  spec: CalculatorSpec,
  choice: CalculatorTierChoice,
): CalculatorSpec {
  return { ...spec, ...choice.patch } as CalculatorSpec
}
