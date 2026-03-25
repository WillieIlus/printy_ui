/**
 * SEO API — public endpoints for sitemap and dynamic marketplace pages.
 */
import { API } from '~/shared/api-paths'
import { usePublicApi } from '~/shared/api'

export interface SEOLocation {
  slug: string
  name: string
  location_type: string
  updated_at?: string
}

export interface SEOLocationDetail extends SEOLocation {
  city?: string
  county?: string
  description?: string
  shops: { slug: string; name: string }[]
}

export interface SEOLocationProductItem {
  slug: string
  name: string
}

export interface SEOProduct {
  slug: string
  name: string
  updated_at?: string
}

export interface SEOProductDetail extends SEOProduct {
  description: string
  product_count: number
}

export interface SEORoute {
  loc: string
  lastmod: string
}

export interface SEOLocationProduct {
  location: { slug: string; name: string }
  category: { slug: string; name: string }
  shops: { slug: string; name: string }[]
}

type PublicApiClient = ReturnType<typeof usePublicApi>

export async function fetchSEOLocations(api: PublicApiClient = usePublicApi()): Promise<SEOLocation[]> {
  return (await api<SEOLocation[]>(API.seoLocations())) ?? []
}

export async function fetchSEOLocationDetail(
  slug: string,
  api: PublicApiClient = usePublicApi()
): Promise<SEOLocationDetail | null> {
  try {
    return await api<SEOLocationDetail>(API.seoLocationDetail(slug))
  } catch {
    return null
  }
}

export async function fetchSEOLocationProducts(
  slug: string,
  api: PublicApiClient = usePublicApi()
): Promise<SEOLocationProductItem[]> {
  try {
    return (await api<SEOLocationProductItem[]>(API.seoLocationProducts(slug))) ?? []
  } catch {
    return []
  }
}

export async function fetchSEOProducts(api: PublicApiClient = usePublicApi()): Promise<SEOProduct[]> {
  return (await api<SEOProduct[]>(API.seoProducts())) ?? []
}

export async function fetchSEOProductDetail(
  slug: string,
  api: PublicApiClient = usePublicApi()
): Promise<SEOProductDetail | null> {
  try {
    return await api<SEOProductDetail>(API.seoProductDetail(slug))
  } catch {
    return null
  }
}

export async function fetchSEOLocationProduct(
  locationSlug: string,
  productSlug: string,
  api: PublicApiClient = usePublicApi()
): Promise<SEOLocationProduct | null> {
  try {
    return await api<SEOLocationProduct>(
      API.seoLocationProduct(locationSlug, productSlug)
    )
  } catch {
    return null
  }
}

export async function fetchSEORoutes(api: PublicApiClient = usePublicApi()): Promise<SEORoute[]> {
  return (await api<SEORoute[]>(API.seoRoutes())) ?? []
}
