import { A as API, h as usePublicApi } from './server.mjs';

async function listShops(publicApi = usePublicApi()) {
  const data = await publicApi(API.publicShops());
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}

export { listShops as l };
//# sourceMappingURL=public-DzjHCo_M.mjs.map
