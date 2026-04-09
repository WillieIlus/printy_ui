/**
 * Seller (Printy_API) shop-scoped resources.
 * Shops are identified by slug; sub-resources by numeric pk.
 */
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'
import { parseApiError } from '~/utils/api-error'

// ---------------------------------------------------------------------------
// Types (match Printy_API serializers)
// ---------------------------------------------------------------------------

export interface SellerShop {
  id: number
  name: string
  slug: string
  currency: string
  is_active: boolean
}

export interface Machine {
  id: number
  name: string
  machine_type: string
  max_width_mm: number
  max_height_mm: number
  min_gsm: number | null
  max_gsm: number | null
  is_active: boolean
}

export interface Paper {
  id: number
  sheet_size: string
  gsm: number
  paper_type: string
  width_mm: number | null
  height_mm: number | null
  buying_price: string
  selling_price: string
  quantity_in_stock: number | null
  reorder_level: number | null
  is_active: boolean
}

export interface FinishingCategory {
  id: number
  name: string
  slug: string
  description: string
}

export interface FinishingRate {
  id: number
  name: string
  category: number | null
  category_detail: FinishingCategory | null
  charge_unit: string
  billing_basis: string
  side_mode: string
  price: string
  double_side_price: string | null
  setup_fee: string | null
  min_qty: number | null
  minimum_charge?: string | null
  display_unit_label?: string
  help_text?: string
  is_active: boolean
}

export interface Material {
  id: number
  material_type: string
  unit: string
  buying_price: string
  selling_price: string
  is_active: boolean
}

export interface ProductFinishingOption {
  finishing_rate: number
  is_default?: boolean
  price_adjustment?: string | null
}

export interface Product {
  id: number
  name: string
  description: string
  category: number | null
  product_kind?: 'FLAT' | 'BOOKLET'
  pricing_mode: string
  default_binding_type?: 'SADDLE_STITCH' | 'PERFECT_BIND' | 'WIRE_O' | '' | null
  booklet_min_pages?: number | null
  booklet_max_pages?: number | null
  booklet_page_multiple?: number | null
  saddle_stitch_recommended_max_pages?: number | null
  perfect_bind_recommended_min_pages?: number | null
  creep_warning_start_pages?: number | null
  default_finished_width_mm: number
  default_finished_height_mm: number
  default_sheet_size?: string | null
  default_machine?: number | null
  default_bleed_mm: number
  turnaround_days?: number | null
  turnaround_hours?: number | null
  standard_turnaround_hours?: number | null
  rush_turnaround_hours?: number | null
  rush_available?: boolean
  buffer_hours?: number | null
  queue_hours?: number | null
  estimated_ready_at?: string | null
  human_ready_text?: string | null
  turnaround_label?: string | null
  min_quantity?: number
  min_width_mm?: number | null
  min_height_mm?: number | null
  max_width_mm?: number | null
  max_height_mm?: number | null
  min_gsm?: number | null
  max_gsm?: number | null
  allowed_sheet_sizes?: string[] | null
  allow_simplex?: boolean
  allow_duplex?: boolean
  default_sides: string
  status?: string
  is_active: boolean
  is_public?: boolean
  can_calculate?: boolean
  pricing_ready?: boolean
  publish_block_reason?: string
  finishing_options?: ProductFinishingOption[]
}

/** Printing rate per sheet — Single (simplex) and Double (duplex). Kenyan price list style. */
export interface PrintingRate {
  id: number
  sheet_size: string
  color_mode: string
  single_price: string
  double_price: string
  is_active: boolean
}

// ---------------------------------------------------------------------------
// Shops
// ---------------------------------------------------------------------------

export async function listSellerShops(): Promise<SellerShop[]> {
  const api = useApi()
  const data = await api<SellerShop[] | { results: SellerShop[] }>(API.shops())
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: SellerShop[] }).results)) {
    return (data as { results: SellerShop[] }).results
  }
  return []
}

export async function getSellerShop(id: number): Promise<SellerShop> {
  const api = useApi()
  return await api<SellerShop>(API.sellerShopDetail(id))
}

export interface CreateShopInput {
  name: string
  slug?: string
  currency?: string
  is_active?: boolean
}

export async function createSellerShop(body: CreateShopInput): Promise<SellerShop> {
  const api = useApi()
  return await api<SellerShop>(API.shops(), { method: 'POST', body })
}

