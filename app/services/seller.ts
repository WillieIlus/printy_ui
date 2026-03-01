/**
 * Seller (Printy_API) shop-scoped resources.
 * Uses numeric shop_id and machine_id.
 */
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'

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

export interface FinishingRate {
  id: number
  name: string
  charge_unit: string
  price: string
  setup_fee: string | null
  min_qty: number | null
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
  category: string
  pricing_mode: string
  default_finished_width_mm: number
  default_finished_height_mm: number
  default_bleed_mm: number
  default_sides: string
  is_active: boolean
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
