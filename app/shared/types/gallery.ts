/** Gallery API types — public shops, templates, calculate response */

export interface PublicShopDTO {
  name: string
  slug: string
  logo?: string | null
  templates_count?: number
  /** Optional fields backend may include */
  description?: string | null
  city?: string | null
  state?: string | null
  is_verified?: boolean
}

/** Gallery-specific category (templates.ts has the main TemplateCategoryDTO) */
export interface GalleryTemplateCategoryDTO {
  name: string
  slug: string
  templates_count?: number
  display_order?: number
}

export interface TemplateListDTO {
  title: string
  slug: string
  preview_image: string | null
  base_price: string | number
  min_quantity?: number
  min_gsm?: number
  max_gsm?: number
  badges?: string[]
  shop?: { name: string; slug: string }
  category?: { name: string; slug: string }
}

export interface TemplateDetailDTO {
  title: string
  slug: string
  description?: string
  preview_image: string | null
  base_price: string | number
  min_quantity?: number
  min_gsm?: number
  max_gsm?: number
  options?: Array<{ id: number; name: string; price_modifier?: string | number }>
  finishings?: Array<{ id: number; name: string; price?: string | number; is_mandatory?: boolean }>
  constraints?: { gsm_min?: number; gsm_max?: number }
}

export interface CalculatePriceResponseDTO {
  breakdown: Array<{ label: string; amount: string | number }>
  total: string | number
  ups_per_sheet?: number | null
  sheets_needed?: number | null
  calculation_steps?: string[]
  notes?: string[]
}
