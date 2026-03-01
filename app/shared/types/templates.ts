/** Template gallery types — backend serializers */

export interface TemplateCategoryDTO {
  id?: number
  name: string
  slug: string
  template_count?: number
  templates_count?: number
  display_order?: number
}

export interface TemplateGsmConstraints {
  /** Minimum GSM allowed (e.g. 250) */
  gsm_min?: number | null
  /** Maximum GSM allowed (e.g. 350) */
  gsm_max?: number | null
}

/** Provider shop info when template is created by a shop */
export interface TemplateProviderShop {
  name: string
  slug: string
}

export interface PrintTemplateListDTO {
  id: number
  slug: string
  title: string
  description?: string
  preview_image: string | null
  dimensions_label?: string
  weight_label?: string
  starting_price: string | number
  is_popular?: boolean
  is_best_value?: boolean
  is_new?: boolean
  badges?: string[]
  category?: { id: number; name: string; slug: string }
  /** GSM constraints for price calculation */
  gsm_min?: number | null
  gsm_max?: number | null
  /** Shop that created/provides this template */
  created_by_shop?: TemplateProviderShop
  /** GSM constraints — use allowed_gsm_values if set, else min/max range */
  min_gsm?: number
  max_gsm?: number
  allowed_gsm_values?: number[]
}

export interface TemplateOptionDTO {
  id: number
  name: string
  option_group?: string
  price_modifier?: string | number
}

export interface TemplateFinishingDTO {
  id: number
  name: string
  description?: string
  price?: string | number
  is_mandatory?: boolean
}

export interface GroupedOptionDTO {
  group_name: string
  options: TemplateOptionDTO[]
}

/** Shop capability caps returned when template has provider shop (e.g. max gsm) */
export interface TemplateShopCapability {
  max_gsm?: number
}

export interface PrintTemplateDetailDTO extends Omit<PrintTemplateListDTO, 'category'> {
  description?: string
  grouped_options: GroupedOptionDTO[]
  mandatory_finishing: TemplateFinishingDTO[]
  optional_finishing: TemplateFinishingDTO[]
  min_quantity?: number
  /** Ups per sheet (imposition) — from backend when available */
  ups_per_sheet?: number | null
  imposition_count?: number
  /** Provider shop capability caps (e.g. max_gsm) — intersect with template constraints */
  shop_capability?: TemplateShopCapability
}

export interface TemplatePriceBreakdownItemDTO {
  label: string
  amount: string | number
}

export interface TemplatePriceResponseDTO {
  total: string | number
  breakdown?: TemplatePriceBreakdownItemDTO[]
  currency?: string
  /** Imposition: units per sheet (from template or computed) */
  ups_per_sheet?: number | null
  /** Imposition: sheets needed = ceil(quantity / ups_per_sheet) */
  sheets_needed?: number | null
  /** Human-readable calculation steps e.g. ["500 ÷ 25 = 20 sheets"] */
  calculation_steps?: string[]
  /** Notes e.g. ["Rounded up to whole sheets"] */
  notes?: string[]
}

export interface TemplateCalculatePricePayload {
  quantity: number
  gsm: number
  print_sides: 'SIMPLEX' | 'DUPLEX'
  selected_option_ids?: number[]
  selected_finishing_ids?: number[]
  /** Shop slug to use shop-specific pricing (optional) */
  shop_slug?: string
}

/** Format GSM constraint for display, e.g. "250–350gsm" or "Max 200gsm" */
export function formatGsmConstraint(t: { gsm_min?: number | null; gsm_max?: number | null }): string | null {
  const min = t.gsm_min ?? null
  const max = t.gsm_max ?? null
  if (min != null && max != null) return `${min}–${max}gsm`
  if (min != null) return `Min ${min}gsm`
  if (max != null) return `Max ${max}gsm`
  return null
}
