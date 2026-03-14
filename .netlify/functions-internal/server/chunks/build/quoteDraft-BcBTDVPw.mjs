import { w as useApi, A as API } from './server.mjs';
import { p as parseApiError } from './api-error-D1IYk86E.mjs';
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
import 'tailwindcss/colors';
import '@iconify/vue';
import 'pinia-plugin-persistedstate';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';

async function getActiveDraft(shopSlug) {
  const api = useApi();
  return await api(API.quoteDraftsActive(shopSlug));
}
async function listQuoteRequests() {
  const api = useApi();
  const data = await api(API.quoteRequests());
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.results)) {
    return data.results;
  }
  return [];
}
async function addItem(draftId, payload) {
  const api = useApi();
  try {
    return await api(API.quoteDraftItems(draftId), {
      method: "POST",
      body: payload
    });
  } catch (err) {
    const msg = parseApiError(err, "Failed to add item to quote");
    throw new Error(msg);
  }
}
async function updateItem(draftId, itemId, payload) {
  const api = useApi();
  return await api(API.quoteDraftItemDetail(draftId, itemId), {
    method: "PATCH",
    body: payload
  });
}
async function removeItem(draftId, itemId) {
  const api = useApi();
  await api(API.quoteDraftItemDetail(draftId, itemId), { method: "DELETE" });
}
async function tweakAndAdd(draftId, payload) {
  const api = useApi();
  try {
    return await api(API.quoteDraftTweakAndAdd(draftId), {
      method: "POST",
      body: payload
    });
  } catch (err) {
    const msg = parseApiError(err, "Failed to tweak and add item");
    throw new Error(msg);
  }
}
async function previewPrice(draftId) {
  const api = useApi();
  return await api(API.quoteDraftPreviewPrice(draftId), {
    method: "POST"
  });
}
async function requestQuote(draftId) {
  const api = useApi();
  return await api(API.quoteDraftRequestQuote(draftId), {
    method: "POST"
  });
}

export { addItem, getActiveDraft, listQuoteRequests, previewPrice, removeItem, requestQuote, tweakAndAdd, updateItem };
//# sourceMappingURL=quoteDraft-BcBTDVPw.mjs.map
