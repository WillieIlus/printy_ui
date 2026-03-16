import { previewPrice, getActiveDraft, requestQuote, removeItem, updateItem, addItem } from './quoteDraft-DLjjCgyl.mjs';
import { v as safeLogError } from './server.mjs';
import { ref } from 'vue';
import { defineStore } from 'pinia';

const useQuoteDraftStore = defineStore("quoteDraft", () => {
  const activeDraft = ref(null);
  const currentShopSlug = ref(null);
  const isLoading = ref(false);
  function setShop(slug) {
    currentShopSlug.value = slug;
  }
  async function loadActiveDraft() {
    const slug = currentShopSlug.value;
    if (!slug) return null;
    isLoading.value = true;
    try {
      activeDraft.value = await getActiveDraft(slug);
      return activeDraft.value;
    } finally {
      isLoading.value = false;
    }
  }
  async function addProductToQuote(productId, shopSlug, pricingMode = "SHEET") {
    setShop(shopSlug);
    let draft = activeDraft.value;
    if (!draft || currentShopSlug.value !== shopSlug) {
      draft = await loadActiveDraft();
    }
    if (!draft) return null;
    const payload = {
      item_type: "PRODUCT",
      product: productId,
      quantity: 100,
      pricing_mode: pricingMode
    };
    const item = await addItem(draft.id, payload);
    await refreshDraft();
    return item;
  }
  async function addTweakedProductToQuote(shopSlug, payload) {
    setShop(shopSlug);
    let draft = activeDraft.value;
    if (!draft || currentShopSlug.value !== shopSlug) {
      draft = await loadActiveDraft();
    }
    if (!draft) return null;
    const { tweakAndAdd } = await import('./quoteDraft-DLjjCgyl.mjs');
    const item = await tweakAndAdd(draft.id, payload);
    await refreshDraft();
    return item;
  }
  async function addCustomToQuote(payload) {
    const slug = currentShopSlug.value;
    if (!slug) return null;
    let draft = activeDraft.value;
    if (!draft || currentShopSlug.value !== slug) {
      draft = await loadActiveDraft();
    }
    if (!draft) return null;
    const item = await addItem(draft.id, payload);
    await refreshDraft();
    return item;
  }
  async function refreshDraft() {
    const draft = activeDraft.value;
    if (!draft) return;
    try {
      const slug = currentShopSlug.value;
      if (slug) {
        activeDraft.value = await getActiveDraft(slug);
      }
    } catch (err) {
      safeLogError(err, "quoteDraft.refresh");
    }
  }
  async function updateItemQty(itemId, qty) {
    const draft = activeDraft.value;
    if (!draft || draft.status !== "DRAFT") return;
    if (qty < 1) return;
    await updateItem(draft.id, itemId, { quantity: qty });
    await refreshDraft();
  }
  async function removeItemFromDraft(itemId) {
    const draft = activeDraft.value;
    if (!draft || draft.status !== "DRAFT") return;
    await removeItem(draft.id, itemId);
    await refreshDraft();
  }
  async function submitDraft() {
    const draft = activeDraft.value;
    if (!draft || draft.status !== "DRAFT") return null;
    const updated = await requestQuote(draft.id);
    activeDraft.value = updated;
    return updated;
  }
  function clearDraft() {
    activeDraft.value = null;
    currentShopSlug.value = null;
  }
  async function addToQuote(productId, shopSlug, pricingMode = "SHEET") {
    return addProductToQuote(productId, shopSlug, pricingMode);
  }
  return {
    activeDraft,
    currentShopSlug,
    isLoading,
    setShop,
    loadActiveDraft,
    addToQuote,
    addProductToQuote,
    addTweakedProductToQuote,
    addCustomToQuote,
    updateItemQty,
    removeItemFromDraft,
    previewPrice,
    submitDraft,
    refreshDraft,
    clearDraft
  };
});

export { useQuoteDraftStore as u };
//# sourceMappingURL=quoteDraft-ILOSBKof.mjs.map
