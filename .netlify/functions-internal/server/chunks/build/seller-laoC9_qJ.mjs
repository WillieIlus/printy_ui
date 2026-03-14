import { w as useApi, A as API } from './server.mjs';
import { p as parseApiError } from './api-error-D1IYk86E.mjs';

async function listSellerShops() {
  const api = useApi();
  const data = await api(API.shops());
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}
async function listMachinesBySlug(shopSlug) {
  const api = useApi();
  const data = await api(API.shopMachines(shopSlug));
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}
async function createMachineBySlug(shopSlug, body) {
  const api = useApi();
  return await api(API.shopMachines(shopSlug), { method: "POST", body });
}
async function updateMachineBySlug(shopSlug, pk, body) {
  const api = useApi();
  return await api(API.shopMachineDetail(shopSlug, pk), { method: "PATCH", body });
}
async function deleteMachineBySlug(shopSlug, pk) {
  const api = useApi();
  await api(API.shopMachineDetail(shopSlug, pk), { method: "DELETE" });
}
async function getMachineBySlug(shopSlug, pk) {
  const api = useApi();
  return await api(API.shopMachineDetail(shopSlug, pk));
}
async function listPapersBySlug(shopSlug) {
  const api = useApi();
  const data = await api(API.shopPapers(shopSlug));
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}
async function createPaperBySlug(shopSlug, body) {
  const api = useApi();
  return await api(API.shopPapers(shopSlug), { method: "POST", body });
}
async function updatePaperBySlug(shopSlug, pk, body) {
  const api = useApi();
  return await api(API.shopPapersDetail(shopSlug, pk), { method: "PATCH", body });
}
async function deletePaperBySlug(shopSlug, pk) {
  const api = useApi();
  await api(API.shopPapersDetail(shopSlug, pk), { method: "DELETE" });
}
async function listFinishingRatesBySlug(shopSlug) {
  const api = useApi();
  const data = await api(API.shopFinishingRates(shopSlug));
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}
async function createFinishingRateBySlug(shopSlug, body) {
  const api = useApi();
  return await api(API.shopFinishingRates(shopSlug), { method: "POST", body });
}
async function updateFinishingRateBySlug(shopSlug, pk, body) {
  const api = useApi();
  return await api(API.shopFinishingRateDetail(shopSlug, pk), { method: "PATCH", body });
}
async function deleteFinishingRateBySlug(shopSlug, pk) {
  const api = useApi();
  await api(API.shopFinishingRateDetail(shopSlug, pk), { method: "DELETE" });
}
async function listMaterialsBySlug(shopSlug) {
  const api = useApi();
  const data = await api(API.shopMaterials(shopSlug));
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}
async function createMaterialBySlug(shopSlug, body) {
  const api = useApi();
  return await api(API.shopMaterials(shopSlug), { method: "POST", body });
}
async function updateMaterialBySlug(shopSlug, pk, body) {
  const api = useApi();
  return await api(API.shopMaterialDetail(shopSlug, pk), { method: "PATCH", body });
}
async function deleteMaterialBySlug(shopSlug, pk) {
  const api = useApi();
  await api(API.shopMaterialDetail(shopSlug, pk), { method: "DELETE" });
}
async function listProductCategoriesBySlug(shopSlug) {
  const api = useApi();
  const data = await api(API.shopProductCategories(shopSlug));
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}
async function createProductCategoryBySlug(shopSlug, body) {
  const api = useApi();
  try {
    return await api(API.shopProductCategories(shopSlug), { method: "POST", body });
  } catch (err) {
    const msg = parseApiError(err, "Failed to create category");
    throw new Error(msg);
  }
}
async function listProductsBySlug(shopSlug) {
  const api = useApi();
  const data = await api(API.shopProducts(shopSlug));
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data;
    if (Array.isArray(obj.results)) return obj.results;
    if (Array.isArray(obj.products)) return obj.products;
  }
  return [];
}
async function createProductBySlug(shopSlug, body) {
  const api = useApi();
  try {
    return await api(API.shopProducts(shopSlug), { method: "POST", body });
  } catch (err) {
    const msg = parseApiError(err, "Failed to create product");
    const enhanced = err && typeof err === "object" ? Object.assign(new Error(msg), err) : new Error(msg);
    throw enhanced;
  }
}
async function updateProductBySlug(shopSlug, pk, body) {
  const api = useApi();
  return await api(API.shopProductDetail(shopSlug, pk), { method: "PATCH", body });
}
async function deleteProductBySlug(shopSlug, pk) {
  const api = useApi();
  await api(API.shopProductDetail(shopSlug, pk), { method: "DELETE" });
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

export { updateProductBySlug as A, createProductBySlug as B, listPapersBySlug as a, listMachinesBySlug as b, createPrintingRate as c, deletePrintingRate as d, listPrintingRates as e, listMaterialsBySlug as f, getMachineBySlug as g, deleteMachineBySlug as h, updateMachineBySlug as i, createMachineBySlug as j, deletePaperBySlug as k, listSellerShops as l, updatePaperBySlug as m, createPaperBySlug as n, listFinishingRatesBySlug as o, deleteFinishingRateBySlug as p, updateFinishingRateBySlug as q, createFinishingRateBySlug as r, deleteMaterialBySlug as s, updateMaterialBySlug as t, updatePrintingRate as u, createMaterialBySlug as v, listProductsBySlug as w, listProductCategoriesBySlug as x, deleteProductBySlug as y, createProductCategoryBySlug as z };
//# sourceMappingURL=seller-laoC9_qJ.mjs.map
