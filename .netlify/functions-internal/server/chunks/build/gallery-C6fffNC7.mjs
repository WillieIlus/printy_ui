import { u as usePublicApi, A as API, w as useApi } from './server.mjs';

async function getGalleryProductOptions(productId) {
  const publicApi = usePublicApi();
  try {
    return await publicApi(API.publicProductOptions(productId));
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
async function getShopCatalog(shopSlug) {
  const publicApi = usePublicApi();
  try {
    return await publicApi(API.publicShopCatalog(shopSlug));
  } catch {
    return null;
  }
}

export { getShopCatalog as a, calculateGalleryProductPrice as c, getGalleryProductOptions as g };
//# sourceMappingURL=gallery-C6fffNC7.mjs.map
