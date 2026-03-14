import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

function loadFromStorage() {
  return [];
}
function saveToStorage(quotes) {
  return;
}
function generateId() {
  return `draft_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
const useLocalQuotesStore = defineStore("localQuotes", () => {
  const quotes = ref(loadFromStorage());
  watch(
    quotes,
    (val) => saveToStorage(),
    { deep: true }
  );
  function addQuote(payload) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const quote = {
      ...payload,
      id: generateId(),
      createdAt: now,
      updatedAt: now
    };
    quotes.value = [quote, ...quotes.value];
    return quote;
  }
  function updateQuote(id, payload) {
    const idx = quotes.value.findIndex((q) => q.id === id);
    if (idx === -1) return null;
    const updated = {
      ...quotes.value[idx],
      ...payload,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    quotes.value = [...quotes.value];
    quotes.value[idx] = updated;
    return updated;
  }
  function getById(id) {
    return quotes.value.find((q) => q.id === id) ?? null;
  }
  function removeQuote(id) {
    const idx = quotes.value.findIndex((q) => q.id === id);
    if (idx === -1) return false;
    quotes.value = quotes.value.filter((q) => q.id !== id);
    return true;
  }
  return {
    quotes,
    addQuote,
    updateQuote,
    getById,
    removeQuote
  };
});

export { useLocalQuotesStore as u };
//# sourceMappingURL=localQuotes-D2lGtMae.mjs.map
