/**
 * Client-facing paper quality.
 *
 * A buyer thinks in quality levels — "500 business cards on Premium paper" —
 * not in stock or press vocabulary. This module supplies only the client-facing
 * label for a quality level and the canonical paper request that level maps
 * onto, expressed in the `requested_paper_category` + `requested_gsm` pair the
 * current API already prices. It carries no pricing and no stock catalogue: the
 * backend config remains authoritative for which products exist and which
 * paper categories each accepts, and the price always comes from the public
 * preview endpoint.
 *
 * Press-sheet geometry (SRA3) and imposition are production configuration. They
 * are deliberately absent here — the buyer never chooses them, and the server's
 * `production_preview` renders the priced sheet read-only.
 */

import {
  configProductField,
  optionLabel,
  optionValue,
  type CalculatorConfig,
  type CalculatorProductConfig,
} from '~/shared/calculator-config'

/** The spec field a quality choice writes its category into. */
export const PAPER_CATEGORY_FIELD = 'requested_paper_category'

/** The spec field a quality choice writes its grammage into. */
export const PAPER_GSM_FIELD = 'requested_gsm'

/** Client-facing quality levels, cheapest first. `Cheap` is deliberately absent. */
export const PAPER_QUALITY_TIERS = [
  'Budget',
  'Economy',
  'Standard',
  'Professional',
  'Premium',
] as const

export type PaperQualityTier = (typeof PAPER_QUALITY_TIERS)[number]

interface PaperQualityOption {
  /** Client-facing quality level shown as the primary label. */
  tier: PaperQualityTier
  /** Canonical paper category sent to the API. */
  category: string
  /** Canonical grammage sent to the API. */
  gsm: number
  /** Technical detail shown as secondary text, e.g. "Matte 300 GSM". */
  technical: string
}

/**
 * The canonical paper configurations a customer may ask for, per product.
 *
 * Flyers are specified by weight alone; the category is the backend's
 * configured flyer default. Business cards are the currently configured card
 * stocks. Products are absent unless they actually support these options, and
 * each product only shows the subset its own config allows.
 */
const PAPER_QUALITY_BY_PRODUCT: Record<string, PaperQualityOption[]> = {
  flyer: [
    { tier: 'Budget', category: 'matt', gsm: 115, technical: '115 GSM' },
    { tier: 'Economy', category: 'matt', gsm: 130, technical: '130 GSM' },
    { tier: 'Standard', category: 'matt', gsm: 150, technical: '150 GSM' },
    { tier: 'Premium', category: 'matt', gsm: 170, technical: '170 GSM' },
  ],
  business_card: [
    { tier: 'Economy', category: 'matt', gsm: 250, technical: 'Matte 250 GSM' },
    { tier: 'Standard', category: 'matt', gsm: 300, technical: 'Matte 300 GSM' },
    { tier: 'Professional', category: 'matt', gsm: 350, technical: 'Matte 350 GSM' },
    { tier: 'Premium', category: 'ivory', gsm: 300, technical: 'Ivory 300 GSM' },
  ],
}

/** One selectable paper choice: a quality tier, or a bare category fallback. */
export interface PaperQualityChoice {
  /** Quality level, or `''` when the product has no tier for this category. */
  tier: PaperQualityTier | ''
  /** Primary label: the quality level, else the category name. */
  label: string
  /** Secondary technical detail, when the tier carries one. */
  sub?: string
  /** Value written to the spec's paper category field. */
  category: string
  /** Grammage written alongside the category; `0` leaves the weight untouched. */
  gsm: number
}

function tierRank(tier: PaperQualityTier): number {
  return PAPER_QUALITY_TIERS.indexOf(tier)
}

/** True when the product exposes the flat paper category step. */
export function supportsPaperQuality(product: CalculatorProductConfig | null): boolean {
  if (!product) {
    return false
  }
  if (product.allowed_paper_categories && product.allowed_paper_categories.length > 0) {
    return true
  }
  return Boolean(configProductField(product, PAPER_CATEGORY_FIELD)?.options?.length)
}

/**
 * The paper choices a product actually supports.
 *
 * A product with quality tiers shows those, restricted to the categories the
 * live config allows, so it never offers a level it cannot be printed on. A
 * product without tiers — or one whose tiers the config has since ruled out —
 * falls back to its allowed paper categories, labelled from the config, so no
 * paper option is lost.
 */
export function paperQualityChoices(
  product: CalculatorProductConfig | null,
  config: CalculatorConfig | null,
): PaperQualityChoice[] {
  if (!product) {
    return []
  }
  const allowed = product.allowed_paper_categories ?? []
  const fieldOptions = configProductField(product, PAPER_CATEGORY_FIELD)?.options ?? []
  const allCategories = config?.paper_categories ?? []
  const categoryLabel = (value: string) => {
    const option = [...fieldOptions, ...allCategories].find((o) => optionValue(o) === value)
    return option ? optionLabel(option) : value
  }
  const isAllowed = (value: string) => allowed.length === 0 || allowed.includes(value)

  const tiers = (PAPER_QUALITY_BY_PRODUCT[product.key] ?? [])
    .filter((option) => isAllowed(option.category))
    .slice()
    .sort((a, b) => tierRank(a.tier) - tierRank(b.tier))
    .map<PaperQualityChoice>((option) => ({
      tier: option.tier,
      label: option.tier,
      sub: option.technical,
      category: option.category,
      gsm: option.gsm,
    }))

  if (tiers.length > 0) {
    return tiers
  }

  return allowed.map<PaperQualityChoice>((value) => ({
    tier: '',
    label: categoryLabel(value),
    category: value,
    gsm: 0,
  }))
}

/** The quality choice matching a spec's category and grammage, if any. */
export function selectedPaperQuality(
  choices: PaperQualityChoice[],
  category: string | undefined,
  gsm: number | undefined,
): PaperQualityChoice | null {
  if (!category) {
    return null
  }
  const withGsm = choices.find((c) => c.tier !== '' && c.category === category && c.gsm === gsm)
  if (withGsm) {
    return withGsm
  }
  return choices.find((c) => c.category === category) ?? null
}

/** Step summary for the quality field, e.g. "Standard · Matte 300 GSM". */
export function paperQualitySummary(choice: PaperQualityChoice | null): string {
  if (!choice) {
    return ''
  }
  return [choice.label, choice.sub].filter(Boolean).join(' \u00b7 ')
}