// ---------------------------------------------------------------------------
// Machines
// ---------------------------------------------------------------------------

export async function listMachines(shopId: number): Promise<Machine[]> {
  const api = useApi()
  const data = await api<Machine[] | { results: Machine[] }>(API.sellerShopMachines(shopId))
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: Machine[] }).results)) {
    return (data as { results: Machine[] }).results
  }
  return []
}

export async function getMachine(shopId: number, pk: number): Promise<Machine> {
  const api = useApi()
  return await api<Machine>(API.sellerShopMachineDetail(shopId, pk))
}

export async function createMachine(shopId: number, body: Partial<Machine>): Promise<Machine> {
  const api = useApi()
  return await api<Machine>(API.sellerShopMachines(shopId), { method: 'POST', body })
}

export async function updateMachine(shopId: number, pk: number, body: Partial<Machine>): Promise<Machine> {
  const api = useApi()
  return await api<Machine>(API.sellerShopMachineDetail(shopId, pk), { method: 'PATCH', body })
}

export async function deleteMachine(shopId: number, pk: number): Promise<void> {
  const api = useApi()
  await api(API.sellerShopMachineDetail(shopId, pk), { method: 'DELETE' })
}

/** Slug-based machines API (prefer over id-based when shop IDs differ across envs) */
export async function listMachinesBySlug(shopSlug: string): Promise<Machine[]> {
  const api = useApi()
  const data = await api<Machine[] | { results: Machine[] }>(API.shopMachines(shopSlug))
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: Machine[] }).results)) {
    return (data as { results: Machine[] }).results
  }
  return []
}

export async function createMachineBySlug(shopSlug: string, body: Partial<Machine>): Promise<Machine> {
  const api = useApi()
  return await api<Machine>(API.shopMachines(shopSlug), { method: 'POST', body })
}

export async function updateMachineBySlug(shopSlug: string, pk: number, body: Partial<Machine>): Promise<Machine> {
  const api = useApi()
  return await api<Machine>(API.shopMachineDetail(shopSlug, pk), { method: 'PATCH', body })
}

export async function deleteMachineBySlug(shopSlug: string, pk: number): Promise<void> {
  const api = useApi()
  await api(API.shopMachineDetail(shopSlug, pk), { method: 'DELETE' })
}

export async function getMachineBySlug(shopSlug: string, pk: number): Promise<Machine> {
  const api = useApi()
  return await api<Machine>(API.shopMachineDetail(shopSlug, pk))
}

// ---------------------------------------------------------------------------
// Papers
// ---------------------------------------------------------------------------

export async function listPapers(shopId: number): Promise<Paper[]> {
  const api = useApi()
  const data = await api<Paper[] | { results: Paper[] }>(API.sellerShopPapers(shopId))
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: Paper[] }).results)) {
    return (data as { results: Paper[] }).results
  }
  return []
}

export async function createPaper(shopId: number, body: Partial<Paper>): Promise<Paper> {
  const api = useApi()
  return await api<Paper>(API.sellerShopPapers(shopId), { method: 'POST', body })
}

export async function updatePaper(shopId: number, pk: number, body: Partial<Paper>): Promise<Paper> {
  const api = useApi()
  return await api<Paper>(API.sellerShopPaperDetail(shopId, pk), { method: 'PATCH', body })
}

export async function deletePaper(shopId: number, pk: number): Promise<void> {
  const api = useApi()
  await api(API.sellerShopPaperDetail(shopId, pk), { method: 'DELETE' })
}

/** Slug-based papers API */
export async function listPapersBySlug(shopSlug: string): Promise<Paper[]> {
  const api = useApi()
  const data = await api<Paper[] | { results: Paper[] }>(API.shopPapers(shopSlug))
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: Paper[] }).results)) {
    return (data as { results: Paper[] }).results
  }
  return []
}

export async function createPaperBySlug(shopSlug: string, body: Partial<Paper>): Promise<Paper> {
  const api = useApi()
  return await api<Paper>(API.shopPapers(shopSlug), { method: 'POST', body })
}

export async function updatePaperBySlug(shopSlug: string, pk: number, body: Partial<Paper>): Promise<Paper> {
  const api = useApi()
  return await api<Paper>(API.shopPapersDetail(shopSlug, pk), { method: 'PATCH', body })
}

