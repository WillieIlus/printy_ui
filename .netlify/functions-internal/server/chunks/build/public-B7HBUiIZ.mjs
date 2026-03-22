import { f as usePublicApi, A as API } from './server.mjs';

async function listShops() {
  const publicApi = usePublicApi();
  const data = await publicApi(API.publicShops());
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}

export { listShops as l };
//# sourceMappingURL=public-B7HBUiIZ.mjs.map
