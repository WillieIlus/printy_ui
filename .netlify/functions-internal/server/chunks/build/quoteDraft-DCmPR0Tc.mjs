import { useStorage } from '@vueuse/core';
import { u as useApi } from './useApi-Cs2GTEbX.mjs';
import { previewPrice, getActiveDraft, requestQuote, removeItem, updateItem, addItem } from './quoteDraft-5mvcgeM-.mjs';
import { g as getBrowserStorage } from './browser-storage-CN-SIF_V.mjs';
import { s as safeLogError } from './server.mjs';
import { u as useQuoteInboxStore } from './quoteInbox-BZeZ2Gtb.mjs';
import { ref } from 'vue';
import { defineStore } from 'pinia';

const useQuoteDraftStore = defineStore("quoteDraft", () => {
  const api = useApi();
  const quoteInboxStore = useQuoteInboxStore();
  const activeDraft = ref(null);
  const currentShopSlug = ref(null);
  const currentFileId = useStorage(
    "quote-draft-current-file-id",
    null,
    getBrowserStorage()
  );
  const isLoading = ref(false);
  function setShop(slug) {
    currentShopSlug.value = slug;
  }
  function selectFile(fileId) {
    currentFileId.value = fileId;
  }
  function clearSelectedFile() {
    currentFileId.value = null;
  }
  function setFile(fileId) {
    selectFile(fileId);
  }
  async function loadActiveDraft() {
    const slug = currentShopSlug.value;
    if (!slug) return null;
    isLoading.value = true;
    try {
      activeDraft.value = await getActiveDraft(slug, currentFileId.value, api);
      return activeDraft.value;
    } finally {
      isLoading.value = false;
    }
  }
  async function loadDraftForContext(shopSlug, fileId) {
    setShop(shopSlug);
    if (fileId !== void 0) {
      selectFile(fileId);
    }
    return await loadActiveDraft();
  }
  async function ensureDraftForShop(shopSlug) {
    const existingDraft = activeDraft.value;
    const existingShopSlug = existingDraft?.shop_slug ?? currentShopSlug.value;
    if (!existingDraft || existingShopSlug !== shopSlug) {
      setShop(shopSlug);
      return await loadActiveDraft();
    }
    currentShopSlug.value = existingShopSlug;
    return existingDraft;
  }
  async function addProductToQuote(productId, shopSlug, pricingMode = "SHEET") {
    const draft = await ensureDraftForShop(shopSlug);
    if (!draft) return null;
    const payload = {
      item_type: "PRODUCT",
      product: productId,
      quantity: 100,
      pricing_mode: pricingMode
    };
    const item = await addItem(draft.id, payload, api);
    await refreshDraft();
    return item;
  }
  async function addTweakedProductToQuote(shopSlug, payload) {
    const draft = await ensureDraftForShop(shopSlug);
    if (!draft) return null;
    const { tweakAndAdd } = await import('./quoteDraft-5mvcgeM-.mjs');
    const item = await tweakAndAdd(draft.id, payload, api);
    await refreshDraft();
    return item;
  }
  async function addCustomToQuote(payload) {
    const slug = currentShopSlug.value;
    if (!slug) return null;
    const draft = await ensureDraftForShop(slug);
    if (!draft) return null;
    const item = await addItem(draft.id, payload, api);
    await refreshDraft();
    return item;
  }
  async function refreshDraft() {
    const draft = activeDraft.value;
    if (!draft) return;
    try {
      const slug = currentShopSlug.value;
      if (slug) {
        activeDraft.value = await getActiveDraft(slug, currentFileId.value, api);
      }
    } catch (err) {
      safeLogError(err, "quoteDraft.refresh");
    } finally {
      try {
        await quoteInboxStore.fetchDraftFiles("dashboard");
      } catch (err) {
        safeLogError(err, "quoteDraft.refreshBuilder");
      }
    }
  }
  async function updateItemQty(itemId, qty) {
    const draft = activeDraft.value;
    if (!draft || draft.status !== "draft") return;
    if (qty < 1) return;
    await updateItem(draft.id, itemId, { quantity: qty }, api);
    await refreshDraft();
  }
  async function removeItemFromDraft(itemId) {
    const draft = activeDraft.value;
    if (!draft || draft.status !== "draft") return;
    await removeItem(draft.id, itemId, api);
    await refreshDraft();
  }
  async function submitDraft() {
    const draft = activeDraft.value;
    if (!draft || draft.status !== "draft") return null;
    const updated = await requestQuote(draft.id, api);
    activeDraft.value = updated;
    try {
      await quoteInboxStore.fetchDraftFiles("dashboard");
      await quoteInboxStore.fetchClientRequests();
    } catch (err) {
      safeLogError(err, "quoteDraft.submitRefresh");
    }
    return updated;
  }
  function clearDraft() {
    activeDraft.value = null;
    currentShopSlug.value = null;
    clearSelectedFile();
  }
  async function addToQuote(productId, shopSlug, pricingMode = "SHEET") {
    return addProductToQuote(productId, shopSlug, pricingMode);
  }
  return {
    activeDraft,
    currentShopSlug,
    currentFileId,
    isLoading,
    setShop,
    selectFile,
    clearSelectedFile,
    setFile,
    loadActiveDraft,
    loadDraftForContext,
    ensureDraftForShop,
    addToQuote,
    addProductToQuote,
    addTweakedProductToQuote,
    addCustomToQuote,
    updateItemQty,
    removeItemFromDraft,
    previewPrice: (draftId) => previewPrice(draftId, api),
    submitDraft,
    refreshDraft,
    clearDraft
  };
});

export { useQuoteDraftStore as u };
//# sourceMappingURL=quoteDraft-DCmPR0Tc.mjs.map