export async function deletePaperBySlug(shopSlug: string, pk: number): Promise<void> {
  const api = useApi()
  await api(API.shopPapersDetail(shopSlug, pk), { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Finishing rates
// ---------------------------------------------------------------------------

export async function listFinishingRates(shopId: number): Promise<FinishingRate[]> {
  const api = useApi()
  const data = await api<FinishingRate[] | { results: FinishingRate[] }>(API.sellerShopFinishingRates(shopId))
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: FinishingRate[] }).results)) {
    return (data as { results: FinishingRate[] }).results
  }
  return []
}

export async function createFinishingRate(shopId: number, body: Partial<FinishingRate>): Promise<FinishingRate> {
  const api = useApi()
  return await api<FinishingRate>(API.sellerShopFinishingRates(shopId), { method: 'POST', body })
}

export async function updateFinishingRate(shopId: number, pk: number, body: Partial<FinishingRate>): Promise<FinishingRate> {
  const api = useApi()
  return await api<FinishingRate>(API.sellerShopFinishingRateDetail(shopId, pk), { method: 'PATCH', body })
}

export async function deleteFinishingRate(shopId: number, pk: number): Promise<void> {
  const api = useApi()
  await api(API.sellerShopFinishingRateDetail(shopId, pk), { method: 'DELETE' })
}

/** Slug-based finishing rates API */
export async function listFinishingRatesBySlug(shopSlug: string): Promise<FinishingRate[]> {
  const api = useApi()
  const data = await api<FinishingRate[] | { results: FinishingRate[] }>(API.shopFinishingRates(shopSlug))
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: FinishingRate[] }).results)) {
    return (data as { results: FinishingRate[] }).results
  }
  return []
}

export async function createFinishingRateBySlug(shopSlug: string, body: Partial<FinishingRate>): Promise<FinishingRate> {
  const api = useApi()
  return await api<FinishingRate>(API.shopFinishingRates(shopSlug), { method: 'POST', body })
}

export async function updateFinishingRateBySlug(shopSlug: string, pk: number, body: Partial<FinishingRate>): Promise<FinishingRate> {
  const api = useApi()
  return await api<FinishingRate>(API.shopFinishingRateDetail(shopSlug, pk), { method: 'PATCH', body })
}

export async function deleteFinishingRateBySlug(shopSlug: string, pk: number): Promise<void> {
  const api = useApi()
  await api(API.shopFinishingRateDetail(shopSlug, pk), { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Materials
// ---------------------------------------------------------------------------

export async function listMaterials(shopId: number): Promise<Material[]> {
  const api = useApi()
  const data = await api<Material[] | { results: Material[] }>(API.sellerShopMaterials(shopId))
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: Material[] }).results)) {
    return (data as { results: Material[] }).results
  }
  return []
}

export async function createMaterial(shopId: number, body: Partial<Material>): Promise<Material> {
  const api = useApi()
  return await api<Material>(API.sellerShopMaterials(shopId), { method: 'POST', body })
}

export async function updateMaterial(shopId: number, pk: number, body: Partial<Material>): Promise<Material> {
  const api = useApi()
  return await api<Material>(API.sellerShopMaterialDetail(shopId, pk), { method: 'PATCH', body })
}

export async function deleteMaterial(shopId: number, pk: number): Promise<void> {
  const api = useApi()
  await api(API.sellerShopMaterialDetail(shopId, pk), { method: 'DELETE' })
}

/** Slug-based materials API */
export async function listMaterialsBySlug(shopSlug: string): Promise<Material[]> {
  const api = useApi()
  const data = await api<Material[] | { results: Material[] }>(API.shopMaterials(shopSlug))
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: Material[] }).results)) {
    return (data as { results: Material[] }).results
  }
  return []
}

export async function createMaterialBySlug(shopSlug: string, body: Partial<Material>): Promise<Material> {
  const api = useApi()
  return await api<Material>(API.shopMaterials(shopSlug), { method: 'POST', body })
}

export async function updateMaterialBySlug(shopSlug: string, pk: number, body: Partial<Material>): Promise<Material> {
  const api = useApi()
  return await api<Material>(API.shopMaterialDetail(shopSlug, pk), { method: 'PATCH', body })
}

export async function deleteMaterialBySlug(shopSlug: string, pk: number): Promise<void> {
  const api = useApi()
  await api(API.shopMaterialDetail(shopSlug, pk), { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function listProducts(shopId: number): Promise<Product[]> {
  const api = useApi()
  const data = await api<Product[] | { results: Product[] }>(API.sellerShopProducts(shopId))
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: Product[] }).results)) {
    return (data as { results: Product[] }).results
  }
  return []
}

