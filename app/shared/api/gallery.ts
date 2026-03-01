/**
 * Gallery API — uses catalog endpoints (public/products, public/shops/{slug}/catalog).
 * Products replace the previous "templates" concept.
 */
import type { PublicShopDTO } from '~/shared/types/gallery'
import type { CatalogResponse } from '~/services/public'
import type { Product } from '~/shared/types'
import type { PrintTemplateDetailDTO, TemplateCalculatePricePayload, TemplatePriceResponseDTO } from '~/shared/types/templates'
import { API } from '~/shared/api-paths'
import { useApi } from '~/shared/api'

/** All products from all shops (for /gallery). Each product includes shop. */
export async function getAllProducts(): Promise<Product[]> {
  const api = useApi()
  const data = await api<{ products: Product[] }>(API.publicAllProducts())
  return data?.products ?? []
}

export async function listPublicShops(): Promise<PublicShopDTO[]> {
  const api = useApi()
  const data = await api<PublicShopDTO[] | { results: PublicShopDTO[] }>(API.publicShops())
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: PublicShopDTO[] }).results)) {
    return (data as { results: PublicShopDTO[] }).results
  }
  return []
}

export async function getShopCatalog(shopSlug: string): Promise<CatalogResponse | null> {
  const api = useApi()
  try {
    return await api<CatalogResponse>(API.publicShopCatalog(shopSlug))
  } catch {
    return null
  }
}

/** @deprecated Legacy template API — no backend. Returns null. Use catalog/products instead. */
export async function getShopTemplate(
  _shopSlug: string,
  _templateSlug: string
): Promise<PrintTemplateDetailDTO | null> {
  return null
}

/** @deprecated Legacy template API — no backend. Throws. Use quote-draft flow instead. */
export async function calculateShopTemplatePrice(
  _shopSlug: string,
  _templateSlug: string,
  _payload: TemplateCalculatePricePayload
): Promise<TemplatePriceResponseDTO> {
  throw new Error('Template price API is deprecated. Use the quote-draft flow for product pricing.')
}
