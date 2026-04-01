import { A as API, j as usePublicApi, i as usePublicApiNoAuth } from './server.mjs';

async function listShops(publicApi = usePublicApi()) {
  const data = await publicApi(API.publicShops());
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}
async function getCatalog(shopSlug, publicApi = usePublicApi()) {
  try {
    return await publicApi(API.publicShopCatalog(shopSlug));
  } catch {
    return null;
  }
}
async function matchShops(payload, publicApi = usePublicApiNoAuth()) {
  const data = await publicApi(API.publicMatchShops(), {
    method: "POST",
    body: payload
  });
  return {
    mode: data?.mode ?? "marketplace",
    shops: data?.shops ?? [],
    matches_count: data?.matches_count ?? 0,
    min_price: data?.min_price ?? null,
    max_price: data?.max_price ?? null,
    currency: data?.currency ?? null,
    selected_shops: data?.selected_shops ?? [],
    fixed_shop_preview: data?.fixed_shop_preview ?? null,
    missing_requirements: data?.missing_requirements ?? [],
    unsupported_reasons: data?.unsupported_reasons ?? [],
    summary: data?.summary ?? "",
    exact_or_estimated: data?.exact_or_estimated ?? false
  };
}
async function previewShopCalculator(shopSlug, payload, publicApi = usePublicApiNoAuth()) {
  const data = await publicApi(API.publicShopCalculatorPreview(shopSlug), {
    method: "POST",
    body: payload
  });
  return {
    mode: data?.mode ?? "single-shop",
    shops: data?.shops ?? [],
    matches_count: data?.matches_count ?? 0,
    min_price: data?.min_price ?? null,
    max_price: data?.max_price ?? null,
    currency: data?.currency ?? null,
    selected_shops: data?.selected_shops ?? [],
    fixed_shop_preview: data?.fixed_shop_preview ?? null,
    missing_requirements: data?.missing_requirements ?? [],
    unsupported_reasons: data?.unsupported_reasons ?? [],
    summary: data?.summary ?? "",
    exact_or_estimated: data?.exact_or_estimated ?? false
  };
}

export { getCatalog as g, listShops as l, matchShops as m, previewShopCalculator as p };
//# sourceMappingURL=public-Dys9UREH.mjs.map
