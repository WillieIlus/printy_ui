/** Gallery API types — public shops, templates, calculate response */

/** Product gallery category (from GET /api/products/gallery/) */
export interface GalleryCategoryDTO {
  id: number
  name: string
  slug: string
  icon_svg_path?: string
  description?: string
}

/** Product gallery product (from GET /api/products/gallery/) */
export interface GalleryProductDTO {
  id: number
  title: string
  slug: string
  description?: string
  preview_image: string | null
  dimensions_label?: string
  weight_label?: string
  is_popular: boolean
  is_best_value: boolean
  is_new: boolean
  shop?: { id: number; name: string; slug: string } | null
}

/** Gallery API response: categories with products */
export interface ProductsGalleryResponse {
  categories: Array<{
    category: GalleryCategoryDTO
    products: GalleryProductDTO[]
  }>
}

/** Public product options (GET /api/public/products/{id}/options/) — for tweak modal */
export interface GalleryProductOptions {
  id: number
  name: string
  description?: string
  pricing_mode: 'SHEET' | 'LARGE_FORMAT'
  default_finished_width_mm?: number
  default_finished_height_mm?: number
  default_sides?: 'SIMPLEX' | 'DUPLEX'
  min_quantity?: number
  min_gsm?: number | null
  max_gsm?: number | null
  allow_simplex?: boolean
  allow_duplex?: boolean
  available_papers?: Array<{ id: number; sheet_size: string; gsm: number; paper_type: string; selling_price: string }>
  available_materials?: Array<{ id: number; material_type?: string; unit: string; selling_price: string }>
  available_finishings?: Array<{ id: number; name: string; price: string; charge_unit?: string }>
  available_machines?: Array<{ id: number; name: string; machine_type: string }>
}

/** Gallery calculate-price response (stub or real) */
export interface GalleryCalculatePriceResponse {
  product_id: number
  product_slug: string
  breakdown: {
    material?: number
    printing?: number
    finishing?: number
    total?: number
  }
  message?: string
}

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
