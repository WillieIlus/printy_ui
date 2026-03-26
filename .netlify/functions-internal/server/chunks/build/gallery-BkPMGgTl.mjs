import { A as API, h as usePublicApi, i as useApi, l as usePublicApiNoAuth } from './server.mjs';

async function getGalleryProductOptions(productId, publicApiNoAuth = usePublicApiNoAuth()) {
  try {
    return await publicApiNoAuth(API.publicProductOptions(productId));
  } catch {
    return null;
  }
}
async function calculateGalleryProductPrice(shopSlug, productSlug, payload, api = useApi()) {
  try {
    return await api(
      API.galleryProductCalculatePrice(shopSlug, productSlug),
      { method: "POST", body: payload }
    );
  } catch {
    return null;
  }
}
async function getAllProducts(publicApi = usePublicApi()) {
  const data = await publicApi(API.publicAllProducts());
  return data?.products ?? [];
}
async function getShopCatalog(shopSlug, publicApi = usePublicApi()) {
  try {
    return await publicApi(API.publicShopCatalog(shopSlug));
  } catch {
    return null;
  }
}

export { getGalleryProductOptions as a, getShopCatalog as b, calculateGalleryProductPrice as c, getAllProducts as g };
//# sourceMappingURL=gallery-BkPMGgTl.mjs.map
