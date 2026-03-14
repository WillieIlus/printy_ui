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

export async function fetchSEOLocations(): Promise<SEOLocation[]> {
  const api = usePublicApi()
  return (await api<SEOLocation[]>(API.seoLocations())) ?? []
}

export async function fetchSEOLocationDetail(slug: string): Promise<SEOLocationDetail | null> {
  const api = usePublicApi()
  try {
    return await api<SEOLocationDetail>(API.seoLocationDetail(slug))
  } catch {
    return null
  }
}

export async function fetchSEOLocationProducts(slug: string): Promise<SEOLocationProductItem[]> {
  const api = usePublicApi()
  try {
    return (await api<SEOLocationProductItem[]>(API.seoLocationProducts(slug))) ?? []
  } catch {
    return []
  }
}

export async function fetchSEOProducts(): Promise<SEOProduct[]> {
  const api = usePublicApi()
  return (await api<SEOProduct[]>(API.seoProducts())) ?? []
}

export async function fetchSEOProductDetail(slug: string): Promise<SEOProductDetail | null> {
  const api = usePublicApi()
  try {
    return await api<SEOProductDetail>(API.seoProductDetail(slug))
  } catch {
    return null
  }
}

export async function fetchSEOLocationProduct(
  locationSlug: string,
  productSlug: string
): Promise<SEOLocationProduct | null> {
  const api = usePublicApi()
  try {
    return await api<SEOLocationProduct>(
      API.seoLocationProduct(locationSlug, productSlug)
    )
  } catch {
    return null
  }
}

export async function fetchSEORoutes(): Promise<SEORoute[]> {
  const api = usePublicApi()
  return (await api<SEORoute[]>(API.seoRoutes())) ?? []
}
