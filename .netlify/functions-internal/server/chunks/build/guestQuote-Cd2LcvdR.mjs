import { ref, watch, computed } from 'vue';
import { defineStore } from 'pinia';

function loadFromStorage() {
  return null;
}
function saveToStorage(quote) {
  return;
}
function generateId() {
  return `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
const useGuestQuoteStore = defineStore("guestQuote", () => {
  const quote = ref(loadFromStorage());
  watch(quote, (q) => saveToStorage(), { deep: true });
  const hasItems = computed(() => (quote.value?.items?.length ?? 0) > 0);
  const itemCount = computed(() => quote.value?.items?.length ?? 0);
  function setQuote(shopSlug, shopName) {
    const existing = quote.value;
    if (existing && existing.shopSlug !== shopSlug) {
      quote.value = { shopSlug, shopName, items: [] };
    } else if (!existing) {
      quote.value = { shopSlug, shopName, items: [] };
    } else {
      quote.value = { ...existing, shopName };
    }
  }
  function addItem(shopSlug, shopName, productName, payload) {
    if (!quote.value || quote.value.shopSlug !== shopSlug) {
      quote.value = { shopSlug, shopName, items: [] };
    }
    const item = {
      id: generateId(),
      item_type: "PRODUCT",
      product: payload.product,
      product_name: productName,
      quantity: payload.quantity ?? 100,
      pricing_mode: payload.pricing_mode,
      paper: payload.paper ?? null,
      material: payload.material ?? null,
      machine: payload.machine ?? null,
      sides: payload.sides,
      color_mode: payload.color_mode,
      special_instructions: payload.special_instructions,
      finishings: payload.finishings
    };
    quote.value.items.push(item);
  }
  function updateItemQty(itemId, qty) {
    const item = quote.value?.items.find((i) => i.id === itemId);
    if (!item) return;
    item.quantity = Math.max(100, qty);
  }
  function removeItem(itemId) {
    if (!quote.value) return;
    quote.value.items = quote.value.items.filter((i) => i.id !== itemId);
    if (quote.value.items.length === 0) {
      quote.value = null;
    }
  }
  function clear() {
    quote.value = null;
  }
  function getAddPayloads() {
    return (quote.value?.items ?? []).map((i) => ({
      product: i.product,
      quantity: i.quantity,
      pricing_mode: i.pricing_mode ?? "SHEET",
      paper: i.paper ?? void 0,
      material: i.material ?? void 0,
      machine: i.machine ?? void 0,
      sides: i.sides ?? "SIMPLEX",
      color_mode: i.color_mode ?? "COLOR",
      special_instructions: i.special_instructions ?? void 0,
      finishings: i.finishings ?? void 0
    }));
  }
  return {
    quote,
    hasItems,
    itemCount,
    setQuote,
    addItem,
    updateItemQty,
    removeItem,
    clear,
    getAddPayloads
  };
});

export { useGuestQuoteStore as u };
//# sourceMappingURL=guestQuote-Cd2LcvdR.mjs.map
