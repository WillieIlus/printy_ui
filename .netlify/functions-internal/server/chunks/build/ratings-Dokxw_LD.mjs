import { A as API, j as usePublicApi, h as useApi } from './server.mjs';

async function getRatingSummary(slug, publicApi = usePublicApi()) {
  try {
    return await publicApi(API.publicShopRatingSummary(slug));
  } catch {
    return null;
  }
}
async function rateShop(shopId, payload, api = useApi()) {
  await api(API.shopRate(shopId), {
    method: "POST",
    body: payload
  });
}

export { getRatingSummary as g, rateShop as r };
//# sourceMappingURL=ratings-Dokxw_LD.mjs.map
