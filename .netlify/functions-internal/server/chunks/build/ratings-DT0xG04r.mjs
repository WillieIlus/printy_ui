import { A as API, r as usePublicApi, o as useApi } from './server.mjs';

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
//# sourceMappingURL=ratings-DT0xG04r.mjs.map
