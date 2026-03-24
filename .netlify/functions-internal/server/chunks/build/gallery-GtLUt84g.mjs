import { f as usePublicApi, A as API, k as useApi, j as usePublicApiNoAuth } from './server.mjs';

async function getGalleryProductOptions(productId) {
  const publicApiNoAuth = usePublicApiNoAuth();
  try {
    return await publicApiNoAuth(API.publicProductOptions(productId));
  } catch {
    return null;
  }
}
async function calculateGalleryProductPrice(shopSlug, productSlug, payload) {
  const api = useApi();
  try {
    return await api(
      API.galleryProductCalculatePrice(shopSlug, productSlug),
      { method: "POST", body: payload }
    );
  } catch {
    return null;
  }
}
async function getAllProducts() {
  const publicApi = usePublicApi();
  const data = await publicApi(API.publicAllProducts());
  return data?.products ?? [];
}
async function getShopCatalog(shopSlug) {
  const publicApi = usePublicApi();
  try {
    return await publicApi(API.publicShopCatalog(shopSlug));
  } catch {
    return null;
  }
}

export { getGalleryProductOptions as a, getShopCatalog as b, calculateGalleryProductPrice as c, getAllProducts as g };
//# sourceMappingURL=gallery-GtLUt84g.mjs.map
