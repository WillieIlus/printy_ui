import { h as useApi, A as API } from './server.mjs';

async function listSellerShops() {
  const api = useApi();
  const data = await api(API.shops());
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}
async function getMachineBySlug(shopSlug, pk) {
  const api = useApi();
  return await api(API.shopMachineDetail(shopSlug, pk));
}
async function listPrintingRates(machineId) {
  const api = useApi();
  const data = await api(API.sellerMachinePrintingRates(machineId));
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}
async function createPrintingRate(machineId, body) {
  const api = useApi();
  return await api(API.sellerMachinePrintingRates(machineId), { method: "POST", body });
}
async function updatePrintingRate(machineId, pk, body) {
  const api = useApi();
  return await api(API.sellerMachinePrintingRateDetail(machineId, pk), { method: "PATCH", body });
}
async function deletePrintingRate(machineId, pk) {
  const api = useApi();
  await api(API.sellerMachinePrintingRateDetail(machineId, pk), { method: "DELETE" });
}

export { listPrintingRates as a, createPrintingRate as c, deletePrintingRate as d, getMachineBySlug as g, listSellerShops as l, updatePrintingRate as u };
//# sourceMappingURL=seller-B7IxAeLp.mjs.map
