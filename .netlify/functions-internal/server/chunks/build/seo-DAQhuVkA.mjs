import { c as usePublicApi, A as API } from './server.mjs';

async function fetchSEOLocations() {
  const api = usePublicApi();
  return await api(API.seoLocations()) ?? [];
}
async function fetchSEOLocationDetail(slug) {
  const api = usePublicApi();
  try {
    return await api(API.seoLocationDetail(slug));
  } catch {
    return null;
  }
}
async function fetchSEOLocationProducts(slug) {
  const api = usePublicApi();
  try {
    return await api(API.seoLocationProducts(slug)) ?? [];
  } catch {
    return [];
  }
}
async function fetchSEOProductDetail(slug) {
  const api = usePublicApi();
  try {
    return await api(API.seoProductDetail(slug));
  } catch {
    return null;
  }
}
async function fetchSEOLocationProduct(locationSlug, productSlug) {
  const api = usePublicApi();
  try {
    return await api(
      API.seoLocationProduct(locationSlug, productSlug)
    );
  } catch {
    return null;
  }
}

export { fetchSEOLocationDetail as a, fetchSEOLocationProducts as b, fetchSEOLocations as c, fetchSEOLocationProduct as d, fetchSEOProductDetail as f };
//# sourceMappingURL=seo-DAQhuVkA.mjs.map
