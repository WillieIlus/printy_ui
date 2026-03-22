import { v as useNuxtApp, A as API } from './server.mjs';
import { ref } from 'vue';
import { defineStore } from 'pinia';

const useQuoteStore = defineStore("quote", () => {
  const quotes = ref([]);
  const myQuotes = ref([]);
  const currentQuote = ref(null);
  const productTemplates = ref([]);
  const quoteItems = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const pagination = ref({
    count: 0,
    next: null,
    previous: null
  });
  async function fetchShopQuotes(shopSlug, params) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const response = await $api(API.shopQuotes(shopSlug), { params });
      quotes.value = response.results;
      pagination.value = { count: response.count, next: response.next, previous: response.previous };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch quotes";
    } finally {
      loading.value = false;
    }
  }
  async function fetchMyQuotes() {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      myQuotes.value = await $api(API.myQuotes());
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch quote requests";
    } finally {
      loading.value = false;
    }
  }
  async function fetchQuote(shopSlug, pk) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      currentQuote.value = await $api(API.shopQuoteDetail(shopSlug, pk));
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch quote";
    } finally {
      loading.value = false;
    }
  }
  async function createQuote(shopSlug, data) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const quote = await $api(API.shopQuotes(shopSlug), { method: "POST", body: data });
      quotes.value.push(quote);
      return { success: true, quote };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create quote";
      error.value = message;
      return { success: false, error: message };
    } finally {
      loading.value = false;
    }
  }
  async function updateQuoteStatus(shopSlug, pk, status) {
    try {
      const { $api } = useNuxtApp();
      const quote = await $api(API.shopQuoteUpdateStatus(shopSlug, pk), {
        method: "POST",
        body: { status }
      });
      currentQuote.value = quote;
      return { success: true, quote };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to update status" };
    }
  }
  async function calculateQuote(shopSlug, pk) {
    try {
      const { $api } = useNuxtApp();
      return await $api(
        API.shopQuoteCalculate(shopSlug, pk)
      );
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to calculate";
      throw err;
    }
  }
  async function duplicateQuote(shopSlug, pk) {
    try {
      const { $api } = useNuxtApp();
      const quote = await $api(API.shopQuoteDuplicate(shopSlug, pk), { method: "POST" });
      quotes.value.push(quote);
      return { success: true, quote };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to duplicate" };
    }
  }
  async function fetchQuoteItems(shopSlug, quoteId) {
    try {
      const { $api } = useNuxtApp();
      quoteItems.value = await $api(API.shopQuoteItems(shopSlug, quoteId));
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch quote items";
      throw err;
    }
  }
  async function addQuoteItem(shopSlug, quoteId, item) {
    try {
      const { $api } = useNuxtApp();
      const newItem = await $api(API.shopQuoteItems(shopSlug, quoteId), {
        method: "POST",
        body: item
      });
      quoteItems.value.push(newItem);
      if (currentQuote.value?.items) currentQuote.value.items.push(newItem);
      return { success: true, item: newItem };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to add item" };
    }
  }
  async function updateQuoteItem(shopSlug, quoteId, pk, data) {
    try {
      const { $api } = useNuxtApp();
      const item = await $api(API.shopQuoteItemDetail(shopSlug, quoteId, pk), {
        method: "PATCH",
        body: data
      });
      const idx = quoteItems.value.findIndex((i) => i.id === pk);
      if (idx !== -1) quoteItems.value[idx] = item;
      if (currentQuote.value?.items) {
        const i = currentQuote.value.items.findIndex((x) => x.id === pk);
        if (i !== -1) currentQuote.value.items[i] = item;
      }
      return { success: true, item };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to update item" };
    }
  }
  async function deleteQuoteItem(shopSlug, quoteId, pk) {
    try {
      const { $api } = useNuxtApp();
      await $api(API.shopQuoteItemDetail(shopSlug, quoteId, pk), { method: "DELETE" });
      quoteItems.value = quoteItems.value.filter((i) => i.id !== pk);
      if (currentQuote.value?.items) currentQuote.value.items = currentQuote.value.items.filter((i) => i.id !== pk);
      return { success: true };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Failed to delete item" };
    }
  }
  async function requestQuote(shopSlug, data) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const quote = await $api(API.requestQuote(shopSlug), { method: "POST", body: data });
      return { success: true, quote };
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to request quote";
      return { success: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }
  async function fetchProductTemplates(shopSlug) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      productTemplates.value = await $api(API.productTemplates(shopSlug));
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch product templates";
    } finally {
      loading.value = false;
    }
  }
  async function createProductTemplate(shopSlug, data) {
    loading.value = true;
    error.value = null;
    try {
      const { $api } = useNuxtApp();
      const product = await $api(API.productTemplates(shopSlug), {
        method: "POST",
        body: data
      });
      productTemplates.value.push(product);
      return { success: true, product };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create product template";
      error.value = message;
      return { success: false, error: message };
    } finally {
      loading.value = false;
    }
  }
  return {
    quotes,
    myQuotes,
    currentQuote,
    productTemplates,
    quoteItems,
    loading,
    error,
    pagination,
    fetchShopQuotes,
    fetchMyQuotes,
    fetchQuote,
    createQuote,
    updateQuoteStatus,
    calculateQuote,
    duplicateQuote,
    fetchQuoteItems,
    addQuoteItem,
    updateQuoteItem,
    deleteQuoteItem,
    requestQuote,
    fetchProductTemplates,
    createProductTemplate
  };
});

export { useQuoteStore as u };
//# sourceMappingURL=quote-AqUrOX8l.mjs.map
