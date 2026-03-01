import type { TemplateProviderShop } from './templates'

/** Catalog template (public gallery) */
export interface CatalogTemplate {
  id: number
  slug?: string
  title: string
  preview_image: string | null
  starting_price?: string | number
  base_price?: string | number
  badges?: string[]
  product_type?: string
  description?: string | null
  /** Shop that created/provides this template */
  created_by_shop?: TemplateProviderShop
  /** GSM constraints */
  min_gsm?: number
  max_gsm?: number
  allowed_gsm_values?: number[]
}
