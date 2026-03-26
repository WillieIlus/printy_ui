import { u as useApi } from './useApi-4DUqRt-r.mjs';
import { A as API, I as parseApiError, k as useNuxtApp } from './server.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'lru-cache';
import '@unocss/core';
import '@unocss/preset-wind3';
import 'devalue';
import 'consola';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import '@iconify/utils';
import 'node:crypto';
import 'fast-xml-parser';
import 'node:url';
import 'ipx';
import 'node:fs';
import 'node:path';
import 'pinia';
import 'vue-router';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

function resolveApi(api) {
  return api ?? useApi();
}
async function getBlob(url, options) {
  const { $api } = useNuxtApp();
  return await $api(url, {
    ...options ?? {},
    responseType: "blob"
  });
}
async function getActiveDraft(shopSlug, fileId, api) {
  return await resolveApi(api).get(API.quoteDraftsActive(shopSlug, fileId));
}
async function listQuoteRequests(api) {
  const data = await resolveApi(api).get(API.quoteRequests());
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}
async function addItem(draftId, payload, api) {
  try {
    return await resolveApi(api).post(API.quoteDraftItems(draftId), payload);
  } catch (err) {
    throw new Error(parseApiError(err, "Failed to add item to quote"));
  }
}
async function updateItem(draftId, itemId, payload, api) {
  return await resolveApi(api).patch(API.quoteDraftItemDetail(draftId, itemId), payload);
}
async function removeItem(draftId, itemId, api) {
  await resolveApi(api).del(API.quoteDraftItemDetail(draftId, itemId));
}
async function tweakAndAdd(draftId, payload, api) {
  try {
    return await resolveApi(api).post(API.quoteDraftTweakAndAdd(draftId), payload);
  } catch (err) {
    throw new Error(parseApiError(err, "Failed to tweak and add item"));
  }
}
async function previewPrice(draftId, api) {
  return await resolveApi(api).post(API.quoteDraftPreviewPrice(draftId), {});
}
async function requestQuote(draftId, api) {
  return await resolveApi(api).post(API.quoteDraftRequestQuote(draftId), {});
}
async function getQuoteDraftFile(fileId, api, scope = "draft") {
  const params = scope === "dashboard" ? { scope: "dashboard" } : void 0;
  return await resolveApi(api).get(API.quoteDraftFileDetail(fileId), params);
}
async function updateQuoteDraftFile(fileId, payload, api) {
  return await resolveApi(api).patch(API.quoteDraftFileDetail(fileId), payload);
}
async function downloadQuoteDraftPdf(draftId) {
  return await getBlob(API.quoteDraftDownloadPdf(draftId), { method: "GET" });
}
async function downloadQuoteDraftFilePdf(fileId, _api, scope = "draft") {
  return await getBlob(API.quoteDraftFileDownloadPdf(fileId), {
    method: "GET",
    params: scope === "dashboard" ? { scope: "dashboard" } : void 0
  });
}
async function previewQuoteDraftFileWhatsapp(fileId, api) {
  return await resolveApi(api).get(API.quoteDraftFileWhatsappPreview(fileId));
}

export { addItem, downloadQuoteDraftFilePdf, downloadQuoteDraftPdf, getActiveDraft, getQuoteDraftFile, listQuoteRequests, previewPrice, previewQuoteDraftFileWhatsapp, removeItem, requestQuote, tweakAndAdd, updateItem, updateQuoteDraftFile };
//# sourceMappingURL=quoteDraft-JSimLcx7.mjs.map
