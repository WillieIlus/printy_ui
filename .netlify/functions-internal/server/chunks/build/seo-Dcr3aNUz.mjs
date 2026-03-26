import { A as API, h as usePublicApi } from './server.mjs';

async function fetchSEOLocations(api = usePublicApi()) {
  return await api(API.seoLocations()) ?? [];
}
async function fetchSEOLocationDetail(slug, api = usePublicApi()) {
  try {
    return await api(API.seoLocationDetail(slug));
  } catch {
    return null;
  }
}
async function fetchSEOLocationProducts(slug, api = usePublicApi()) {
  try {
    return await api(API.seoLocationProducts(slug)) ?? [];
  } catch {
    return [];
  }
}
async function fetchSEOProductDetail(slug, api = usePublicApi()) {
  try {
    return await api(API.seoProductDetail(slug));
  } catch {
    return null;
  }
}
async function fetchSEOLocationProduct(locationSlug, productSlug, api = usePublicApi()) {
  try {
    return await api(
      API.seoLocationProduct(locationSlug, productSlug)
    );
  } catch {
    return null;
  }
}

export { fetchSEOLocationDetail as a, fetchSEOLocationProducts as b, fetchSEOLocations as c, fetchSEOLocationProduct as d, fetchSEOProductDetail as f };
//# sourceMappingURL=seo-Dcr3aNUz.mjs.map