export async function createProduct(shopId: number, body: Partial<Product>): Promise<Product> {
  const api = useApi()
  return await api<Product>(API.sellerShopProducts(shopId), { method: 'POST', body })
}

export async function updateProduct(shopId: number, pk: number, body: Partial<Product>): Promise<Product> {
  const api = useApi()
  return await api<Product>(API.sellerShopProductDetail(shopId, pk), { method: 'PATCH', body })
}

export async function deleteProduct(shopId: number, pk: number): Promise<void> {
  const api = useApi()
  await api(API.sellerShopProductDetail(shopId, pk), { method: 'DELETE' })
}

/** Product category (shop-scoped). */
export interface ProductCategory {
  id: number
  name: string
  slug: string
  icon_svg_path?: string
  description?: string
}

export async function listProductCategoriesBySlug(shopSlug: string): Promise<ProductCategory[]> {
  const api = useApi()
  const data = await api<unknown>(API.shopProductCategories(shopSlug))
  if (Array.isArray(data)) return data as ProductCategory[]
  if (data && typeof data === 'object' && Array.isArray((data as { results?: ProductCategory[] }).results)) {
    return (data as { results: ProductCategory[] }).results
  }
  return []
}

export async function createProductCategoryBySlug(
  shopSlug: string,
  body: { name: string; description?: string }
): Promise<ProductCategory> {
  const api = useApi()
  try {
    return await api<ProductCategory>(API.shopProductCategories(shopSlug), { method: 'POST', body })
  } catch (err) {
    if (err && typeof err === 'object') {
      Object.assign(err, { message: parseApiError(err, 'Failed to create category') })
    }
    throw err
  }
}

/** Slug-based products API (backend uses slug; DRF pagination returns { results: Product[] }) */
export async function listProductsBySlug(shopSlug: string): Promise<Product[]> {
  const api = useApi()
  const data = await api<unknown>(API.shopProducts(shopSlug))
  if (Array.isArray(data)) return data as Product[]
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (Array.isArray(obj.results)) return obj.results as Product[]
    if (Array.isArray(obj.products)) return obj.products as Product[]
  }
  return []
}

export async function createProductBySlug(shopSlug: string, body: Partial<Product>): Promise<Product> {
  const api = useApi()
  try {
    return await api<Product>(API.shopProducts(shopSlug), { method: 'POST', body })
  } catch (err) {
    if (err && typeof err === 'object') {
      Object.assign(err, { message: parseApiError(err, 'Failed to create product') })
    }
    throw err
  }
}

export async function updateProductBySlug(shopSlug: string, pk: number, body: Partial<Product>): Promise<Product> {
  const api = useApi()
  return await api<Product>(API.shopProductDetail(shopSlug, pk), { method: 'PATCH', body })
}

export async function deleteProductBySlug(shopSlug: string, pk: number): Promise<void> {
  const api = useApi()
  await api(API.shopProductDetail(shopSlug, pk), { method: 'DELETE' })
}

// ---------------------------------------------------------------------------
// Printing rates (machine-scoped)
// ---------------------------------------------------------------------------

export async function listPrintingRates(machineId: number): Promise<PrintingRate[]> {
  const api = useApi()
  const data = await api<PrintingRate[] | { results: PrintingRate[] }>(API.sellerMachinePrintingRates(machineId))
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: PrintingRate[] }).results)) {
    return (data as { results: PrintingRate[] }).results
  }
  return []
}

export async function createPrintingRate(machineId: number, body: Partial<PrintingRate>): Promise<PrintingRate> {
  const api = useApi()
  return await api<PrintingRate>(API.sellerMachinePrintingRates(machineId), { method: 'POST', body })
}

export async function updatePrintingRate(machineId: number, pk: number, body: Partial<PrintingRate>): Promise<PrintingRate> {
  const api = useApi()
  return await api<PrintingRate>(API.sellerMachinePrintingRateDetail(machineId, pk), { method: 'PATCH', body })
}

export async function deletePrintingRate(machineId: number, pk: number): Promise<void> {
  const api = useApi()
  await api(API.sellerMachinePrintingRateDetail(machineId, pk), { method: 'DELETE' })
}
