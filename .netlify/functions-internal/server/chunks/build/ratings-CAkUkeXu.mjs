import { f as usePublicApi, A as API, k as useApi } from './server.mjs';

async function getRatingSummary(slug) {
  const publicApi = usePublicApi();
  try {
    return await publicApi(API.publicShopRatingSummary(slug));
  } catch {
    return null;
  }
}
async function rateShop(shopId, payload) {
  const api = useApi();
  await api(API.shopRate(shopId), {
    method: "POST",
    body: payload
  });
}

export { getRatingSummary as g, rateShop as r };
//# sourceMappingURL=ratings-CAkUkeXu.mjs.map
