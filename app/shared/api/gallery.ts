/**
 * Gallery API — uses catalog endpoints (public/products, public/shops/{slug}/catalog)
 * and product gallery (GET /api/products/gallery/).
 */
import type {
  PublicShopDTO,
  ProductsGalleryResponse,
  GalleryCalculatePriceResponse,
  GalleryProductOptions,
} from '~/shared/types/gallery'
import type { CatalogResponse } from '~/services/public'
import type { Product } from '~/shared/types'
import type { PrintTemplateDetailDTO, TemplateCalculatePricePayload, TemplatePriceResponseDTO } from '~/shared/types/templates'
import { API } from '~/shared/api-paths'
import { useApi, usePublicApi, usePublicApiNoAuth } from '~/shared/api'

type ApiClient = ReturnType<typeof useApi>
type PublicApiClient = ReturnType<typeof usePublicApi>
type PublicApiNoAuthClient = ReturnType<typeof usePublicApiNoAuth>

/** Product gallery — categories with products (GET /api/products/gallery/). No auth required. */
export async function getProductsGallery(publicApi: PublicApiNoAuthClient = usePublicApiNoAuth()): Promise<ProductsGalleryResponse> {
  const data = await publicApi<ProductsGalleryResponse>(API.productsGallery())
  return data ?? { categories: [] }
}

/** Public product options — papers, materials, finishings for tweaking. No auth required. */
export async function getGalleryProductOptions(
  productId: number,
  publicApiNoAuth: PublicApiNoAuthClient = usePublicApiNoAuth()
): Promise<GalleryProductOptions | null> {
  try {
    return await publicApiNoAuth<GalleryProductOptions>(API.publicProductOptions(productId))
  } catch {
    return null
  }
}

/** Gallery product calculate-price. Returns null if API fails (use demo fallback). */
export async function calculateGalleryProductPrice(
  shopSlug: string,
  productSlug: string,
  payload: { quantity?: number; [key: string]: unknown },
  api: ApiClient = useApi()
): Promise<GalleryCalculatePriceResponse | null> {
  try {
    return await api<GalleryCalculatePriceResponse>(
      API.galleryProductCalculatePrice(shopSlug, productSlug),
      { method: 'POST', body: payload }
    )
  } catch {
    return null
  }
}

/** All products from all shops (for /gallery). Each product includes shop. */
export async function getAllProducts(publicApi: PublicApiClient = usePublicApi()): Promise<Product[]> {
  const data = await publicApi<{ products: Product[] }>(API.publicAllProducts())
  return data?.products ?? []
}

export async function listPublicShops(publicApi: PublicApiClient = usePublicApi()): Promise<PublicShopDTO[]> {
  const data = await publicApi<PublicShopDTO[] | { results: PublicShopDTO[] }>(API.publicShops())
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray((data as { results?: PublicShopDTO[] }).results)) {
    return (data as { results: PublicShopDTO[] }).results
  }
  return []
}

export async function getShopCatalog(
  shopSlug: string,
  publicApi: PublicApiClient = usePublicApi()
): Promise<CatalogResponse | null> {
  try {
    return await publicApi<CatalogResponse>(API.publicShopCatalog(shopSlug))
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
